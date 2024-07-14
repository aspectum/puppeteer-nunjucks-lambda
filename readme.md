# puppeteer-nunjucks-lambda

This code creates a lambda capable of getting an html [`nunjucks`](https://github.com/mozilla/nunjucks) template file from an `S3` bucket, rendering it with the given variables, generating a **PDF** from it with [`puppeteer`](https://github.com/puppeteer/puppeteer) and uploading the generated file back to the bucket.

For more information, check out [@sparticuz/chromium](https://github.com/Sparticuz/chromium).

## Building

1. Install dependencies
    ```sh
    yarn
    ```

2. Build
    ```sh
    yarn build
    ```

3. Package the files in `dist` and deploy however you wish (**`index.js` must be on the root of the zip file!!**)

## Lambda configuration

1. From my tests, this worked with both the `Node.js 18.x` and `Node.js 20.x` runtimes.

2. Add a Lambda Layer of the appropriate version. Again, check out [@sparticuz/chromium](https://github.com/Sparticuz/chromium).

3. Make sure your Lambda is using the Layer.

4. Add the necessary environment variables (check the code).

5. Make sure the Lambda has enough memory to run chrome (start with 1024 MB and tweak from there).

6. Allow your lambda to download files from and upload files to an `S3` bucket. To do that, make sure your Lambda **IAM role** has a policy like
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "ExampleStmt",
          "Action": ["s3:GetObject", "s3:PutObject"],
          "Effect": "Allow",
          "Resource": ["arn:aws:s3:::<<YOUR-BUCKET>>/*"]
        }
      ]
    }
    ```
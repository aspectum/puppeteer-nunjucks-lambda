import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import chromium from "@sparticuz/chromium";
import { APIGatewayProxyResult, Handler } from "aws-lambda";
import { renderString } from "nunjucks";
import puppeteer from "puppeteer-core";

const ENV_S3_BUCKET = process.env.s3_bucket;
const ENV_S3_BUCKET_REGION = process.env.s3_bucket_region;

const client = new S3Client({ region: ENV_S3_BUCKET_REGION });

interface EventBody {
  templateS3Key: string;
  variables: Record<string, string>;
}

export const handler: Handler<EventBody> = async (
  evt,
  context,
  callback
): Promise<APIGatewayProxyResult> => {
  console.log("Starting...");
  console.log("Event: ", JSON.stringify(evt));

  try {
    const html = await renderTemplate(evt);

    const buffer = await getPdfBuffer(html);

    const outputKey = await saveFile(buffer);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lambda ran successfully!",
        outputKey,
      }),
    };
  } catch (err) {
    console.error("Error!");
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error while running the function!",
        errorName: (err as Error).name,
        errorMessage: (err as Error).message,
        errorStack: (err as Error).stack,
      }),
    };
  }
};

const renderTemplate = async (body: EventBody) => {
  const template = await getTemplate(body.templateS3Key);

  const rendered = renderString(template, body.variables);

  return rendered;
};

const getTemplate = async (templateS3Key: string) => {
  const response = await client.send(
    new GetObjectCommand({
      Bucket: ENV_S3_BUCKET,
      Key: templateS3Key,
    })
  );

  if (!response.Body) throw new Error("No response.Body");

  const bytes = await response.Body.transformToByteArray();

  return new TextDecoder().decode(bytes);
};

const saveFile = async (file: Buffer) => {
  const key = `${new Date().toISOString()}.pdf`;

  await client.send(
    new PutObjectCommand({
      Bucket: ENV_S3_BUCKET,
      Key: key,
      Body: file,
    })
  );

  return key;
};

const getPdfBuffer = async (html: string) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.setContent(html);

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: false,
    margin: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
  });

  await page.close();

  await browser.close();

  return buffer;
};

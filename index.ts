import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyResult, Handler } from "aws-lambda";

const ENV_S3_BUCKET = process.env.s3_bucket;
const ENV_S3_BUCKET_REGION = process.env.s3_bucket_region;

const client = new S3Client({ region: ENV_S3_BUCKET_REGION });

interface EventBody {
  templateS3Key: string;
}

export const handler: Handler<EventBody> = async (
  evt,
  context,
  callback
): Promise<APIGatewayProxyResult> => {
  console.log("Starting...");
  console.log("Event: ", JSON.stringify(evt));

  try {
    const template = await getTemplate(evt.templateS3Key);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lambda ran successfully!",
        template,
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

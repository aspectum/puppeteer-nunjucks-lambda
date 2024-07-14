import { APIGatewayProxyResult, Handler } from "aws-lambda";

export const handler: Handler = async (
  evt,
  context,
  callback
): Promise<APIGatewayProxyResult> => {
  console.log("Starting...");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "It works!",
      mirror: evt,
    }),
  };
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { id } = event.pathParameters
    const command = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id }
    })

    const response = await docClient.send(command)
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

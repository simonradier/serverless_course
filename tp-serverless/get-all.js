import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const command = new ScanCommand({
      TableName: process.env.TABLE_NAME
    })

    const response = await docClient.send(command)
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

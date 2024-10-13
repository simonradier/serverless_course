import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const task = JSON.parse(event.body)
    const id = randomUUID()
    const command = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: { id, ...task}
    })

    const response = await docClient.send(command)
    return { statusCode: 200, body: JSON.stringify({ message : 'inserted', id }) };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

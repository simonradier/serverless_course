import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { randomUUID } from 'crypto';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.httpMethod === 'POST') {
            try {
                const task = JSON.parse(event.body ?? '{}');
                const id = randomUUID();
                const date = new Date().toUTCString();
                const command = new PutCommand({
                    TableName: process.env.TABLE_NAME,
                    Item: { id, date, ...task },
                });

                const response = await docClient.send(command);
                console.log(response);
                return { statusCode: 200, body: JSON.stringify({ message: 'inserted', id }) };
            } catch (error: any) {
                return { statusCode: 500, body: error.message };
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `method : ${event.httpMethod}, path: ${event.path}`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

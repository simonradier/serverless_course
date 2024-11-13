import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
console.log('Debut de ma lambda');

const delaySync = (ms: number) => {
    // Une fonction moche pour créer un timer syncrhone
    const now = Date.now();
    while (Date.now() - now < ms) {}
    return;
};

delaySync(2000); // On imagine ici une connection à une base de données
console.log('Connecté à la BDD');

let message = 'Hello World';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Debut du lambdaHandler');
        if (event.httpMethod === 'POST') {
            console.log('Fin du lambdaHandler POST');
            message = event.body ?? '';
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message }),
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

console.log('Fin de ma lambda');

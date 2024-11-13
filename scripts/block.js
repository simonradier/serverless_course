import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

const envList = [
    'dev',
    'test',
    'staging',
    'prod'
]
const env = process.argv[2]

process.env.AWS_REGION = "eu-west-3"

if (process.argv.length < 3 || !envList.includes(env)) {
    console.log('error : missing env (test,dev,staging,prod) parameter')
    console.log(env)
    process.exit(1)
}
try {

    const awsReq2 = execSync(`aws iam list-users --no-cli-pager --query "Users[?UserName!='root'].UserName"`)
    const userList = JSON.parse(awsReq2.toString())
    console.log("blocking the users")
    for (const user of userList) {
        process.stdout.write(`Deleting the user ${user} : `)
        execSync(`aws iam remove-user-from-group --user-name ${user} --group-name epita_cours_serverless`)
        process.stdout.write(`Done\n`)
    }
    console.log("Users the cleaned")

    process.exit(0)
} catch (err) {
    console.log('Result of the update: failure')
    console.log(err);
    process.exit(2)
}


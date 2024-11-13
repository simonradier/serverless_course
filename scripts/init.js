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
    // Create users
    console.log("create users")
    const awsReq1 = execSync(`cat ../students.txt`)
    const studentList = awsReq1.toString().split('\n')
    execSync(`echo Login, AccessKey, SecretKey > students.txt`)
    for (const student of studentList) {
        console.log(`creating the account for ${student}`)
        execSync(`aws iam create-user --user-name ${student} --tags '{"Key": "Source", "Value": "TP Epita"}'`)
        console.log(`adding the account for ${student} to epita_cours_serverless group`)
        execSync(`aws iam add-user-to-group --user-name ${student} --group-name epita_cours_serverless`)
        console.log(`enabling the access to the AWS console`)
        const pwd = "*" + [...student].reverse().join("") + 42;
        execSync(`aws iam create-login-profile --user-name ${student} --password ${pwd}`)
        const accessInfo = JSON.parse(execSync(`aws iam create-access-key --user-name ${student}`).toString())
        const { AccessKeyId, SecretAccessKey } = accessInfo.AccessKey
        execSync(`echo ${student}, ${AccessKeyId}, ${SecretAccessKey} >> students.txt`)
        console.log(`account created for ${student}`)
    }
    console.log("users created")
    process.exit(0)
} catch (err) {
    console.log('Result of the update: failure')
    console.log(err);
    process.exit(2)
}


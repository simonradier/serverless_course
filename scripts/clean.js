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
    // Clean the bucket
    console.log("Cleaning the buckets")
    const awsReq1 = execSync(`aws s3api list-buckets --no-paginate --no-cli-pager --query "Buckets[].Name"`)
    const bucketList = JSON.parse(awsReq1.toString())
    for (const bucket of bucketList) {
        console.log(`Emptying the bucket ${bucket}`)
        execSync(`aws s3api delete-objects --bucket ${bucket} --delete "$(aws s3api list-object-versions --bucket ${bucket} --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}')"`)
        execSync(`aws s3api delete-objects --bucket ${bucket} --delete "$(aws s3api list-object-versions --bucket ${bucket} --query='{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}')"`)
        console.log(`Deleting the bucket ${bucket}`)
        execSync(`aws s3api delete-bucket --bucket ${bucket}`)
        console.log(`Bucket ${bucket} deleted`)
    }
    console.log("Buckets cleansed")
    const awsReq2 = execSync(`aws iam list-users --no-cli-pager --query "Users[?UserName!='root'].UserName"`)
    const userList = JSON.parse(awsReq2.toString())
    console.log("Cleaning the users")
    for (const user of userList) {
        process.stdout.write(`Deleting the user ${user} : `)
        execSync(`aws iam remove-user-from-group --user-name ${user} --group-name epita_cours_serverless`)
        const accessKeyId = execSync(`aws iam list-access-keys --user-name ${user} --query "AccessKeyMetadata[0].AccessKeyId" | sed 's/"//g'`).toString()
        if (!accessKeyId.includes("null"))
            execSync(`aws iam delete-access-key --user-name ${user} --access-key-id ${accessKeyId} `)
        execSync(`aws iam delete-login-profile --user-name ${user}`)
        execSync(`aws iam delete-user --user-name ${user}`)
        process.stdout.write(`Done\n`)
    }
    console.log("Users the cleaned")

    process.exit(0)
} catch (err) {
    console.log('Result of the update: failure')
    console.log(err);
    process.exit(2)
}


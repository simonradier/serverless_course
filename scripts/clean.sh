#!/bin/sh

AWS_REGION=eu-west-3

aws s3api list-buckets --no-cli-pager --query "Buckets.Name"
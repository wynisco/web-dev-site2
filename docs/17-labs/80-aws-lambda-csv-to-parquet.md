# Converting CSV to Parquet with AWS Lambda Trigger

*Create an S3 bucket and IAM user with user-defined policy. Create Lambda layer and lambda function and add the layer to the function. Add S3 trigger for auto-transformation from csv to parquet and query with Glue.*

## Process flow

![](/img/tutorials/lambda-etl/process_flow.drawio.svg)

## Create IAM role and policy

```json title="role-trust.json"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

Once the trust policy is ready that AWS lambda will use to assume the role, we will use AWS cli to create the role:

```sh
aws iam create-role --role-name {role_name} --assume-role-policy-document file://role-trust.json
```

```json title="lamdba-etl-policy.json"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:PutLogEvents",
                "logs:CreateLogGroup",
                "logs:CreateLogStream"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::wysde2-test/*",
                "arn:aws:s3:::wysde2-test"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "glue:*"
            ],
            "Resource": "*"
        }
    ]
}
```

We are also creating a policy using AWS cli:

```sh
aws iam create-policy --policy-name {policy_name} --policy-document file://lamdba-etl-policy.json
```

Now we are going to attach the policy to the role:

```sh
aws iam attach-role-policy --policy-arn {policy_arn} --role-name {role_name}
```

## Setup the Lambda layer

We will be using AWS wrangler python library which is not available in the AWS lambda and therefore we have to create a lambda layer of this library that we will attach to our lambda function later:

```sh
wget -q --show-progress https://github.com/awslabs/aws-data-wrangler/releases/download/2.10.0/awswrangler-layer-2.10.0-py3.8.zip

aws lambda publish-layer-version --layer-name {layer_name} \
--description "this enables the usage of aws data wrangler library in lambda" \
--zip-file fileb://awswrangler-layer-2.10.0-py3.8.zip \
--compatible-runtimes python3.8 \
--cli-connect-timeout 6000
```

:::note
This layer is as per the lambda's python version 3.8 that we would use. But feel free to change the version of lambda and layer. Just make sure these versions are compatible.
:::

## Develop the python code

```py
import boto3
import awswrangler as wr
from urllib.parse import unquote_plus

def lambda_handler(event, context):
    # Get the source bucket and object name as passed to the Lambda function
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
    
    # We will set the DB and table name based on the last two elements of 
    # the path prior to the file name. If key = 'dms/sakila/film/LOAD01.csv',
    # then the following lines will set db to sakila and table_name to 'film'
    key_list = key.split("/")
    print(f'key_list: {key_list}')
    # db_name = key_list[len(key_list)-3]
    # table_name = key_list[len(key_list)-2]
    db_name = key_list[-4]
    table_name = key_list[-2]
    
    print(f'Bucket: {bucket}')
    print(f'Key: {key}')
    print(f'DB Name: {db_name}')
    print(f'Table Name: {table_name}')
    
    input_path = f"s3://{bucket}/{key}"
    print(f'Input_Path: {input_path}')
    output_path = f"s3://wysde2-test/{db_name}/cleaned/{table_name}"
    print(f'Output_Path: {output_path}')
    
    input_df = wr.s3.read_csv([input_path])
    
    current_databases = wr.catalog.databases()
    wr.catalog.databases()
    if db_name not in current_databases.values:
        print(f'- Database {db_name} does not exist ... creating')
        wr.catalog.create_database(db_name)
    else:
        print(f'- Database {db_name} already exists')
    
    result = wr.s3.to_parquet(
        df=input_df, 
        path=output_path, 
        dataset=True,
        database=db_name,
        table=table_name,
        mode="append")
        
    print("RESULT: ")
    print(f'{result}')
    
    return result
```

## Setup the AWS Lambda

Go the the AWS Lambda console and create a lambda function. You can name it anythin. Here is the checklist you need to follow to configure the lambda:

1. Select the role that we created.
2. Also select the layer that we created.
3. Copy the code and deploy it.
4. Add an S3 trigger with `.csv` suffix filter. Select S3 bucket path.

## Run the pipeline

Now upload any csv file into the S3 bucket where lambda is listening on. The lambda will be triggered and push the converted parquet file in the destination path and also update the glue catalog.

## Resources

1. https://colab.research.google.com/gist/sparsh-ai/46b1891791a4bdd7981638529169a80b/data-engineering-lab-s3-lambda-csv-to-parquet.ipynb
2. https://api.klayers.cloud//api/v2/p3.8/layers/latest/us-east-1/html
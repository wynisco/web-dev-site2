# Data Transformation with Glue Studio ETL

You can use AWS Glue Studio to create jobs that extract structured or semi-structured data from a data source, perform a transformation of that data, and save the result set in a data target.

In this tutorial, you will create a job in AWS Glue Studio using Amazon S3 as the Source and Target. By completing these steps, you will learn how visual jobs are created and how to edit nodes, the component building blocks in the visual job editor.

You will learn how to:

- Configure the data source node to a data source. In this tutorial, you will set the data source to Amazon S3.
- Apply and edit a transform node. In this tutorial, you will apply the ApplyMapping transform to the job.
- Configure the data target node. In this tutorial, you will set the data target to Amazon S3.
- View and edit the job script.
- Run the job and view run details for the job.

## Step 1: Launch the AWS CloudFormation stack

We are going to use the following Cloudformation stack:

```yaml title="stack.yaml"
AWSTemplateFormatVersion: '2010-09-09'
Resources:
# Create an AWS Glue database
  AWSGlueStudioTicketsYYZDB:
    Type: AWS::Glue::Database
    Properties:
      CatalogId: !Ref AWS::AccountId
      DatabaseInput:
        Name: yyz-tickets	
        Description: Database to hold tables for yyz  parking tickets data
####
  AWSGlueStudioS3Bucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: !Sub 'glue-studio-blog-${AWS::AccountId}'
#####
  AWSGlueStudioRole:
    Type: "AWS::IAM::Role"
    Properties:
      RoleName: AWSGlueStudioRole
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - glue.amazonaws.com
            Action:
              - sts:AssumeRole
      Policies:
        - PolicyName: datadest
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - "s3:GetObject"
                  - "s3:PutObject"
                  - "s3:ListBucket"
                  - "s3:DeleteObject"
                Resource:
                  - !Join ['', ['arn:aws:s3:::', !Ref 'AWSGlueStudioS3Bucket', /*]]
                  - "arn:aws:s3:::aws-bigdata-blog/artifacts/gluestudio/*"            
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole
      Path: "/"
###
# Create an AWS Glue table
  AWSGlueStudioTableTickets:
    # Creating the table waits for the database to be created
    DependsOn: AWSGlueStudioTicketsYYZDB
    Type: AWS::Glue::Table
    Properties:
      CatalogId: !Ref AWS::AccountId
      DatabaseName: !Ref AWSGlueStudioTicketsYYZDB
      TableInput:
        Name: tickets
        Description: Define columns of the tickets table
        TableType: EXTERNAL_TABLE
        Parameters: {
    "classification": "parquet",
    "typeOfData": "file"
  }
#       ViewExpandedText: String
        StorageDescriptor:
          OutputFormat: org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat
          Columns:
          - Name: tag_number_masked
            Type: string
          - Name: date_of_infraction
            Type: string
          - Name: ticket_date
            Type: string
          - Name: ticket_number
            Type: decimal(38,0)
          - Name: officer
            Type: decimal(38,0)
          - Name: infraction_code
            Type: decimal(38,0)
          - Name: infraction_description
            Type: string
          - Name: set_fine_amount
            Type: decimal(38,0)
          - Name: time_of_infraction
            Type: decimal(38,0)
          - Name: location1
            Type: string
          - Name: location2
            Type: string
          - Name: location3
            Type: string
          - Name: location4
            Type: string
          - Name: province
            Type: string                  			
          InputFormat: org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat
          Location: s3://aws-bigdata-blog/artifacts/gluestudio/tickets/
          SerdeInfo:
            Parameters:
              field.delim: ","
            SerializationLibrary: org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe
```

To launch the stack, we will use aws cli command:

```sh
aws cloudformation create-stack \
	--stack-name GlueETLTickets \
	--template-body file://stack.yaml \
	--capabilities CAPABILITY_NAMED_IAM
```

This stack will create the 4 resources - Glue Database, Glue Table, S3 Bucket and IAM Role.

## Step 2: Create the Glue ETL Job

Refer to the following script to create the job in Glue ETL Studio. Feel free to use visual editor to design the job flow and configuration.

```py
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Script generated for node S3 bucket
S3bucket_node1 = glueContext.create_dynamic_frame.from_catalog(
    database="yyz-tickets", table_name="tickets", transformation_ctx="S3bucket_node1"
)

# Script generated for node ApplyMapping
ApplyMapping_node2 = ApplyMapping.apply(
    frame=S3bucket_node1,
    mappings=[
        ("tag_number_masked", "string", "tag_number_masked", "string"),
        ("date_of_infraction", "string", "date_of_infraction", "string"),
        ("ticket_date", "string", "ticket_date", "string"),
        ("ticket_number", "decimal", "ticket_number", "decimal"),
        ("officer", "decimal", "officer_name", "decimal"),
        ("infraction_code", "decimal", "infraction_code", "decimal"),
        ("infraction_description", "string", "infraction_description", "string"),
        ("set_fine_amount", "decimal", "set_fine_amount", "decimal"),
        ("time_of_infraction", "decimal", "time_of_infraction", "decimal"),
    ],
    transformation_ctx="ApplyMapping_node2",
)

# Script generated for node S3 bucket
S3bucket_node3 = glueContext.write_dynamic_frame.from_options(
    frame=ApplyMapping_node2,
    connection_type="s3",
    format="glueparquet",
    connection_options={
        "path": f"s3://glue-studio-blog-{account_number}/parking_tickets_count/",
        "partitionKeys": [],
    },
    format_options={"compression": "snappy"},
    transformation_ctx="S3bucket_node3",
)

job.commit()
```

:::note
In the above script, make sure to change the account number in target S3 path.
:::

Once you create the job and save it, run the job and wait untils it gets completed. It generally takes less than 2 minutes to complete.

After the job completes, check the target s3 path. There should be files in that path.

## Step 3: Add the table in Glue Catalog

Once the data is available in the target S3 path, we will register the data as table in the glue catalog. For this, one option could be to send the glue crawler to the s3 path and it will fetch the result. Other option is to manually add the table by using the following command in AWS Athema:

```sql
CREATE EXTERNAL TABLE `tickets_transformd_new` (
    ticket_date STRING,
    infraction_description STRING,
    officer_name FLOAT,
    set_fine_amount FLOAT
)
STORED AS PARQUET
LOCATION 's3://glue-studio-blog-{account_number}/parking_tickets_count/'
tblproperties ("parquet.compression"="SNAPPY");
```

You will see a new table added in the glue database. Now run the following query to validate that the transformed data is successfully loaded in the glue table:

```sql
SELECT * FROM tickets_transformd_new LIMIT 10;
```

## Next steps

Follow [this](https://docs.aws.amazon.com/glue/latest/ug/tutorial-create-job.html#tutorial-create-job-run-job) official tutorial to explore further.
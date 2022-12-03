# AWS Glue

![](/img/tools/awsglue/key_capabilities.png)

## AWS Glue Studio

AWS Glue Studio is a new graphical interface that makes it easy to create, run, and monitor extract, transform, and load (ETL) jobs in AWS Glue. You can visually compose data transformation workflows and seamlessly run them on AWS Glue’s Apache Spark-based serverless ETL engine. You can inspect the schema and data results in each step of the job.

AWS Glue Studio is designed not only for tabular data, but also for semi-structured data, which is difficult to render in spreadsheet-like data preparation interfaces. Examples of semi-structured data include application logs, mobile events, Internet of Things (IoT) event streams, and social feeds.

When creating a job in AWS Glue Studio, you can choose from a variety of data sources that are stored in AWS services. You can quickly prepare that data for analysis in data warehouses and data lakes. AWS Glue Studio also offers tools to monitor ETL workflows and validate that they are operating as intended. You can preview the dataset for each node. This helps you to debug your ETL jobs by displaying a sample of the data at each step of the job.

AWS Glue Studio provides a visual interface that makes it easy to:

- Pull data from an Amazon S3, Amazon Kinesis, or JDBC source.
- Configure a transformation that joins, samples, or transforms the data.
- Specify a target location for the transformed data.
- View the schema or a sample of the dataset at each point in the job.
- Run, monitor, and manage the jobs created in AWS Glue Studio.

Explore further:

1. [Data Preparation on AWS: Comparing ELT Options to Cleanse and Normalize Data](https://knowledgetree.notion.site/Data-Preparation-on-AWS-Comparing-ELT-Options-to-Cleanse-and-Normalize-Data-Shared-5a16da581ef845d2a7e38f06ca0b35c0)
2. [Transform JSON / CSV files to Parquet through Aws Glue](https://hkdemircan.medium.com/how-can-we-json-css-files-transform-to-parquet-through-aws-glue-465773b43dad)
3. [Data Transformation at scale with AWS Glue](https://knowledgetree.notion.site/Data-Transformation-at-scale-with-AWS-Glue-Shared-65b9c00215bf42e69d94365a07a82f5a)

## AWS Glue interactive sessions

With AWS Glue interactive sessions, you can rapidly build, test, and run data preparation and analytics applications. Interactive Sessions provides a programmatic and visual interface for building and testing extract, transform, and load (ETL) scripts for data preparation. Interactive sessions run Apache Spark analytics applications and provide on-demand access to a remote Spark runtime environment. AWS Glue transparently manages serverless Spark for these interactive sessions.

Unlike AWS Glue development endpoints, AWS Glue interactive sessions are serverless with no infrastructure to manage. You can start interactive sessions very quickly. Interactive sessions have a 1-minute billing minimum with cost-control features. This reduces the cost of developing data preparation applications.

Because interactive sessions are flexible, you can build and test applications from the environment of your choice. You can create and work with interactive sessions through the AWS Command Line Interface and the API. You can use Jupyter-compatible notebooks to visually author and test your notebook scripts. Interactive sessions provide an open-source Jupyter kernel that integrates almost anywhere that Jupyter does, including integrating with IDEs such as PyCharm, IntelliJ, and VS Code. This enables you to author code in your local environment and run it seamlessly on the interactive sessions backend.

Using the Interactive Sessions API, customers can programmatically run applications that use Apache Spark analytics without having to manage Spark infrastructure. You can run one or more Spark statements within a single interactive session.

Interactive sessions therefore provide a faster, cheaper, more-flexible way to build and run data preparation and analytics applications.
# Snowflake

Snowflake is the Data Cloud that enables you to build data-intensive applications without operational burden, so you can focus on data and analytics instead of infrastructure management.

> Snowflake is the next big thing, and it is becoming a full-blown data ecosystem. With the level of scalability and efficiency in handling massive volumes of data and also with several new concepts in it, this is the right time to wrap your head around Snowflake and have it in your toolkit.

Snowflake started out because its founders understood and knew the truth about how users suffered with traditional relational OLAP solutions. Makes sense, they came from Oracle. They also understood how the cloud works. The founders didn't want to port an Oracle-like database over to the cloud as is. That would not solve the problems that the user base was experiencing. What were users suffering from: scale, performance, concurrency, and tons of expensive resources to keep the lights on! So they built Snowflake to solve these problems by taking all the good of a relational database platform and applying it to the cloud. The cloud allows for simple manifestation of environments with elasticity for size or scale.

Who competes with Snowflake directly? All cloud-based OLAP databases like: Redshift, Teradata, Oracle, Synapse, and Databricks. Yes, dare I say it Cloudera. Snowflake is starting to blur the lines a bit with Iceberg (Data Lake), SnowPark(Data Science/Data Engineering), Data Sharing/Marketplace(Third Party Data), and coming soon: Unistore (OLTP).

## Architecture

Even the improved traditional data platforms, especially those that were implemented on premises, couldn’t adequately address modern data problems or solve the long-standing scalability issue. The Snowflake team made the decision to take a unique approach. Rather than trying to incrementally improve or transform existing software architectures, they built an entirely new, modern data platform, just for the cloud, that allows multiple users to concurrently share live data.

The unique Snowflake design physically separates but logically integrates storage and compute along with providing services such as security and management. As we explore the many unique Snowflake features throughout the upcoming chapters, you’ll be able to see for yourself why the Snowflake architecture is the only architecture that can enable the Data Cloud.

The Snowflake hybrid-model architecture is composed of three layers, which are shown in the following image: the cloud services layer, the compute layer, and the data storage layer.

![](/img/tools/snowflake_arch.png)

Watch this video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZOqmqfe8WvM" title="Snowflake Workloads Explained: Data Engineering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Object hierarchy

![](/img/tools/snowflake_object_hierarchy.png)

## Snowpark

With Snowpark, developers can program using a familiar construct like the DataFrame, and bring in complex transformation logic through UDFs, and then execute directly against Snowflake’s processing engine, leveraging all of its performance and scalability characteristics in the Data Cloud.

Snowpark provides several benefits over how developers have designed and coded data-driven solutions in the past:

- Simplifies architecture and data pipelines by bringing different data users to the same data platform, and processes against the same data without moving it around.
- Accelerates data pipeline workloads by executing with performance, reliability, and scalability with Snowflake’s elastic performance engine.
- Eliminates maintenance and overhead with managed services and near-zero maintenance.
- Creates a single governance framework and a single set of policies to maintain by using a single platform.
- Provides a highly secure environment with administrators having full control over which libraries are allowed to execute inside the Java/Scala runtimes for Snowpark.

## Snowflake Data Ingestion/Loading and Extraction

### Snowflake Data Loading Options

#### Batch/Bulk Data Ingestion

1. Write/load the data into your staging location (S3 bucket)
2. Ingest the data into Snowflake in batches at frequent time intervals using:
   1. Snowflake copy commands scheduled using Snowflake tasks
   2. Trigger copy commands using Python/Glue/Airflow running at specified time intervals

#### Real-time Data Ingestion

1. Write/load the data into your staging location (S3 bucket) and ingest the data in real-time using:
   1. Snowpipe (continuous data ingestion)
   2. Airflow S3 sensors/triggers
2. Kafka-Snowflake Connector for real-time data ingestion

## SnowSQL

SnowSQL is the command line client for connecting to Snowflake to execute SQL queries and perform all DDL and DML operations, including loading data into and unloading data out of database tables. It is a modern command line tool designed for Snowflake Cloud data warehouse that is built on high security standards and has tight integration with Snowflake core architecture. It has very powerful scripting capability, and it can be further enhanced when used along with Python. Also, to upload/download any files to Snowflake internal stage you need SnowSql as put and get command work only with command line and not Web UI.

## SnowPipe

> Getting the volume and variety of today’s data into your data warehouse is paramount to obtain immediate, data-driven insight. Unfortunately, legacy data warehouses require batch-oriented loading and scheduling at off-peak times to avoid contention with the crucial needs of data analytics users. Snowpipe is a new data loading service for Snowflake that significantly improves the process of making data available for analysis.

Snowpipe is an event based data ingest tool. Snowpipe provides two main methods for triggering a data loading event. This trigger could be a cloud storage notification (i.e. AWS S3 ObjectCreated event) or by directly calling the Snowpipe insertFiles REST API.

When building data applications, your users count on seeing the latest. Stale data is less actionable and could lead to costly errors. That's why continuously generated data is essential. Snowflake provides a data loading tool to drive updates, ensuring your databases are accurate by updating tables in micro-batches.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jKJTqfvwFOg" title="Snowpipe: Load data fast, analyze even faster" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## References

1. [Introduction to Snowflake](snowflake/README.md)
2. [Create Snowflake Account](workspace-setup/create-snowflake-account.md)
3. [Snowflake Data Query with Python](snowflake/snowflakePython)
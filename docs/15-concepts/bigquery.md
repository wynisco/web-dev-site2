# BigQuery

BigQuery is server-less, highly scalable, and cost-effective Data warehouse designed for Google cloud Platform (GCP) to store and query petabytes of data. The query engine is capable of running SQL queries on terabytes of data in a matter of seconds, and petabytes in only minutes. You get this performance without having to manage any infrastructure and without having to create or rebuild indexes. 

BigQuery supports standard SQL, so if you ever develop with relational database like Oracle, PostgreSQL, MySQL, Microsoft SQL Server, etc, it is easy to familiarize yourself with BigQuery. There are a few BigQuery functions to support modern-day requirements, and learning about them will make your job easier.

There is no infrastructure required. We don’t need to worry about the size of storage, number of processors, or memory allocation for processing query. BigQuery scales automatically to run query, and then release the resource when it is done. We don't even charged for memory or processor allocation.

## ETL, EL, and ELT

The traditional way to work with data warehouses is to start with an Extract, Transform, and Load (ETL) process, wherein raw data is extracted from its source location, transformed, and then loaded into the data warehouse. Indeed, BigQuery has a native, highly efficient columnar storage format9 that makes ETL an attractive methodology. The data pipeline, typically written in either Apache Beam or Apache Spark, extracts the necessary bits from the raw data (either streaming data or batch files), transforms what it has extracted to do any necessary cleanup or aggregation, and then loads it into BigQuery. The reference architecture for ETL into BigQuery uses Apache Beam pipelines executed on Cloud Dataflow and can handle both streaming and batch data using the same code.

Even though building an ETL pipeline in Apache Beam or Apache Spark tends to be quite common, it is possible to implement an ETL pipeline purely within BigQuery. Because BigQuery separates compute and storage, it is possible to run BigQuery SQL queries against CSV (or JSON or Avro) files that are stored as-is on Google Cloud Storage; this capability is called federated querying. You can take advantage of federated queries to extract the data using SQL queries against data stored in Google Cloud Storage, transform the data within those SQL queries, and then materialize the results into a BigQuery native table.

If transformation is not necessary, BigQuery can directly ingest standard formats like CSV, JSON, or Avro into its native storage—an EL (Extract and Load) workflow, if you will. The reason to end up with the data loaded into the data warehouse is that having the data in native storage provides the most efficient querying performance.

We strongly recommend that you design for an EL workflow if possible, and drop to an ETL workflow only if transformations are needed. If possible, do those transformations in SQL, and keep the entire ETL pipeline within BigQuery. If the transforms will be difficult to implement purely in SQL, or if the pipeline needs to stream data into BigQuery as it arrives, build an Apache Beam pipeline and have it executed in a serverless fashion using Cloud Dataflow. Another advantage of implementing ETL pipelines in Beam/Dataflow is that, because this is programmatic code, such pipelines integrate better with Continuous Integration (CI) and unit testing systems.

Besides the ETL and EL workflows, BigQuery makes it possible to do an Extract, Load, and Transform (ELT) workflow. The idea is to extract and load the raw data as-is and rely on BigQuery views to transform the data on the fly. An ELT workflow is particularly useful if the schema of the raw data is in flux. For example, you might still be carrying out exploratory work to determine whether a particular timestamp needs to be corrected for the local time zone. The ELT workflow is useful in prototyping and allows an organization to start deriving insights from the data without having to make potentially irreversible decisions too early.

## Where does BigQuery fit in the data lifecycle?

BigQuery is part of Google Cloud’s comprehensive data analytics platform that covers the entire analytics value chain including ingesting, processing, and storing data, followed by advanced analytics and collaboration. BigQuery is deeply integrated with GCP analytical and data processing offerings, allowing customers to set up an enterprise ready cloud-native data warehouse.

At each stage of the data lifecycle, GCP provides multiple services to manage data. This means customers can select a set of services tailored to their data and workflow.

![](/img/concepts/bigquery/data-lifecycle.png)

## Ingesting data into BigQuery

BigQuery supports several ways to ingest data into its managed storage. The specific ingestion method depends on the origin of the data. For example, some data sources in GCP, like Cloud Logging and Google Analytics, support direct exports to BigQuery.

BigQuery Data Transfer Service enables data transfer to BigQuery from Google SaaS apps (Google Ads, Cloud Storage), Amazon S3, and other data warehouses (Teradata, Redshift).

Streaming data, such as logs or IoT device data, can be written to BigQuery using Cloud Dataflow pipelines, Cloud Dataproc jobs, or directly using the BigQuery stream ingestion API.

## BigQuery Architecture

BigQuery’s serverless architecture decouples storage and compute and allows them to scale independently on demand. This structure offers both immense flexibility and cost controls for customers because they don’t need to keep their expensive compute resources up and running all the time. This is very different from traditional node-based cloud data warehouse solutions or on-premise massively parallel processing (MPP) systems. This approach also allows customers of any size to bring their data into the data warehouse and start analyzing their data using Standard SQL without worrying about database operations and system engineering.

![](/img/concepts/bigquery/arch.png)
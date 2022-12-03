# Interesting Reads

## E of ETL - A Guide To Modern Batch Data Warehousing by Daniel Mateus Pires

> Redefining the batch data extraction patterns and the data lake using “Functional Data Engineering”

The last decades have been greatly transformative for the Data Analytics landscape. With the decrease in storage costs and the adoption of cloud computing, the restrictions that guided the design of data tools were made obsolete and so — the data engineering tools and techniques had to evolve.

I suspect many data teams are taking on complex projects to modernize their data engineering stack and use the new technologies at their disposal. Many others are designing new data ecosystems from scratch in companies pursuing new business opportunities made possible by advances in Machine Learning and Cloud computing.

A pre-Hadoop batch data infrastructure was typically made of a Data Warehouse (DW) appliance tightly coupled with its storage (e.g. Oracle or Teradata DW), an Extract Transform Load (ETL) tool (e.g. SSIS or Informatica) and a Business Intelligence (BI) tool (e.g. Looker or MicroStrategy). The philosophy and design principles of the Data organization, in this case were driven by well-established methodologies as outlined in books such as Ralph Kimball’s The Data Warehouse Toolkit (1996) or Bill Inmon’s Building The Data Warehouse (1992).

I contrast this approach to its modern version that was born of Cloud technology innovations and reduced storage costs. In a modern stack, the roles that were handled by the Data Warehouse appliance are now handled by specialized components like, file formats (e.g. Parquet, Avro, Hudi), cheap cloud storage (e.g. AWS S3, GS), metadata engines (e.g. Hive metastore), query/compute engines (e.g. Hive, Presto, Impala, Spark) and optionally, cloud-based DWs (e.g. Snowflake, Redshift). Drag and drop ETL tools are less common, instead, a scheduler/orchestrator (e.g. Airflow, Luigi) and “ad-hoc” software logic take on this role. The “ad-hoc” ETL software is sometimes found in separate applications and sometimes within the scheduler framework which is extensible by design (Operator in Airflow, Task in Luigi). It often relies on external compute systems such as Spark clusters or DWs for heavy Transformation. The BI side also saw the rise of an open source alternative called Superset sometimes complemented by Druid to create roll-ups, Online analytical processing (OLAP) cubes and provide a fast read-only storage and query engine.

I found myself working on a migration from a pre-Hadoop stack to a modern stack. It is not only a technology shift but also a major paradigm shift. In some cases, there are modeling and architectural decisions where we should distance ourselves from outdated wisdom and best practices, and it is important to understand why we are doing it. I found Maxime Beauchemin’s resources to be extremely helpful, and studying/understanding Apache Airflow’s design choices brings a lot of practical understanding in implementing the approach he advocates for (Airflow was created by Maxime). This guide aims to take an opinionated approach to defining and designing a Data Lake.

I pick specific technologies to make this guide more practical, and I hope most of it is applicable to other tools in a modern stack. The motivations to pick a technology over another are generally a result of my experience (or lack thereof). For example, I will mention AWS tools because that is the cloud provider I have experience with.

An extraction, in data engineering, should be an unaltered snapshot of the state of entities at a given point in time.

Concretely, it often involves calling APIs, scraping websites, getting files from Secure File Transfer Protocol (SFTP) servers, running periodically a query on a copy of an Operational Database and copying files from an S3 account. The result of the extraction is stored in a cheap, scalable, high availability Cloud storage such as S3 to be kept forever — or as long as compliance lets us. The data produced by these extractions is what constitutes the Data Lake.

Different writers, bloggers, and professionals have different definitions of a “Data Lake” and a “Data Warehouse”. Sometimes, their roles are not clearly stated or there is overlap — to the point where it creates confusion and those two words are used interchangeably. The following definition of a Data Lake is simple, it clearly separates it from the Data Warehouse, and it formalizes the useful separation of raw data (part of the Data Lake) from the derived datasets (part of the Data Warehouse / Data Marts).

A Data Lake is a repository that contains all of the unprocessed data produced or gathered by the business. Because no business logic is applied to the data at that point, it remains true, and any analytics (tables, data science models) can be recreated from that source if business requirements were to change. This extraction of data from different sources is necessary, because getting the data from the source is often expensive (API calls, slow SFTP, operational database dumps) and sometimes impossible (APIs evolve, SFTPs get emptied, operational databases mutate records in-place).

Semi-structured and unstructured data is often cited as a characteristic of a Data Lake. However, I believe that conversion to a file format that embeds a schema (such as Parquet, and Avro), during the extraction process, has significant advantages. A schema is a way to define an interface to the dataset, making it easier to use by multiple teams with minimal communication required. It is also a way to perform a lightweight validation that the source system is still producing the expected data. When the schema is no longer valid, the extract breaks, but it reduces the risk of erroneous analytics being produced or cryptic errors deep in the transformation processes. The data extracted might already have some sort of schema (database and API extracts), and storing as JSON / CSV would mean losing some valuable metadata.

In the cases where the source system makes previous data unavailable quickly, extract it once without any conversion, and run conversion on the raw copy. The Hive table can then be pointed at the converted copy. For example, in the case that we files are sourced from an SFTP server and those files disappear after ~1 hour. In this manner, the files are on S3 and the schema can be fixed without fearing the loss of any data.

The resulting files are often faster to process as Big Data frameworks leverage the file metadata and special data layouts to optimize compute. Another benefit of using such file formats is the reduced file size. Schemas, encoding techniques and special data layouts, like Columnar storage, allow these libraries to avoid redundancies — reducing the volume of bytes needed to represent the same information.

Many of the Hadoop-family frameworks are more efficient at processing a small number of big files rather than a big amount of small files. The reason is that there is overhead in reading the metadata on each file, and there is overhead in starting the processes that download the files in parallel. As a result, merging extracted data from multiple queries on a database, multiple API calls, or multiple SFTP files to reduce the number of files, can be a big time saver for downstream transformations. A compression library such as Snappy can also be used to reduce the amount of data going through the network, and it is generally worth doing as the CPU load introduced is negligible.

The Data Lake should contain the invariable truth — unmodified snapshots of states at given moments in time. Any transformation at that point is undesirable — with the exception of compliance processes (e.g. anonymization).

If the data is altered before being copied to the Data Lake, it will deviate from the state that it aimed to capture in the source system. If that source system makes previous data unavailable, and the logic applied needs to be undone, the data will have to be further mutated. This is dangerous as it might end up in a state where rolling back the changes to get the raw extract is not possible.

Sometimes a bug in the source system causes incorrect data to be produced. In those we might want it to be reflected in our capture (and analytics), or we might want it corrected. In the latter case, re-running the extraction process for the time-window concerned might be enough, or manual intervention might be required, but in both cases, the physical partitions are used to overwrite the concerned data only.

Partitioning the extracted data is important to achieve idempotency and optimize extract sizes. Maxime Beauchemin makes a strong case for idempotent ETL in his Functional Data Engineering blog post. The extract should always produce the same result given a “scheduled execution date”. This is sometimes impossible as we depend on external sources we do not have control over, but those extracts should be grouped into partitions nonetheless so downstream Transformations can be made idempotent.

In Airflow, the execution date is often used to implement idempotency. The execution date is a powerful concept, it is an immutable date given to a pipeline (Direct Acyclic Graph in Airflow) when it runs. If the DAG was scheduled to run on 2019–01–01 00:00:00 this is what the execution date will be. If that pipeline failed, or needed to re-run, the state of that specific run could be cleared, it would then get the same execution date and produce the same extract — with the condition that the extract is based on execution date and idempotent. This would make it possible to run multiple extract processes in parallel and is often used to backfill data.

As an example, I have backfilled data from APIs using the same (simple) technique and using Airflow’s features to limit parallelism and, retry or timeout automatically the calls. It is a common use-case of Airflow and it is made possible by idempotent (and non-overlapping) extracts.

Similarly, we can run multiple instances of our end-to-end ETL. This is especially useful when trying to re-process data for an unusual time-frame. For example, if the transformation code and defined resources were tested for a daily volume of data, it is hard to know how the same set up would behave for an entire month worth of volume. Instead, one instance of the ETL can be started per day of a month being reprocessed — potentially executed in parallel (this is made easy in Airflow).

The physical partitioning of the extracts should be based on the date when the extract process is scheduled to run. The simplest example is of a daily extract that is processed in a daily batch:

```
s3://myorg-data-lake/sftp_clients/parquet/ds=2020-01-01
s3://myorg-data-lake/sftp_clients/parquet/ds=2020-01-02
s3://myorg-data-lake/sftp_clients/parquet/ds=2020-01-03
```

*ds stands for date stamp, here: the execution date*

Note the key=value format which denotes a physical partition in the Hadoop ecosystem — physical partitions are turned into a column of the dataset and allow all files outside of selected partitions to be skipped (partition pruning) when used in a WHERE clause.

The extraction process should be written in a way that overwrites a partition based on the execution date it is given. The transformation processes can then, use the dsas a filter to get to the data they need to process.

Other time-frames follow the same principles, but under hourly we might want to consider Streaming — batch systems tend to have overheads that make them unusable for very short batches.

Another interesting and common use-case is one where we extract the data at a higher frequency than we transform it. This need arises when extracting a large time-frame from the source overloads it, the data is in risk of being unavailable later or extracting all the data at once right before transformation would delay downstream processes. As an example, we might want to create hourly extracts, but process the data every 12 hours. To design such a pipeline where tasks need to be scheduled at different cadences — we can use logical branching to selectively run the transformation processes when we want to.

This higher frequency of extraction can produce undesirably small files, in this case, before transformation, we merge the batch to be processed. When the files are so small that writing metadata (schema, statistics) into each one represents a substantial overhead the conversion to a schema embedded file should happen after the files are merged. In that case, consider the following structure:

```
s3://myorg-data-lake/sftp_clients/raw/ds=2020-01-01<space>00:00:00
s3://myorg-data-lake/sftp_clients/raw/ds=2020-01-01<space>01:00:00
s3://myorg-data-lake/sftp_clients/raw/ds=2020-01-01<space>02:00:00
...
s3://myorg-data-lake/sftp_clients/raw/ds=2020-01-01<space>12:00:00
--
s3://myorg-data-lake/sftp_clients/parquet/ds=2020-01-01<space>12:00:00
```

Where the merge + conversion + compression process would turn 12 partitions into 1, and the sftp_clients table would point to the parquet version and not the raw copy.
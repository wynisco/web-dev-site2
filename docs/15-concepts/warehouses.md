# Data Warehouses

Enterprises are becoming increasingly data driven, and a key component of any enterprise’s data strategy is a data warehouse—a central repository of integrated data from all across the company. Traditionally, the data warehouse was used by data analysts to create analytical reports. But now it is also increasingly used to populate real-time dashboards, to make ad hoc queries, and to provide decision-making guidance through predictive analytics. Because of these business requirements for advanced analytics and a trend toward cost control, agility, and self-service data access, many organizations are moving to cloud-based data warehouses such as Snowfkake, Amazon Redshift and Google BigQuery.

A data warehouse is a piece of technology that acts on 3 ideas: the data modeling, the data storage and processing engine.

In this cloud world where everything is serverless a good data modeling is still a key factor in the performance—which often mean cost—of a data platform. Modeling is often lead by the dimensional modeling but you can also do 3NF or data vault. When it comes to storage it's mainly a row-based vs. a column-based discussion, which in the end will impact how the engine will process data. Processing engines are mainly SMP (Symmetrical Multiprocessing) and MPP (Massively Parallel Processing).

## Speed vs Granularity tradeoff in data systems

You can do additional processing on top of dimensional data modeling to increase speed of access. Optimizing for speed does require sacrificing granularity, but as technology continues to improve, these tradeoffs become less consequential. Denormalized tables and OLAP cubes are the two ways to increase speed of access. Building denormalized tables, or summary tables, on top of your dimensional data models enables faster performance, but it does require some sacrifice of granularity. For example, you can save the “last 7 day purchases” on a per-user basis in a single data table for fast access, but you’ll lose the ability to get “last 8 day purchases”. For many usage patterns, the speed is worth the tradeoff because users would rather see pre-baked data in 3 seconds than wait 30 seconds for customization.

OLAP cubes are a more intensive option to increase speed of access. An OLAP cube pre-aggregates the data so much that lookup queries are near-instant. However, they require much more prep, and they sacrifice more granularity. Denormalized tables are a better way to satisfy performance for most use cases.

It's also worth noting that newer technologies such as Druid and Pinot can have extremely fast querying using a single table. This makes denormalized tables an appealing option if you choose to use these technologies since you don't have to pre-aggregate.

In addition to this, there are also in-memory implementations of data models that allow for fast data access. Tableau has Tableau Data Extract – first with the tde format and more recently hyper formats to enable fast access of large datasets. Arrow is another in-memory approach that allows for data systems to be built with interactive performance.

![](/img/concepts/data-warehousing/speed-granularity-tradeoff.png)

This graph provides a rough representation of the speed vs. granularity tradeoff that’s central to dimensional data modeling. As speed increases, granularity decreases, and vise-versa. But what’s exciting to note is that as technology improves, the graph shifts further to the right. That is, we’re able to maintain more granularity at higher speeds. As each step gets faster, all of a sudden you can use the more granular technique for certain workloads and still meet user time expectations. This means a simpler data pipeline and less loss of granularity to achieve the same goals.

To drive the point home, consider the OLAP cube. OLAP cubes have largely fallen out of favor because recent advancements make denormalized tables a pretty good balance of performance and flexibility for most teams today.


## Data Warehouse Options

### Traditional Solutions for Data Warehouse

- SQL Server
- PostgreSQL
- MySQL

### Cloud Data Warehouses

- BigQuery (Google Cloud)
- Redshift (AWS Cloud)
- Snowflake

### Other Options

- AWS Athena
- Hadoop Hive

## Building a Data Warehouse/Lake solution on Cloud

### 1. Data Warehouse Management (Strong SQL and Data Modeling Skills)

- Data Modeling
- Optimizing Queries
- Billing/Cost Management
- User/Access Management
- Enabling BI/Analytics for Query Management
- Data Governance and Security

### 2. ETL/Data Movement (Strong Scripting/Coding skills along with understanding of cloud components)

- Writing Pipelines using Scala/Java/Python
- Data Orchestration Tools (Airflow/Step Functions)
- Deployment and Integration of Analytics/ML Models
- Know-how of best solutions for deploying scalable pipelines
- Logging, alerting and notifications

## Questions

1. What is a Data Warehouse?
2. Why is Data Warehouse needed?
3. Which Data Warehouse should I pick?
4. What makes a Data Warehouse different from normal SQL databases?
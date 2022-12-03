# Batch vs Stream

![](/img/concepts/batch-stream/comparison.drawio.svg)

|   | Batch | Stream |
| - | ----- | ------ |
| Volume | Batch processing of high volumes of data at rest | Real-time processing of continuous streams of data in motion |
| Compute | Economical and simplest processing method | Complex and costly processing method |
| Latency | High | Low |
| Storage | Collected over time | Streaming continuously |
| Mechanism | ETL/ELT | Event oriented |

## Infrastructure for Real-time Data flows

![](/img/concepts/data-streaming/infra.drawio.svg)

- ClickStream Ingestion: Ingesting clickstream data often require a specific infrastructure component to be present to facilitate that. Snowplow and Dilvote are two open-source clickstream collectors. Simultaneously, Google Analytics 360 allows raw data export of clickstream data to BigQuery, and some CDPs like Segment or Tealium allow to capture and export clickstream data to streams or databases.

- Ingestion framework: Frameworks such as Apache Flumes, Apache Nifi, offering features such as data buffering and backpressure, help integrate data onto message queues/stream.

- Message Bus / Streams: A message bus, streams is the component that will serve to transfer the data across the different components of the real-time data ecosystem. Some of the typical technologies used are Kafka, Pulsar, Kinesis, Google Pub/Sub, Azure Service Bus, Azure Event Hub, and Rabbit MQ, to name just a few.

- Processing: Different processing framework exists to simplify computation on data streams. Technologies such as Apache Beam, Flink, Apache Storm, Spark Streaming can significantly help with the more complicated processing of data streams.

- Stream querying: It is possible to query streams directly using SQL, like the type of languages. Azure Event Hub supports Azure Stream Analytics, Kafka KSQL, and Spark offers Spark Structured Streaming to query multiple types of message streams.

- Decision Engine: real-time actions need real-time data and a way to process this information systematically. Decision engines help make the incoming flow of data actionable. There are two main types of decision engines stateless (e.g., CLIPS, Easy Rules, Gandalf) and stateful decision engines (e.g., Drools).

- ML Framework + Processing: Machine learning models can be leveraged within a real-time architecture. They can help make better decisions by calculating scores, such as the propensity to fraud. Different types of framework exists with varying degrees of sophistication, such as XGBoost, Tensorflow or Spark MLib.

- Data Store: Depending on the specific integration needs, leveraging real-time data might require some fit for purpose data stores. Specific OLAP type of database such as Druid, might be required to do slice and dice analytic on the incoming data, HTAP datastore such as Kudu, Cassandra or Ignite might be required for handling specific enrichments, Elastic Search for needle in the haystack type of queries, S3 for long term archival purposes, RDMBS or even leveraging the stream directly (using Kafka directly for instance).

- Query Federation: With such a diverse ecosystem of datastores, having the ability to query them using the same interface and tool becomes a growing need. Tools such as Spark and Presto provide this type of query federation.

- Dashboarding: Different types of dashboards are available to handle real-time use cases. While it is still possible to leverage traditional dashboarding solutions such as Tableau, solutions such as Grafana or Kibana are usually more appropriate.

Follow [this](https://medium.com/analytics-and-data/real-time-data-pipelines-complexities-considerations-eecad520b70b) for more information.
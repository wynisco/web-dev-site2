# Other Projects

## Data Transformation with Snowpark Python and dbt

dbt is one of the most popular data transformation tools today. And until now dbt has been entirely a SQL-based transformation tool. But with the announcement of dbt Python models, things have changed. It's now possible to create both SQL and Python based models in dbt! Here's how dbt explains it:

dbt Python ("dbt-py") models will help you solve use cases that can't be solved with SQL. You can perform analyses using tools available in the open source Python ecosystem, including state-of-the-art packages for data science and statistics. Before, you would have needed separate infrastructure and orchestration to run Python transformations in production. By defining your Python transformations in dbt, they're just models in your project, with all the same capabilities around testing, documentation, and lineage. ([dbt Python models](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/python-models)). Python based dbt models are made possible by Snowflake's new native Python support and Snowpark API for Python. With Snowflake's native Python support and DataFrame API, you no longer need to maintain and pay for separate infrastructure/services to run Python code, it can be run directly within Snowflake's Enterprise grade data platform!

Follow [this](https://github.com/datalaker/data-engineering-private/tree/main/dbt-snowflake-py) link to learn more.

## End-to-end AWS Lab

https://catalog.us-east-1.prod.workshops.aws/workshops/44c91c21-a6a4-4b56-bd95-56bd443aa449/en-US/lab-guide

## Using Airflow and Spark To Crunch US Immigration Data

Combining US Immigration Data, World Temperature Data and US City Demographic Data, and some simple joins and aggregations, to identify the average age and sex of arrivals to US Cities. This data was then combined with temperature data for each city so one can correlate arrivals with weather trends. The demographics data could also illustrate whether there are relationships between the average age of the attendee and city. Alternatively, the data could be repurposed to see what relationships exist between the race of the arrivee and city/state demographics.

## Postgres Advanced with Pagila Dataset

Pagila started as a port of the Sakila example database available for MySQL, which was originally developed by Mike Hillyer of the MySQL AB documentation team. It is intended to provide a standard schema that can be used for examples in books, tutorials, articles, samples, etc.

Follow [this](https://github.com/datalaker/data-engineering-private/tree/main/postgres-pagila) link for more information.
# dbt

> dbt (data build tool) is an open source Python package that enables data analysts and engineers to transform their data using the same practices that software engineers use to build applications. dbt allows you to build your data transformation pipeline using SQL queries.

dbt fits nicely into the modern BI stack, coupling with products like Stitch, Fivetran, Redshift, Snowflake, BigQuery, Looker, and Mode. Here’s how the pieces fit together:

![](https://www.getdbt.com/ui/img/blog/what-exactly-is-dbt/1-BogoeTTK1OXFU1hPfUyCFw.png)

dbt is the T in ELT. It doesn’t extract or load data, but it’s extremely good at transforming data that’s already loaded into your warehouse. This “transform after load” architecture is becoming known as ELT (extract, load, transform).

ELT has become commonplace because of the power of modern analytic databases. Data warehouses like Redshift, Snowflake, and BigQuery are extremely performant and very scalable such that at this point most data transformation use cases can be much more effectively handled in-database rather than in some external processing layer. Add to this the separation of compute and storage and there are decreasingly few reasons to want to execute your data transformation jobs elsewhere.

dbt is a tool to help you write and execute the data transformation jobs that run inside your warehouse. dbt’s only function is to take code, compile it to SQL, and then run against your database.

<iframe width="100%" height="480" src="https://www.youtube.com/embed/8FZZivIfJVo" title="What Is DBT and Why Is It So Popular -  Intro To Data Infrastructure Part 3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="100%" height="480" src="https://www.youtube.com/embed/efsqqD_Gak0" title="What is dbt Data Build Tool? | What problem does it solve? | Real-world use cases" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<details>
<summary>Want to deep-dive?</summary>
This is the playlist if you get into deep-dive :

https://www.youtube.com/playlist?list=PLy4OcwImJzBLJzLYxpxaPUmCWp8j1esvT
</details>

## Data modeling techniques for more modularity

https://www.getdbt.com/analytics-engineering/modular-data-modeling-technique/

## Commands

```make title="Makefile"
init:
	dbt init ${PROJECT_NAME}
debug:
	dbt debug
run:
	dbt run
	dbt run --profiles-dir path/to/directory
	export DBT_PROFILES_DIR=path/to/directory
test:
	dbt test -m model1 [model2]
seed:
	dbt seed
```

```txt title="requirements.txt"
dbt-core
dbt-databricks
dbt-postgres
dbt-snowflake
```

```yaml title="profiles.yml"
postgres:
  outputs:
    dev:
      type: postgres
      threads: 1
      host: <host>
      port: 5432
      user: postgres
      pass: <pass>
      dbname: postgres
      schema: public
    prod:
      type: postgres
      threads: 1
      host: <host>
      port: 5432
      user: postgres
      pass: <pass>
      dbname: postgres
      schema: public
  target: dev
  
databricks:
  outputs:
    dev:
      host: {HOST}
      http_path: {HTTP_PATH}
      schema: default
      threads: 1
      token: {TOKEN}
      type: databricks
  target: dev
```

![](/img/tools/dbt/skills_required.png)

## More Resources

1. [Getting Started with dbt](dbt/intro.md)
2. [Transforming data with dbt](dbt/Transforming_Data_with_dbt.ipynb)
3. [Transform your data with dbt and Serverless architecture](https://platform.deloitte.com.au/articles/transform-your-data-with-dbt-and-serverless-architecture)
4. [How JetBlue is eliminating the data engineering bottlenecks with dbt](https://www.getdbt.com/success-stories/jetblue/)
5. [dbt development at Vimeo](https://medium.com/vimeo-engineering-blog/dbt-development-at-vimeo-fe1ad9eb212)
6. [Best practices for data modeling with SQL and dbt](https://airbyte.com/blog/sql-data-modeling-with-dbt)
7. https://www.getdbt.com/analytics-engineering/start-here
8. https://www.getdbt.com/blog/what-exactly-is-dbt/
9. [Four Reasons that make DBT a great time saver for Data Engineers](https://medium.com/@montadhar/four-reasons-that-make-dbt-a-great-time-saver-for-data-engineers-4c4ceb721522)
10. https://courses.getdbt.com/courses/fundamentals
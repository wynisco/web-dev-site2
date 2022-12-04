# Funflix Data Modeling with Postgres

## Instructions

Funflix's Medical division needs your help in getting some insights from their datasets. You have to perform the following steps:

1. Create a schema `funflix`.
2. Upload the 4 data files in this schema. Table names will be same as file names.
3. Create a star schema (Entity-Relation Diagram). Use [https://dbdiagram.io/](https://dbdiagram.io/) to create it. Once created, export the diagram as png and save it as `erd.png`.
4. Write SQL queries to answer the following questions. For each of these queries, create a view in the same schema.
   
    | Query | View name |
    | --- | --- |
    | How many customers visited the clinic in february 2022? | customer_feb22 |
    | What was the most booked service in march 2022? | service_mar22 |
    | Who were the top-5 customers who visited the most in Q1 2022 (i.e. Jan-Mar 2022)? | customer_top5_q122 |
    | What are the top-3 most booked services by the most visited customer? | service_top3 |
    | Which therapist is most experienced in physiotherapy? | therapist_experience |

5. Push the code changes to your branch.
6. Create PR and add the instructor and a peer for review.

## Scoring Factors

|                               | Weightage |
| - | - |
| Requirement Analysis          | 5  |
| Data Analysis                 | 5  |
| Data Model Design             | 30 |
| DDL (SQL)                     | 10 |
| DML (Python)                  | 30 |
| View Creation (SQL)           | 15 |
| PR Submission                 | 5  |
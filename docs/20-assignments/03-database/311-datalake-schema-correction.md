# Datalake Schema Correction

## Instructions

HMC Analytics is a UK-based startup building a marketing product. They are pulling data from their online platform into S3 datalake. Their analyst team generates daily insights report by executing queries (using AWS Athena).

Yesterday, their Analyst team reported that they are facing some problem while running the queries. They need your help in resolving this problem on an urgent basis because the executive team is waiting for those daily reports and key strategic decisions are dependent on these reports.

Your first goal is to replicate this situation by generating the error in Athena and then successfully resolve it by running queries in Athena.

Follow these steps to complete the assignment:

1. The data table is `other_events`. This data is already loaded for you in `s3://wysde2-readonly/hmc`. Explore the data.
2. Create a Glue crawler to add this data into the glue catalog.
3. Once crawler adds the table in catalog, try to get the first few records and record counts in Athena. Note: At this point, you are supposed to replicate the error. Athena will tell you what the error is.
4. Understand the problem and find the root cause.
5. Resolve the issue. Hint1: Research online about the possible solutions and try them out. Do not spend a lot of time but try 1-2 solutions max.
6. Create a brief report of 50-200 words and send to the instructor.

Note: You have to present your complete analysis for markings.

## Scoring Factors

|   | Weightage |
| - | - |
| Error replication | 20  |
| Problem identification | 10  |
| Root cause analysis | 10 |
| Research & development | 10 |
| Solution development | 50 |
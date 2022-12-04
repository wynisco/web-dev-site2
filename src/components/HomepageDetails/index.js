import React from 'react';
import styles from './styles.module.css';
import TechStackSvg from '@site/static/img/techstack.svg'
import { EditFilled, NotificationFilled, PlayCircleFilled, UpSquareFilled, CalendarOutlined } from '@ant-design/icons';
import { Timeline, Button, Popover } from 'antd';

function TechStack() {
  return (
    <div className={styles.Container}>
      <h1>Our Tech Stack</h1>
      <br/>
      <TechStackSvg/>
    </div>
  );
}

const week1 = (
  <div>
    <ol>
      <li>Candidate Onboarding</li>
      <li>Workspace Setup</li>
      <li>Fundamentals of Data Engineering</li>
    </ol>
  </div>
);

const week2 = (
  <div>
    <ol>
      <li>SQL Data Modeling with Postgres</li>
      <li>Data Warehousing with Snowflake</li>
    </ol>
  </div>
);

const week3 = (
  <div>
    <ol>
      <li>Data Lakes with S3</li>
    </ol>
  </div>
);

const week4 = (
  <div>
    <ol>
      <li>Data Transformation with Python</li>
      <li>Data Transformation with SQL</li>
      <li>Data Transformation with AWS Lambda</li>
    </ol>
  </div>
);

const week5 = (
  <div>
    <ol>
      <li>Data Pipeline and Orchestration with Apache Airflow</li>
      <li>IaC with AWS CloudFormation</li>
    </ol>
  </div>
);

const week6 = (
  <div>
    <ol>
      <li>NoSQL Data Modeling with Cassandra</li>
      <li>Data Warehousing with Amazon Redshift</li>
    </ol>
  </div>
);

const week7 = (
  <div>
    <ol>
      <li>Data Lakehouses with Delta Lake</li>
      <li>Data Transformation with Databricks PySpark</li>
    </ol>
  </div>
);

const week8 = (
  <div>
    <ol>
      <li>Data Transformation with AWS Glue Studio</li>
      <li>Data Transformation with dbt</li>
      <li>Data Quality and Validation with Great Expectations</li>
    </ol>
  </div>
);

const week9 = (
  <div>
    <ol>
      <li>Real-time Event Streaming with Apache Kafka</li>
      <li>Real-time Event Streaming with Amazon Kinesis</li>
    </ol>
  </div>
);

const week10 = (
  <div>
    <ol>
      <li>Container Orchestration with Amazon ECS</li>
      <li>REST API with FastAPI</li>
    </ol>
  </div>
);

const week11 = (
  <div>
    <ol>
      <li>CICD Pipeline with GitHub Actions</li>
    </ol>
  </div>
);

const week12 = (
  <div>
    <ol>
      <li>NoSQL Data Modeling with DynamoDB</li>
      <li>Advanced Data Engineering with Databricks</li>
    </ol>
  </div>
);

const week13 = (
  <div>
    <ol>
      <li>Data Pipeline and Orchestration with AWS Step Functions</li>
      <li>Data Pipeline and Orchestration with Prefect</li>
      <li>Data Pipeline and Orchestration with Databricks Jobs</li>
      <li>Change Data Capture with Debezium</li>
    </ol>
  </div>
);

const week14 = (
  <div>
    <ol>
      <li>Container Orchestration with Kubernetes</li>
      <li>CICD Pipeline with AWS CodePipelines</li>
      <li>IaC with Terraform</li>
    </ol>
  </div>
);

const week15 = (
  <div>
    <ol>
      <li>MLOps pipelines with Amazon Sagemaker</li>
      <li>Machine Learning Regression and Classification modelling Fundamentals</li>
    </ol>
  </div>
);

const week16 = (
  <div>
    <ol>
      <li>NLP and Computer Vision Fundamentals</li>
    </ol>
  </div>
);

function BootcampTimeline() {
  return (
    <div className={styles.Container}>
      <h1>Bootcamp Timeline</h1>
      <br/>
      <Timeline mode="alternate">
      <Timeline.Item
            dot={
              <PlayCircleFilled
                style={{
                  fontSize: '16px',
                }}
              />
            }
          >
            Standard Track Classes Starts
      </Timeline.Item>
      <Timeline.Item>
        <Popover content={week1} title="Week 1">
          <Button type="primary" shape="round" icon={<CalendarOutlined />}>Week 1</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item>
        <Popover content={week2} title="Week 2">
          <Button type="primary" shape="round" icon={<CalendarOutlined />}>Week 2</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item>
        <Popover content={week3} title="Week 3">
          <Button type="primary" shape="round" icon={<CalendarOutlined />}>Week 3</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item>
        <Popover content={week4} title="Week 4">
          <Button type="primary" shape="round" icon={<CalendarOutlined />}>Week 4</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item>
        <Popover content={week5} title="Week 5">
          <Button type="primary" shape="round" icon={<CalendarOutlined />}>Week 5</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item
            dot={
              <NotificationFilled
                style={{
                  fontSize: '16px',
                }}
              />
            }
          >
            Standard Track Marketing Starts
      </Timeline.Item>
      <Timeline.Item
            dot={
              <EditFilled
                style={{
                  fontSize: '16px',
                  color: 'green',
                }}
              />
            }
          >
            Advanced Track Opt In (80% Passing marks)
      </Timeline.Item>
      <Timeline.Item
            dot={
              <PlayCircleFilled
                style={{
                  fontSize: '16px',
                  color: 'green',
                }}
              />
            }
          >
            Advanced Track Classes Starts
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week6} title="Week 6">
          <Button type="primary" style={{ background: "green", borderColor: "green" }} shape="round" icon={<CalendarOutlined />} color="green">Week 6</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week7} title="Week 7">
          <Button type="primary" style={{ background: "green", borderColor: "green" }} shape="round" icon={<CalendarOutlined />}>Week 7</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week8} title="Week 8">
          <Button type="primary" style={{ background: "green", borderColor: "green" }} shape="round" icon={<CalendarOutlined />}>Week 8</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week9} title="Week 9">
          <Button type="primary" style={{ background: "green", borderColor: "green" }} shape="round" icon={<CalendarOutlined />}>Week 9</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week10} title="Week 10">
          <Button type="primary" style={{ background: "green", borderColor: "green" }} shape="round" icon={<CalendarOutlined />}>Week 10</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week11} title="Week 11">
          <Button type="primary" style={{ background: "green", borderColor: "green" }} shape="round" icon={<CalendarOutlined />}>Week 11</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item
            dot={
              <NotificationFilled
                style={{
                  fontSize: '16px',
                  color: 'green',
                }}
              />
            }
          >
            Advanced Track Marketing Starts
      </Timeline.Item>
      <Timeline.Item
            dot={
              <EditFilled
                style={{
                  fontSize: '16px',
                  color: 'red',
                }}
              />
            }
          >
            Expert Track Opt In (80% Passing marks)
      </Timeline.Item>
      <Timeline.Item
            dot={
              <PlayCircleFilled
                style={{
                  fontSize: '16px',
                  color: 'red',
                }}
              />
            }
          >
            Expert Track Classes Starts
      </Timeline.Item>
      <Timeline.Item color="red">
        <Popover content={week12} title="Week 12">
          <Button type="primary" style={{ background: "red", borderColor: "red" }} shape="round" icon={<CalendarOutlined />}>Week 12</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="red">
        <Popover content={week13} title="Week 13">
          <Button type="primary" style={{ background: "red", borderColor: "red" }} shape="round" icon={<CalendarOutlined />}>Week 13</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="red">
        <Popover content={week14} title="Week 14">
          <Button type="primary" style={{ background: "red", borderColor: "red" }} shape="round" icon={<CalendarOutlined />}>Week 14</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="red">
        <Popover content={week15} title="Week 15">
          <Button type="primary" style={{ background: "red", borderColor: "red" }} shape="round" icon={<CalendarOutlined />}>Week 15</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="red">
        <Popover content={week16} title="Week 16">
          <Button type="primary" style={{ background: "red", borderColor: "red" }} shape="round" icon={<CalendarOutlined />}>Week 16</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item
            dot={
              <NotificationFilled
                style={{
                  fontSize: '16px',
                  color: 'red',
                }}
              />
            }
          >
            Expert Track Marketing Starts
      </Timeline.Item>
      <Timeline.Item
            dot={
              <UpSquareFilled
                style={{
                  fontSize: '16px',
                  color: 'black',
                }}
              />
            }
          >
            Bootcamp Ends
      </Timeline.Item>
      </Timeline>
    </div>
  );
}

export {TechStack, BootcampTimeline};
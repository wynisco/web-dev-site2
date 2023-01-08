import React from 'react';
import styles from './styles.module.css';
import TechStackSvg from '@site/static/img/techstack.svg'
import { NotificationFilled, PlayCircleFilled, CalendarOutlined } from '@ant-design/icons';
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
      <li>Introduction and Curriculum Review</li>
      <li>HTML</li>
      <li>Media Queries</li>
      <li>Flexbox</li>
      <li>CSS Grid</li>
      <li>SCSS</li>
      <li>BootStrap </li>
      <li>UX Process (Prototyping, Figma, UX Research) </li>
    </ol>
  </div>
);

const week2 = (
  <div>
    <ol>
      <li>Project 1 Based on HTML/CSS Only</li>
      <li>Core Javascript</li>
      <li>Javascript ES6</li>
      <li>Manipulating CSS/ HTML with Javascript</li>
      <li>DOM Manipulation</li>
      <li>Events /Bubbing</li>
      <li>Javascript Problem Solving</li>
      <li>Javascript Regex</li>
    </ol>
  </div>
);

const week3 = (
  <div>
    <ol>
      <li>Javascript Problem Solving</li>
      <li>Chrome Web Dev Tool In Depth</li>
      <li>NPM</li>
      <li>Application Architecture</li>
      <li>Git</li>
    </ol>
  </div>
);

const week4 = (
  <div>
    <ol>
      <li>Project based on HTML /CSS / Javascript</li>
      <li>React Introduction,Architecture and Concepts</li>
      <li>React State and Props</li>
      <li>Mini Project</li>
      <li>React Hooks</li>
      <li>Full Project</li>
    </ol>
  </div>
);

const week5 = (
  <div>
    <ol>
      <li>React Project Continued</li>
      <li>APIs</li>
      <li>Introduction to Node js</li>
      <li>Express</li>
      <li>Build Backend and Services</li>
      <li>Connect backend with front end </li>
      <li>Build full stack app with React, Node and MongoDB</li>
    </ol>
  </div>
);

const week6 = (
  <div>
    <ol>
      <li>Unit Testing</li>
      <li>Agile/ Scrum / Jira</li>
      <li>Working with Dates</li>
      <li>Interview Practice</li>
    </ol>
  </div>
);

const week7 = (
  <div>
    <ol>
      <li>Interview Practice and Mock Interviews</li>
      <li>Resume Prep </li>
      <li>Marketing Starts </li>
    </ol>
  </div>
);

const week8 = (
  <div>
    <ol>
      <li> Mock Interviews</li>
      <li> Project Training</li>
      <li> Problem Solving</li>

    
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
            START
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
      
      <Timeline.Item color="green">
        <Popover content={week6} title="Week 6">
          <Button type="primary" shape="round" icon={<CalendarOutlined />} color="green">Week 6</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week7} title="Week 7">
          <Button type="primary"  shape="round" icon={<CalendarOutlined />}>Week 7</Button>
        </Popover>
      </Timeline.Item>
      <Timeline.Item
            dot={
              <PlayCircleFilled
                style={{
                  fontSize: '16px',
                }}
              />
            }
          >
            END
      </Timeline.Item>
      <Timeline.Item color="green">
        <Popover content={week8} title="Week 8">
          <Button type="primary"  shape="round" icon={<CalendarOutlined />}>Week 8</Button>
        </Popover>
      </Timeline.Item>
      
      
      </Timeline>
    </div>
  );
}


export {TechStack, BootcampTimeline};
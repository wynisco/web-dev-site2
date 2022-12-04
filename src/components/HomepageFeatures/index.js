import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Intensive Training',
    Svg: require('@site/static/img/intensive-training.svg').default,
    description: (
      <>
        We build strong momentum with 6 to 8 hours per day of intense training and preparation
      </>
    ),
  },
  {
    title: 'Industrial Project-based Labs',
    Svg: require('@site/static/img/undraw-docusaurus-react.svg').default,
    description: (
      <>
        Our technical labs boost hands-on data engineering skills and based on real-life projects
      </>
    ),
  },
  {
    title: 'Assessment and Capstones',
    Svg: require('@site/static/img/undraw-docusaurus-tree.svg').default,
    description: (
      <>
        We continuously assess your skills by quizzes, assignments and capstone projects
      </>
    ),
  },
  {
    title: 'Technical Knowledge',
    Svg: require('@site/static/img/undraw-docusaurus-mountain.svg').default,
    description: (
      <>
        Our resources are exclusive and focused on things that matter from interview and job perspective
      </>
    ),
  },
  {
    title: 'Resume/Interview Prep',
    Svg: require('@site/static/img/interview-prep.svg').default,
    description: (
      <>
        Solid resume and LinkedIn profile, interview prep to top it off
      </>
    ),
  },
  {
    title: 'Network',
    Svg: require('@site/static/img/networking.svg').default,
    description: (
      <>
        This is where we shine. Our distribution network of contacts, referrals and relationships are unmatched
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

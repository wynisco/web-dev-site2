import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { TechStack, BootcampTimeline } from '@site/src/components/HomepageDetails';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://api.whatsapp.com/send?phone=19843581968&text=Hi%20Wynisco%20Team%0AI%20am%20interested%20in%20the%20program%20and%20need%20more%20information%0AThanks">
            Send us Whatsapp message: +1 (984) 358-1968
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`WYNISCO - ${siteConfig.title}`}
      description="Faster than the speed of light Well, that's how quickly we can get you hired!">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TechStack />
        <BootcampTimeline />
      </main>
    </Layout>
  );
}

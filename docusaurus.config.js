// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
require('dotenv').config()

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Data Engineering Bootcamp',
  tagline: 'Faster than the speed of light. Well, that\'s how quickly we can get you hired!',
  url: 'https://www.wynisco.com/',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'ignore',
  trailingSlash: false,
  favicon: 'img/wys_logo.jpeg',
  organizationName: 'wynisco',
  projectName: 'datacamp',
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
      },
    ],
    '@saucelabs/theme-github-codeblock',
    '@docusaurus/theme-mermaid',
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },
  // plugins: [
  //   // [
  //   //   'docusaurus-plugin-content-gists',
  //   //   {
  //   //     enabled: true,
  //   //     verbose: true,
  //   //     personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  //   //   },
  //   // ],
  // ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateAuthor: true,
          showLastUpdateTime: true
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-TKBX6FN5LR',
          anonymizeIP: false,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'support_us',
        content:
          '⭐️ New Bootcamp starting soon...<a target="_blank" rel="noopener noreferrer" href="https://www.wynisco.com/apply.html">Register Now</a>!',
        backgroundColor: '#fafbfc',
        textColor: '#091E42',
        isCloseable: true,
      },
      navbar: {
        title: 'Wynisco',
        logo: {
          alt: 'Wynisco Logo',
          src: 'img/wys_logo.jpeg',
        },
        items: [
          {
            label: "Bootcamp",
            position: "left",
            items: [
              {
                label: "Basics",
                to: "docs/basics",
              },
              {
                label: "Concepts",
                to: "docs/concepts",
              },
              {
                label: "Labs",
                to: "docs/labs",
              },
              {
                label: "Assignments",
                to: "docs/assignments",
              },
              {
                label: "Case Studies",
                to: "docs/case-studies",
              },
              {
                label: "Interview Prep",
                to: "docs/interview-prep",
              },
              {
                label: "Extras",
                to: "docs/extras",
              },
            ],
          },
          {
            to: 'blog',
            position: 'left',
            label: 'Blog',
          },
          {
            href: 'https://github.com/wynisco/datacamp',
            label: 'GitHub',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
        ],
        copyright: `Copyright © ${new Date().getFullYear()} WYNISCO Pvt. Ltd.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      metadata: [{name: 'keywords', content: 'data engineering, data engineering job'}],
    }),
};

module.exports = config;

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
      navbar: {
        title: 'Wynisco',
        logo: {
          alt: 'Wynisco Logo',
          src: 'img/wys_logo.jpeg',
        },
        items: [
          {
            to: 'docs/getting-started',
            position: 'left',
            label: 'Docs',
          },
          {
            to: 'blog',
            position: 'left',
            label: 'Blog',
          },
          {
            to: '/gists',
            position: 'left',
            label: 'Gists',
          }
          // {
          //   href: 'https://github.com/datalaker/wysde2',
          //   label: 'GitHub',
          //   position: 'right',
          // },
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

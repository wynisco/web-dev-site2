// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
require('dotenv').config()

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Front End / UI / Web Development Bootcamp',
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
          {
            title: 'Community',
            items: [
              {
                label: 'Website',
                href: 'https://www.wynisco.com/',
              },
              {
                label: 'Twitter',
                to: 'https://twitter.com/wynisco',
              },
              {
                label: 'Linkedin',
                to: 'https://www.linkedin.com/company/wynisco/',
              },
              {
                label: 'Whatsapp',
                to: 'https://api.whatsapp.com/send?phone=19843581968&text=Hi%20Wynisco%20Team%0AI%20am%20interested%20in%20the%20program%20and%20need%20more%20information%0AThanks',
              },
              {
                label: 'Youtube',
                to: 'https://www.youtube.com/channel/UCCVlUaDs6PtNiIMkft-pg-w',
              },
              {
                label: 'Blog',
                to: 'https://www.wynisco.com/blog',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Events',
                to: 'https://www.wynisco.com/events.html',
              },
              {
                label: 'Success Stories',
                to: 'https://www.wynisco.com/success-stories.html',
              },
              {
                label: 'Apply Now',
                to: 'https://www.wynisco.com/apply.html',
              },
              {
                label: 'Contact Us',
                to: 'https://www.wynisco.com/contact-us.html',
              },
              {
                label: 'About Us',
                to: 'https://www.wynisco.com/about-us.html',
              },
              {
                label: 'Privacy Policy',
                to: 'https://www.wynisco.com/privacy-policy.html',
              },
            ],
          },
        ],
        logo: {
          alt: 'Wynisco Logo',
          src: '/img/wys_logo.jpeg',
          href: 'https://www.wynisco.com/',
        },
        copyright: `Copyright © ${new Date().getFullYear()} WYNISCO Pvt. Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      metadata: [{name: 'keywords', content: 'data engineering, data engineering job'}],
    }),
};

module.exports = config;

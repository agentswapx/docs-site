import { defineConfig, type DefaultTheme } from 'vitepress'

const GITHUB_ORG = 'https://github.com/agentswapx'
const REPO_EDIT_BASE = 'https://github.com/agentswapx/docs-site/edit/main'
const SITE_HOSTNAME = 'https://docs.atxswap.com'
const SITE_OG_IMAGE = `${SITE_HOSTNAME}/og.png`
const SITE_DESCRIPTION =
  'ATXSwap official documentation — product guides and developer docs for the decentralized agent exchange protocol on BSC.'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ATXSwap',
    alternateName: 'Decentralized agent exchange protocol on BSC',
    url: 'https://www.atxswap.com',
    logo: `${SITE_HOSTNAME}/favicon.ico`,
    sameAs: [
      GITHUB_ORG,
      'https://www.npmjs.com/package/atxswap-sdk',
      'https://clawhub.ai/skills/atxswap',
      'https://bscscan.com/token/0x31bD373bDde9e65Ff681d2970b4b01B8b2C750e0',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ATXSwap Docs',
    url: SITE_HOSTNAME,
    description: SITE_DESCRIPTION,
    inLanguage: ['en', 'zh-CN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_HOSTNAME}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'ATXSwap documentation',
    description: SITE_DESCRIPTION,
    about: {
      '@type': 'SoftwareApplication',
      name: 'ATXSwap',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web, Linux, macOS',
      url: 'https://www.atxswap.com',
    },
    inLanguage: ['en', 'zh-CN'],
    publisher: { '@type': 'Organization', name: 'agentswapx' },
  },
]

function nav(locale: 'en' | 'zh'): DefaultTheme.NavItem[] {
  if (locale === 'zh') {
    return [
      { text: '指南', link: '/zh/guide/getting-started', activeMatch: '/zh/guide/' },
      { text: '技能', link: '/zh/skill/install-openclaw', activeMatch: '/zh/skill/' },
      { text: '开发者', link: '/zh/dev/overview', activeMatch: '/zh/dev/' },
      { text: 'GitHub', link: GITHUB_ORG },
    ]
  }
  return [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    { text: 'Skill', link: '/skill/install-openclaw', activeMatch: '/skill/' },
    { text: 'Developers', link: '/dev/overview', activeMatch: '/dev/' },
    { text: 'GitHub', link: GITHUB_ORG },
  ]
}

function sidebar(locale: 'en' | 'zh'): DefaultTheme.Sidebar {
  if (locale === 'zh') {
    return {
      '/zh/guide/': [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '快速开始', link: '/zh/guide/getting-started' },
            { text: '团队介绍', link: '/zh/guide/team' },
          ],
        },
      ],
      '/zh/skill/': [
        {
          text: '安装技能',
          collapsed: false,
          items: [
            { text: 'OpenClaw', link: '/zh/skill/install-openclaw' },
            { text: 'OpenCode', link: '/zh/skill/install-opencode' },
            { text: 'Claude Code', link: '/zh/skill/install-agent' },
          ],
        },
      ],
      '/zh/dev/': [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '概览', link: '/zh/dev/overview' },
            { text: 'SDK 开发者指南', link: '/zh/dev/sdk-guide' },
          ],
        },
      ],
    }
  }
  return {
    '/guide/': [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Team Introduction', link: '/guide/team' },
        ],
      },
    ],
    '/skill/': [
      {
        text: 'Install Skill',
        collapsed: false,
        items: [
          { text: 'OpenClaw', link: '/skill/install-openclaw' },
          { text: 'OpenCode', link: '/skill/install-opencode' },
          { text: 'Claude Code', link: '/skill/install-agent' },
        ],
      },
    ],
    '/dev/': [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/dev/overview' },
          { text: 'SDK Developer Guide', link: '/dev/sdk-guide' },
        ],
      },
    ],
  }
}

export default defineConfig({
  title: 'ATXSwap Docs',
  description: 'ATXSwap official documentation — product guides & developer docs',
  cleanUrls: true,
  lastUpdated: true,

  srcExclude: ['README.md', 'README.zh.md'],

  appearance: 'dark',

  sitemap: { hostname: SITE_HOSTNAME },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'agentswapx' }],
    ['meta', { name: 'application-name', content: 'ATXSwap Docs' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'ATX, ATXSwap, decentralized agent exchange protocol, BSC, PancakeSwap V3, DeFi, AI agent trading, atxswap-sdk, ClawHub, OpenClaw, documentation',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ATXSwap Docs' }],
    ['meta', { property: 'og:title', content: 'ATXSwap Docs' }],
    ['meta', { property: 'og:description', content: SITE_DESCRIPTION }],
    ['meta', { property: 'og:url', content: SITE_HOSTNAME }],
    ['meta', { property: 'og:image', content: SITE_OG_IMAGE }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'ATXSwap Docs' }],
    ['meta', { name: 'twitter:description', content: SITE_DESCRIPTION }],
    ['meta', { name: 'twitter:image', content: SITE_OG_IMAGE }],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(jsonLd),
    ],
  ],

  themeConfig: {
    socialLinks: [{ icon: 'github', link: GITHUB_ORG }],
    search: { provider: 'local' },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'ATXSwap Docs',
      description: 'ATXSwap official documentation — product guides & developer docs',
      themeConfig: {
        nav: nav('en'),
        sidebar: sidebar('en'),
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 ATXSwap',
        },
        editLink: {
          pattern: `${REPO_EDIT_BASE}/:path`,
          text: 'Edit this page on GitHub',
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page',
        },
        outline: {
          label: 'On this page',
        },
        lastUpdated: {
          text: 'Last updated',
        },
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Change language',
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'ATXSwap 文档',
      description: 'ATXSwap 官方文档 — 产品说明 & 开发者文档',
      themeConfig: {
        nav: nav('zh'),
        sidebar: sidebar('zh'),
        footer: {
          message: '基于 MIT 协议发布。',
          copyright: 'Copyright © 2026 ATXSwap',
        },
        editLink: {
          pattern: `${REPO_EDIT_BASE}/:path`,
          text: '在 GitHub 上编辑此页',
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        outline: {
          label: '本页内容',
        },
        lastUpdated: {
          text: '最后更新',
        },
        darkModeSwitchLabel: '主题外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言',
      },
    },
  },
})

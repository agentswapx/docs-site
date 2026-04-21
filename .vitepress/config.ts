import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ATXSwap',
  description: 'ATXSwap 官方文档 — 产品说明 & 开发者文档',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '开发者', link: '/dev/overview' },
      { text: 'GitHub', link: 'https://github.com/agentswapx' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
          ],
        },
      ],
      '/dev/': [
        {
          text: '开发文档',
          items: [
            { text: '概览', link: '/dev/overview' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/agentswapx' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 ATXSwap',
    },

    editLink: {
      pattern: 'https://github.com/agentswapx/docs-site/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },
  },
})

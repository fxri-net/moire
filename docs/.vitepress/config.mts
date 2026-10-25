import { defineConfig } from 'vitepress'

// 站点基础路径：默认按 GitHub Pages 子路径 /moire/，其他部署场景经 VITEPRESS_BASE 环境变量覆盖
const base = process.env.VITEPRESS_BASE || '/moire/'

// GitHub 主仓库：社交链接与默认回链共用（对外主品牌渠道，不随部署平台变）
const githubRepo = 'https://github.com/fxri-net/moire'

// 站点规范地址（sitemap hostname 用）与编辑回链仓库：默认 GitHub Pages / GitHub 主站，
// 其他部署场景经 SITE_URL / REPO_URL 环境变量注入（值由对应 CI/CD 变量提供，只出现在该站构建产物，不进仓库源码）
const siteUrl = process.env.SITE_URL || 'https://fxri-net.github.io' + base
const repo = process.env.REPO_URL || githubRepo

const description = '轻量级 JS 前端辅助框架：微内核装配、具名枚举、schema 驱动的字段与视图，界面库经适配层隔离'

export default defineConfig({
  lang: 'zh-CN',
  // title 同时控制浏览器标签页与导航栏品牌名（logo 旁显示）
  title: '云纹框架',
  // 内页标签统一为「当前页 - 云纹框架」
  titleTemplate: ':title - 云纹框架',
  description,
  base,
  // 顶级开关：按 git 提交时间生成「最后更新于」（themeConfig.lastUpdated 仅控制文案）
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '云纹框架' }],
    ['meta', { property: 'og:title', content: '云纹框架' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],
  // 生成 sitemap.xml；hostname 带 base 子路径，保证各页 URL 拼接正确
  sitemap: { hostname: siteUrl },
  themeConfig: {
    // 导航栏 logo（字符串路径由 VitePress 自动拼接 base 前缀）
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/getting-started' },
      { text: '架构', link: '/architecture' },
      {
        text: '参考',
        items: [
          { text: 'API 总览', link: '/api/' },
          { text: '枚举字典', link: '/enums' },
          { text: 'layui 适配', link: '/adapters/layui' },
        ],
      },
      { text: '更新日志', link: '/changelog' },
      { text: 'FAQ', link: '/faq' },
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '首页', link: '/' },
          { text: '快速上手', link: '/getting-started' },
          { text: '架构设计', link: '/architecture' },
        ],
      },
      {
        text: '参考',
        items: [
          { text: 'API 总览', link: '/api/' },
          { text: '内核与插件', link: '/api/kernel' },
          { text: '工具函数', link: '/api/utils' },
          { text: '声明契约', link: '/api/schema' },
          { text: '字段能力', link: '/api/fields' },
          { text: '视图能力', link: '/api/views' },
          { text: '工具能力', link: '/api/tools' },
          { text: '请求客户端', link: '/api/http' },
          { text: '国际化', link: '/api/i18n' },
          { text: '界面适配', link: '/api/ui' },
          { text: '枚举字典', link: '/enums' },
        ],
      },
      {
        text: '接入与运维',
        items: [
          { text: '构建产物', link: '/build' },
          { text: '分发与接入', link: '/distribution' },
          { text: '发版流程', link: '/release' },
          { text: '迁移指南', link: '/migration' },
        ],
      },
      {
        text: '适配与答疑',
        items: [
          { text: 'layui 适配', link: '/adapters/layui' },
          { text: '常见问题', link: '/faq' },
          { text: '更新日志', link: '/changelog' },
        ],
      },
    ],
    // 本地搜索 + 中文界面文案
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    // 页脚「在 GitHub 上编辑此页」跳转目标
    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },
    // 全站页脚
    footer: {
      message: 'Apache License 2.0',
      copyright: 'Copyright © 2017-2026 唐启云 · 方弦研究所',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    socialLinks: [{ icon: 'github', link: githubRepo }],
  },
})

import { defineConfig } from 'vitepress'

export const cn = defineConfig({
  lang: 'cn',
  description: '一款私有云存储网盘项目，能够简单安全管理您的云端文件',

  themeConfig: {
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '简介', link: '/guide/introduction' },
          { text: '安装', link: '/guide/installation' },
          { text: 'dev', link: '/guide/dev' },
          { text: '配合Syncthing实现文件同步', link: '/guide/syncthing' },
        ],
      },
      {
        text: '常见问题',
        items: [
          { text: '重置管理员密码', link: '/guide/aq/reset-pass' },
          { text: '添加本地目录', link: '/guide/aq/add-local-folder' },
          { text: '部署后无法查看office文档', link: '/guide/aq/office-502' },
          { text: '博客问题', link: '/guide/aq/blog' },
        ],
      },
      {
        text: '其他',
        items: [
          { text: 'iframe 预览', link: '/guide/other/iframe-preview' },
        ],
      },
    ],
    footer: {
      message: '基于 MIT License 许可发布',
      copyright: '版权所有 © 2024-present JmalCloud',
    },
    editLink: {
      pattern: 'https://github.com/jmalcloud/jmalcloud.github.io/main/:path',
      text: '在 GitHub 上编辑此页面',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})

export const cnSearch = {
  translations: {
    button: {
      buttonText: '搜索文档',
      buttonAriaLabel: '搜索文档',
    },
    modal: {
      noResultsText: '无法找到相关结果',
      resetButtonTitle: '清除查询条件',
      footer: {
        selectText: '选择',
        navigateText: '切换',
        closeText: '关闭',
      },
    },
  },
}

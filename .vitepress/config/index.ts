import { withMermaid } from 'vitepress-plugin-mermaid'

import { cn, cnSearch } from './cn'
import { en } from './en'

export default withMermaid({
  title: 'JmalCloud',
  base: '/',
  lastUpdated: true,
  head: [
    [
      'script',
      {
        'defer': true,
        'src': 'https://umami.jmal.top/script.js',
        'data-website-id': 'cf91210b-8bf1-4986-9222-93988afb9152',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jamebal/jmal-cloud-view' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: { ...cnSearch },
        },
      },
    },
  },
  locales: {
    root: { label: '简体中文', ...cn },
    en: { label: 'English', ...en },
  },
})

import { withMermaid } from 'vitepress-plugin-mermaid'

import { en } from './en'
import { cn, cnSearch } from './cn'

export default withMermaid({
  title: 'JmalCloud',
  base: '/',
  lastUpdated: true,
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

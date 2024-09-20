import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en',
  description: 'A private cloud storage project that allows you to manage your cloud files simply and securely.',

  themeConfig: {
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/en/guide/introduction' },
          { text: 'Installation', link: '/en/guide/installation' },
          { text: 'Development', link: '/en/guide/dev' },
        ],
      },
      {
        text: 'Frequently Asked Questions',
        items: [
          { text: 'Reset Admin Password', link: '/en/guide/aq/reset-pass' },
          { text: 'Cannot View Office Documents After Deployment', link: '/en/guide/aq/office-502' },
          { text: 'Add Local Directory', link: '/en/guide/aq/add-local-folder' },
        ],
      },
      {
        text: 'Other',
        items: [
          { text: 'iframe Preview', link: '/guide/other/iframe-preview' },
        ],
      },
    ],
    footer: {
      message: 'Published under the MIT License',
      copyright: 'Copyright © 2024-present JmalCloud',
    },
    editLink: {
      pattern: 'https://github.com/jmalcloud/jmalcloud.github.io/main/:path',
      text: 'Edit this page on GitHub',
    },
    docFooter: {
      prev: 'Previous Page',
      next: 'Next Page',
    },
    outline: {
      label: 'Page Navigation',
    },
    lastUpdated: {
      text: 'Last updated on',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: 'Languages',
    returnToTopLabel: 'Back to Top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Switch to Light Mode',
    darkModeSwitchTitle: 'Switch to Dark Mode',
  },
})

export const cnSearch = {
  translations: {
    button: {
      buttonText: 'Search Documentation',
      buttonAriaLabel: 'Search Documentation',
    },
    modal: {
      noResultsText: 'No relevant results found',
      resetButtonTitle: 'Clear Query',
      footer: {
        selectText: 'Select',
        navigateText: 'Navigate',
        closeText: 'Close',
      },
    },
  },
}

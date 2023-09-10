import { createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    // let page = {}
    nuxt.hook('pages:extend', pages => {
      pages.push({
        name: 'injected',
        path: '/injected',
        file: resolve('./pages/injected.vue'),
        children: [],
        i18n: {
          // pageMeta: {
          //   inRoot: true,
          //   path: 'injected'
          // },
          resolvedPageOptions: {
            en: '/injec',
            ja: '/chusha-sa-reta',
            fr: '/injecte',
            de: '/gespritzt',
            nl: '/geinjecteerd',
            he: '/muzrak'
          }
        }
      })
    })
  }
})

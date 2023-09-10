<script setup lang="ts">
import { computed } from 'vue'
import { LocaleObject } from '#i18n'

definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    onBeforeEnter: async () => {
      const { finalizePendingLocaleChange } = useNuxtApp().$i18n
      await finalizePendingLocaleChange()
      console.log('onBeforeEnter')
    }
  }
})

const {
  t,
  rt,
  tm,
  strategy,
  locale,
  locales,
  localeProperties,
  setLocale,
  defaultLocale,
  finalizePendingLocaleChange
} = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()
const getRouteBaseName = useRouteBaseName()
const availableLocales = computed(() => {
  return locales.value as LocaleObject[] //.filter(i => i.code !== locale.value)
})
const rbn = computed(() => {
  return getRouteBaseName(route)
})
let lopaths = computed(() => {
  return availableLocales.value.map(l => {
    return {
      code: locale.code,
      path: localePath(getRouteBaseName(route), l.code)
    }
  })
})

function transformPathToI18nPath(path) {
  let newPath = path.split('/').map(segment => {
    // SingleParam
    // console.log(' --------------------------------------------------------------------')
    // console.log('file: injected.vue:51 ~ newPath ~ segment:', segment)

    let matchSingleParam = segment.match(/^\:(.+)\(\)$/)

    if (matchSingleParam) {
      // console.log('file: injected.vue:57 ~ newPath ~ RET[1] ~ matchSingleParam:', matchSingleParam)
      // console.log(' ------------------------------------------------------------------------------------')
      return `[${matchSingleParam[1]}]`
    }

    let matchSingleOptionalParam = segment.match(/^\:(.+)\?$/)
    if (matchSingleOptionalParam) {
      // console.log('file: injected.vue:64 ~ newPath ~ RET[1] ~ matchSingleOptionalParam:', matchSingleOptionalParam)
      // console.log(' ------------------------------------------------------------------------------------')
      return `[[${matchSingleOptionalParam[1]}]]`
    }

    let matchExtendedOptionalParam = segment.match(/\:(.+)\?/)

    if (matchExtendedOptionalParam) {
      console.log(' --------------------------------------------------------------------')
      console.log('file: injected.vue:51 ~ newPath ~ segment:', segment)
      console.log('file: injected.vue:71 ~ newPath ~ matchExtendedOptionalParam:', matchExtendedOptionalParam)
      console.log(' ----------------------------------------------------------------------------------------')
      const result = matchExtendedOptionalParam.input.replace(
        matchExtendedOptionalParam[0],
        `[[${matchExtendedOptionalParam[1]}]]`
      )
      console.log(' ------------------------------------------------')
      console.log('file: injected.vue:81 ~ newPath ~ result:', result)
      console.log(' ------------------------------------------------')
      return result
    }

    let matchExtendedParam = segment.match(/\:(.+)?\(\)/)
    if (matchExtendedParam) {
      console.log(' --------------------------------------------------------------------')
      console.log('file: injected.vue:51 ~ newPath ~ segment:', segment)
      console.log('file: injected.vue:71 ~ newPath ~ matchExtendedParam:', matchExtendedParam)
      console.log(' ----------------------------------------------------------------------------------------')
      const result = matchExtendedParam.input.replace(matchExtendedParam[0], `[${matchExtendedParam[1]}]`)

      return result
    }

    // TODO : HERE optional param

    // RestParams
    let matchRestParams = segment.match(/^\:(.+)\(\.\*\)\*$/)
    if (matchRestParams) {
      // console.log('file: injected.vue:71 ~ newPath ~ RET[1] ~ matchRestParams:', matchRestParams)
      // console.log(' --------------------------------------------------------------------')
      return `[...${matchRestParams[1]}]`
    }

    // console.log('file: injected.vue:74 ~ newPath ~ RET ~ segment:', segment)
    // console.log(' --------------------------------------------------------------------')
    return segment
  })
  return newPath.join('/')
}

function processRoutes(routes) {
  return routes.map(r => {
    if (r.children) {
      r.children = processRoutes(r.children)
    }
    return {
      ...r,
      i18nPath: transformPathToI18nPath(r.path)
    }
  })
}

const routes = router.getRoutes()

let paths = computed(() => {
  return processRoutes(routes)
})
</script>

<template>
  <div>
    <h1>I am the injected page</h1>
    <div>settings.profile: {{ t('settings.profile') }}</div>
    <div>rbn: {{ rbn }}</div>
    <div>lopaths: {{ lopaths }}</div>
    <nav>
      <span v-for="locale in availableLocales" :key="locale.code">
        <NuxtLink :to="switchLocalePath(locale.code) || ''">{{ locale.name || locale.code }}</NuxtLink> |
      </span>
    </nav>

    <div>
      <pre>{{ JSON.stringify(paths, null, 4) }}</pre>
    </div>

    <h2>Select Languages with setLocale</h2>
    <nav>
      <span v-for="locale in availableLocales" :key="locale.code">
        <a href="javascript:void(0)" @click="setLocale(locale.code)">{{ locale.name || locale.code }}</a> |
      </span>
    </nav>
  </div>
</template>

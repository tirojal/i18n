import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(nuxtApp => {
  if (typeof window !== undefined) {
    window.$nuxt = nuxtApp
  }
})

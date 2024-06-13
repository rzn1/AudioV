// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@tresjs/nuxt'],

  app: {
    head: {
      title: 'Melancholy Hues 💫',
      meta: [
        { name: 'description', content: '💫💫💫💫💫💫.' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon.ico' }],
    }
  },
})
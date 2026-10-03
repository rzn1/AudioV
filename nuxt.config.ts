export default defineNuxtConfig({
  modules: ['@tresjs/nuxt', '@pinia/nuxt', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '💫',
      meta: [
        { name: 'description', content: '💫💫💫💫💫💫.' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon.ico' }],
    }
  },

  // Listen on all interfaces so the dev server is reachable from other machines on the LAN
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  tres: {
    devtools: true,
  },
})
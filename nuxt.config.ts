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

  tres: {
    devtools: true,
  },

  nitro: {
    preset: 'vercel',
    scanDirs: ['server'],
    // We do NOT ignore bin here, because we want to explicitly include it
    // But scanDirs handles the JS scanning.
    vercel: {
      functions: {
        maxDuration: 60,
        includeFiles: ['bin/**']
      }
    }
  }
})
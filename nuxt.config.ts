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
    ignore: ['bin'],
    hooks: {
      'compiled': async (nitro: any) => {
        // Force write config.json if missing
        const fs = await import('node:fs')
        const path = await import('node:path')

        // Safety check for output dir
        if (!nitro.options.output || !nitro.options.output.dir) return;

        const configPath = path.resolve(nitro.options.output.dir, 'config.json')

        if (!fs.existsSync(configPath)) {
          console.log('Manually writing .vercel/output/config.json')
          const config = {
            version: 3,
            routes: [
              { handle: 'filesystem' },
              { src: '/.*', dest: '/' } // SPA fallback / Server handling
            ]
          }
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
        }
      }
    }
  }
})
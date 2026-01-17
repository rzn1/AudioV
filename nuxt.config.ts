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
    scanDirs: ['server'],
    ignore: ['bin'],
    hooks: {
      'compiled': async (nitro) => {
        // Copy bin files to output
        const fs = await import('node:fs')
        const path = await import('node:path')

        const src = path.resolve(nitro.options.rootDir, 'bin')
        const dest = path.resolve(nitro.options.output.serverDir, 'bin')

        if (fs.existsSync(src)) {
          console.log('Copying bin folder to output...', dest)
          fs.cpSync(src, dest, { recursive: true, force: true })
          // Ensure permissions
          const files = fs.readdirSync(dest)
          files.forEach(file => {
            if (process.platform !== 'win32') {
              fs.chmodSync(path.join(dest, file), '755')
            }
          })
        } else {
          console.warn('Bin folder not found for copy:', src)
        }
      }
    }
  }
})
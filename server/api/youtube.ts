import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    return {
        status: 'ok',
        message: 'Minimal handler working',
        time: new Date().toISOString()
    }
})

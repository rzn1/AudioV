import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    return {
        status: 'ok',
        message: 'Pipeline Fixed - Hello World',
        timestamp: new Date().toISOString()
    }
})

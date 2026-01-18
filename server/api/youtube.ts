
export default defineEventHandler(() => {
    return {
        status: 'ok',
        message: 'Super simple handler',
        timestamp: new Date().toISOString()
    }
})

import { defineEventHandler, getQuery, setHeader, createError } from 'h3'
import scdl from 'soundcloud-downloader'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
    }

    try {
        // Use any to bypass restrictive typing if necessary
        const s: any = scdl;
        const lib = s.default || s;

        // Simple regex check as fallback if validateURL isn't there
        const isSoundCloudUrl = url.includes('soundcloud.com');

        if (!isSoundCloudUrl) {
            throw createError({ statusCode: 400, statusMessage: 'Invalid SoundCloud URL' })
        }

        // Get track info
        const info = await lib.getInfo(url)
        const title = info.title?.replace(/[^\w\s-]/gi, '') || 'SoundCloud Track'

        // Set headers
        setHeader(event, 'Content-Type', 'audio/mpeg')
        setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp3"`)
        setHeader(event, 'Transfer-Encoding', 'chunked')

        // Create download stream
        // Some SoundCloud tracks are high quality and might need client_id or different method
        // But for public tracks, download() usually works
        const stream = await lib.download(url)

        return stream

    } catch (e: any) {
        console.error('SoundCloud Proxy Error:', e)
        throw createError({
            statusCode: 500,
            statusMessage: e.message || 'Failed to process audio'
        })
    }
})

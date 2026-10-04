import { defineEventHandler, getQuery, setHeader, createError } from 'h3'
import scdl from 'soundcloud-downloader'
import { importEnabled, clientId, isSoundCloudHost } from '../utils/access'
import { limit } from '../utils/cloud'

export default defineEventHandler(async (event) => {
    // On everywhere by default; set DISABLE_URL_IMPORT=1 to switch the downloaders off
    if (!importEnabled()) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    // Generous per-visitor cap so a public deployment cannot be used as a bulk downloader
    limit(`import:${clientId(event)}`, 30, 10 * 60_000)

    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
    }
    // The hostname must really be SoundCloud (a plain `includes('soundcloud.com')` accepted any URL containing it)
    if (!isSoundCloudHost(url)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid SoundCloud URL' })
    }

    try {
        // Use any to bypass restrictive typing if necessary
        const s: any = scdl;
        const lib = s.default || s;

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

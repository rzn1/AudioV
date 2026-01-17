import { defineEventHandler, getQuery, setHeader, createError } from 'h3'
import YTDlpWrap from 'yt-dlp-wrap'
import path from 'node:path'
import fs from 'node:fs'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid YouTube URL' })
    }

    try {
        // Locate binary
        // In Vercel, the bin folder should be at the root of the task
        const filename = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
        let binaryPath = path.join(process.cwd(), 'bin', filename)

        // Fallback/Check
        if (!fs.existsSync(binaryPath)) {
            // Try looking in alternative locations if Vercel moves things around?
            // But simply logging relevant info is good for debug
            console.warn(`Binary not found at ${binaryPath}. Checking process.cwd()...`);
            // Maybe it's in a different relative path?
        }

        // Initialize Wrapper with explicit path
        // @ts-ignore
        const YTDlpClass = YTDlpWrap.default || YTDlpWrap;
        const ytDlpWrap = new YTDlpClass(binaryPath)

        let title = 'YouTube Audio'
        try {
            const metadata = await ytDlpWrap.execPromise([url, '--dump-json'])
            const json = JSON.parse(metadata)
            title = json.title.replace(/[^\w\s-]/gi, '')
        } catch (e: any) {
            console.warn('Failed to fetch metadata:', e.message)
        }

        setHeader(event, 'Content-Type', 'audio/mpeg')
        setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp3"`)
        setHeader(event, 'Transfer-Encoding', 'chunked')

        const stream = ytDlpWrap.execStream([
            url,
            '-f', 'bestaudio',
        ])

        stream.on('error', (err: any) => {
            console.error('yt-dlp Stream Error:', err)
        })

        return stream

    } catch (e: any) {
        console.error('YouTube Proxy Error:', e)
        throw createError({ statusCode: 500, statusMessage: e.message || 'Failed to process audio' })
    }
})

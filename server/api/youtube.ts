import { defineEventHandler, getQuery, setHeader, createError } from 'h3'
import YTDlpWrap from 'yt-dlp-wrap'
import fs from 'node:fs'
import path from 'node:path'

const BINARY_NAME = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
const BINARY_PATH = path.join(process.cwd(), BINARY_NAME)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid YouTube URL' })
  }

  try {
    // 1. Ensure binary exists
    if (!fs.existsSync(BINARY_PATH)) {
        console.log('yt-dlp binary not found. Attempting to download...');
        try {
            // Try static method (v2.x)
            // @ts-ignore
            if (typeof YTDlpWrap.downloadFromGithub === 'function') {
                // @ts-ignore
                await YTDlpWrap.downloadFromGithub(BINARY_PATH);
            } 
            // Handle possible default export issue in some envs
            // @ts-ignore
            else if (YTDlpWrap.default && typeof YTDlpWrap.default.downloadFromGithub === 'function') {
                 // @ts-ignore
                await YTDlpWrap.default.downloadFromGithub(BINARY_PATH);
            }
            else {
                throw new Error('Could not find downloadFromGithub method on YTDlpWrap');
            }
            console.log('yt-dlp binary downloaded successfully.');
        } catch (downloadError) {
             console.error('Failed to auto-download yt-dlp:', downloadError);
             throw new Error('Server missing yt-dlp binary. Please install it manually in the project root.');
        }
    }

    // Handle ESM/CJS interop for Constructor
    // @ts-ignore
    const YTDlpClass = YTDlpWrap.default || YTDlpWrap;
    const ytDlpWrap = new YTDlpClass(BINARY_PATH)

    let title = 'YouTube Audio'
    try {
        const metadata = await ytDlpWrap.execPromise([url, '--dump-json'])
        const json = JSON.parse(metadata)
        title = json.title.replace(/[^\w\s-]/gi, '')
    } catch (e) {
        console.warn('Failed to fetch metadata, using default title', e)
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

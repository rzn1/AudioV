import { defineEventHandler, getQuery, setHeader, createError } from 'h3'

// Updated list of public Invidious instances
const INVIDIOUS_INSTANCES = [
    'https://inv.tux.pizza',
    'https://invidious.fdn.fr',
    'https://invidious.protokolla.fi',
    'https://iv.nboeck.de',
    'https://invidious.privacydev.net'
]

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid YouTube URL' })
    }

    try {
        // Extract video ID from URL
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        if (!videoIdMatch) {
            throw createError({ statusCode: 400, statusMessage: 'Invalid YouTube URL format' })
        }
        const videoId = videoIdMatch[1]

        const errors: string[] = []

        // Try each Invidious instance until one works
        for (const instance of INVIDIOUS_INSTANCES) {
            try {
                console.log(`Trying Invidious instance: ${instance}`)

                // Get video info from Invidious API
                const infoResponse = await fetch(`${instance}/api/v1/videos/${videoId}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    signal: AbortSignal.timeout(10000) // 10 second timeout
                })

                if (!infoResponse.ok) {
                    const errorText = await infoResponse.text().catch(() => 'Unknown error')
                    errors.push(`${instance}: HTTP ${infoResponse.status} - ${errorText.substring(0, 100)}`)
                    continue
                }

                const info = await infoResponse.json()
                console.log('Got video info:', info.title)

                // Find best audio format
                const audioFormat = info.adaptiveFormats
                    ?.filter((f: any) => f.type?.includes('audio'))
                    ?.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0]

                if (!audioFormat || !audioFormat.url) {
                    errors.push(`${instance}: No audio format found`)
                    continue
                }

                console.log('Found audio format:', audioFormat.type, audioFormat.bitrate)

                // Set headers
                const title = info.title?.replace(/[^\w\s-]/gi, '') || 'YouTube Audio'
                const contentType = audioFormat.type || 'audio/webm'
                const extension = contentType.includes('mp4') ? 'm4a' : 'webm'

                setHeader(event, 'Content-Type', contentType)
                setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.${extension}"`)

                // Fetch and stream the audio
                console.log('Fetching audio stream from:', audioFormat.url.substring(0, 50) + '...')
                const audioResponse = await fetch(audioFormat.url, {
                    signal: AbortSignal.timeout(30000) // 30 second timeout
                })

                if (!audioResponse.ok || !audioResponse.body) {
                    errors.push(`${instance}: Failed to fetch audio (${audioResponse.status})`)
                    continue
                }

                console.log('Streaming audio...')
                return audioResponse.body

            } catch (e: any) {
                errors.push(`${instance}: ${e.message}`)
                console.warn(`Instance ${instance} failed:`, e.message)
                continue
            }
        }

        // All instances failed - return detailed error
        console.error('All Invidious instances failed:', errors)
        throw new Error(`All instances failed:\n${errors.join('\n')}`)

    } catch (e: any) {
        console.error('YouTube Proxy Error:', e)
        throw createError({
            statusCode: 500,
            statusMessage: e.message || 'Failed to process audio'
        })
    }
})

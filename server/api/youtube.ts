import { defineEventHandler, getQuery, setHeader, createError } from 'h3'
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid YouTube URL' })
    }

    try {
        // Locate binary
        let filename = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
        let binaryPath = path.join(process.cwd(), 'public', 'bin', filename)

        if (!fs.existsSync(binaryPath)) {
            const tmpPath = path.join(process.platform === 'win32' ? os.tmpdir() : '/tmp', filename);
            if (fs.existsSync(tmpPath)) {
                binaryPath = tmpPath;
            } else {
                console.log('Binary not found locally. Downloading from public assets...');
                const host = event.node.req.headers['host'];
                const protocol = event.node.req.headers['x-forwarded-proto'] || 'http';
                const downloadUrl = `${protocol}://${host}/bin/${filename}`;

                console.log(`Downloading from ${downloadUrl} to ${tmpPath}`);

                const res = await fetch(downloadUrl);
                if (!res.ok) {
                    throw new Error(`Failed to download binary from ${downloadUrl}: ${res.statusText}`);
                }

                const arrayBuffer = await res.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                fs.writeFileSync(tmpPath, buffer);
                if (process.platform !== 'win32') {
                    fs.chmodSync(tmpPath, '755');
                }
                binaryPath = tmpPath;
                console.log('Binary downloaded and saved to ' + binaryPath);
            }
        }

        // Get Title
        let title = 'YouTube Audio'
        try {
            const metadataProcess = spawn(binaryPath, [url, '--dump-json']);
            let data = '';
            for await (const chunk of metadataProcess.stdout) {
                data += chunk;
            }
            const json = JSON.parse(data);
            title = json.title.replace(/[^\w\s-]/gi, '');
        } catch (e: any) {
            console.warn('Failed to fetch metadata:', e.message);
        }

        setHeader(event, 'Content-Type', 'audio/mp4')
        setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.m4a"`)
        setHeader(event, 'Transfer-Encoding', 'chunked')

        // Download best audio in M4A format (no conversion needed, widely supported)
        // Format 140 is typically M4A audio at 128kbps
        const args = [
            url,
            '-f', '140/bestaudio[ext=m4a]/bestaudio',
            '-o', '-' // Output to stdout
        ];

        const ytDlpProcess = spawn(binaryPath, args);

        ytDlpProcess.stderr.on('data', (data) => {
            console.log(`yt-dlp: ${data}`);
        });

        ytDlpProcess.on('error', (err) => {
            console.error('Failed to start subprocess.', err);
            throw createError({ statusCode: 500, statusMessage: 'Failed to start download process' })
        })

        return ytDlpProcess.stdout;

    } catch (e: any) {
        console.error('YouTube Proxy Error:', e)
        throw createError({ statusCode: 500, statusMessage: e.message || 'Failed to process audio' })
    }
})

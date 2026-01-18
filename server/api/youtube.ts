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
        const platform = process.platform;
        const arch = process.arch;
        const cwd = process.cwd();

        // Debug: List files in likely locations
        const debugInfo: any = {
            platform,
            arch,
            cwd,
            files: [],
            pathSearch: []
        };

        const searchPaths = [
            path.join(cwd, 'bin'),
            path.join(cwd, '..', 'bin'),
            '/var/task/bin'
        ];

        for (const dir of searchPaths) {
            try {
                if (fs.existsSync(dir)) {
                    debugInfo.files.push({ dir, contents: fs.readdirSync(dir) });
                } else {
                    debugInfo.files.push({ dir, status: 'missing' });
                }
            } catch (e: any) {
                debugInfo.files.push({ dir, error: e.message });
            }
        }

        // Return debug info instead of stream
        return {
            status: 'debug',
            info: debugInfo
        };
    } catch (e: any) {
        return {
            status: 'error',
            error: e.message
        }
    }
})

/*
        // Locate binary
        let filename = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'

        // Search paths
        const possiblePaths = [
            path.join(process.cwd(), 'bin', filename),
            path.join(process.cwd(), '..', 'bin', filename), // Sometimes one level up in lambda
            path.join(process.cwd(), '..', '..', 'bin', filename),
            '/var/task/bin/' + filename
        ];

        let binaryPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                binaryPath = p;
                console.log('Found binary at:', binaryPath);
                break;
            }
        }

        if (!binaryPath) {
            console.error('Binary NOT found. Searched:', possiblePaths);
            throw new Error('yt-dlp binary not found on server.');
        }

        // Ensure permissions
        if (process.platform !== 'win32') {
            try {
                fs.chmodSync(binaryPath, '755');
            } catch (e) {
                console.warn('Failed to chmod binary:', e);
            }
        }

        // Get Title
        let title = 'YouTube Audio'
        try {
            console.log('Fetching metadata...');
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

        setHeader(event, 'Content-Type', 'audio/mpeg')
        setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp3"`)
        setHeader(event, 'Transfer-Encoding', 'chunked')

        // Spawn ffmpeg/yt-dlp stream
        const args = [
            url,
            '-f', 'bestaudio',
            '-o', '-' // Output to stdout
        ];

        const ytDlpProcess = spawn(binaryPath, args);

        ytDlpProcess.stderr.on('data', (data) => {
            // Optional: log progress?
            // console.log(`stderr: ${data}`);
        });

        ytDlpProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp process exited with code ${code}`);
            }
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
*/

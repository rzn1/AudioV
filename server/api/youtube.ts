import { getQuery, createError, getRouterParams } from 'h3';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    // Assuming 'url' is a route parameter or query parameter.
    // If it's a route parameter, you might use: const { url } = getRouterParams(event);
    // For this example, let's assume it's a query parameter for simplicity or extracted from the path.
    // If 'url' is meant to be a specific query parameter, use: const url = query.url;
    // For now, let's define a placeholder for 'url' if it's not explicitly passed as a query param.
    // If the handler is for a route like /api/download/[url], then getRouterParams is appropriate.
    // Given the error message "Invalid YouTube URL", it's likely a specific URL parameter.
    // Let's assume `url` is meant to be a query parameter named 'url' for now.
    const url = query.url as string; // Cast to string as getQuery returns string | string[]

    if (!url && !query.debug) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid YouTube URL' })
    }

    const debugLogs: string[] = [];
    const log = (msg: string) => {
        console.log(msg);
        debugLogs.push(msg);
    };

    try {
        // Locate binary
        let filename = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
        // 1. Check local public/bin (Dev environment)
        let binaryPath = path.join(process.cwd(), 'public', 'bin', filename)

        log(`Initial binary path check: ${binaryPath}`);

        if (!fs.existsSync(binaryPath)) {
            // 2. Check /tmp (Vercel warm cache)
            const tmpPath = path.join(process.platform === 'win32' ? os.tmpdir() : '/tmp', filename);
            log(`Checking tmp path: ${tmpPath}`);

            if (fs.existsSync(tmpPath)) {
                binaryPath = tmpPath;
                log('Found in tmp');
            } else {
                // 3. Download from self (Vercel cold start)
                log('Binary not found locally. Downloading from public assets...');
                const host = event.node.req.headers['host'];
                const protocol = event.node.req.headers['x-forwarded-proto'] || 'http';
                const downloadUrl = `${protocol}://${host}/bin/${filename}`;

                log(`Downloading from ${downloadUrl} to ${tmpPath}`);

                // Using global fetch
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
                log('Binary downloaded and saved to ' + binaryPath);
            }
        }

        if (query.debug) {
            // Test execution
            return new Promise((resolve) => {
                const p = spawn(binaryPath, ['--version']);
                let stdout = '';
                let stderr = '';
                p.stdout.on('data', d => stdout += d);
                p.stderr.on('data', d => stderr += d);
                p.on('close', code => {
                    resolve({
                        status: 'debug_complete',
                        binaryPath,
                        version_code: code,
                        stdout,
                        stderr,
                        logs: debugLogs
                    });
                });
                p.on('error', err => {
                    resolve({
                        status: 'debug_error',
                        error: err.message,
                        logs: debugLogs
                    });
                });
            });
        }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error during binary setup or debug',
            data: {
                error: error.message,
                logs: debugLogs
            }
        });
    }

    return {
        status: 'ok',
        message: 'Super simple handler',
        timestamp: new Date().toISOString()
    }
})

import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';
import os from 'os';

const download = async () => {
    // In Vercel, we might need to handle where we write. 
    // But 'postinstall' runs during build, so writing to project root is usually fine.
    // We download to public/bin so it's available as a static asset
    const binDir = path.join(process.cwd(), 'public', 'bin');
    if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir, { recursive: true });
    }

    try {
        // Platform check
        // If we are on windows, we download .exe
        // If we are on linux (vercel), we download linux binary
        let binaryName = 'yt-dlp';
        let downloadUrl = '';

        if (process.platform === 'win32') {
            binaryName = 'yt-dlp.exe';
            downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe';
        } else {
            // Linux (Vercel)
            // We MUST use the standalone binary 'yt-dlp_linux' which includes python
            // The default 'yt-dlp' asset is just a script that requires system python
            binaryName = 'yt-dlp';
            downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';
        }

        const binaryPath = path.join(binDir, binaryName);

        console.log(`Checking for yt-dlp binary at ${binaryPath}...`);

        if (fs.existsSync(binaryPath)) {
            console.log('Binary already exists.');
            if (process.platform !== 'win32') {
                fs.chmodSync(binaryPath, '755');
            }
            process.exit(0);
        }

        console.log(`Downloading standalone yt-dlp binary from ${downloadUrl}...`);

        const res = await fetch(downloadUrl);
        if (!res.ok) {
            throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(binaryPath, buffer);
        console.log('Download complete.');

        // Ensure executable permissions
        if (process.platform !== 'win32') {
            fs.chmodSync(binaryPath, '755');
        }

        process.exit(0);

    } catch (e) {
        console.error('Failed to download yt-dlp:', e);
        process.exit(1);
    }
};

download();

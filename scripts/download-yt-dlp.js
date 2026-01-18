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
        if (process.platform === 'win32') {
            binaryName = 'yt-dlp.exe';
        }

        const binaryPath = path.join(binDir, binaryName);

        console.log(`Checking for yt-dlp binary at ${binaryPath}...`);

        if (fs.existsSync(binaryPath)) {
            console.log('Binary already exists.');
            // Ensure permissions anyway
            if (process.platform !== 'win32') {
                fs.chmodSync(binaryPath, '755');
            }
            process.exit(0); // Exit successfully if binary already exists
        }

        console.log('Downloading yt-dlp binary...');

        // Use YTDlpWrap to download
        // @ts-ignore
        const downloadFunc = YTDlpWrap.downloadFromGithub || (YTDlpWrap.default && YTDlpWrap.default.downloadFromGithub);

        if (typeof downloadFunc !== 'function') {
            throw new Error('Could not find downloadFromGithub function on YTDlpWrap import');
        }

        await downloadFunc(binaryPath);
        console.log('Download complete.');

        // Ensure executable permissions
        if (process.platform !== 'win32') {
            fs.chmodSync(binaryPath, '755');
        }

        process.exit(0);

    } catch (e) {
        console.error('Failed to download yt-dlp:', e);
        process.exit(0); // Exit 0 to not break build, but log error
    }
};

download();

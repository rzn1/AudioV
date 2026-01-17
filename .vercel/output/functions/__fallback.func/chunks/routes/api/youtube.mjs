import { d as defineEventHandler, g as getQuery, c as createError, s as setHeader } from '../../_/nitro.mjs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';

const youtube = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url;
  if (!url) {
    throw createError({ statusCode: 400, statusMessage: "Invalid YouTube URL" });
  }
  try {
    const filename = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
    const binaryPath = path.join(process.cwd(), "bin", filename);
    if (!fs.existsSync(binaryPath)) {
      console.warn(`Binary not found at ${binaryPath}`);
    }
    let title = "YouTube Audio";
    try {
      const metadataProcess = spawn(binaryPath, [url, "--dump-json"]);
      let data = "";
      for await (const chunk of metadataProcess.stdout) {
        data += chunk;
      }
      const json = JSON.parse(data);
      title = json.title.replace(/[^\w\s-]/gi, "");
    } catch (e) {
      console.warn("Failed to fetch metadata:", e.message);
    }
    setHeader(event, "Content-Type", "audio/mpeg");
    setHeader(event, "Content-Disposition", `attachment; filename="${encodeURIComponent(title)}.mp3"`);
    setHeader(event, "Transfer-Encoding", "chunked");
    const args = [
      url,
      "-f",
      "bestaudio",
      "-o",
      "-"
      // Output to stdout
    ];
    const ytDlpProcess = spawn(binaryPath, args);
    ytDlpProcess.stderr.on("data", (data) => {
    });
    ytDlpProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code ${code}`);
      }
    });
    ytDlpProcess.on("error", (err) => {
      console.error("Failed to start subprocess.", err);
      throw createError({ statusCode: 500, statusMessage: "Failed to start download process" });
    });
    return ytDlpProcess.stdout;
  } catch (e) {
    console.error("YouTube Proxy Error:", e);
    throw createError({ statusCode: 500, statusMessage: e.message || "Failed to process audio" });
  }
});

export { youtube as default };
//# sourceMappingURL=youtube.mjs.map

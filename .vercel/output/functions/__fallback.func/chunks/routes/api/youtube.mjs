import { d as defineEventHandler, g as getQuery, c as createError, s as setHeader } from '../../_/nitro.mjs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
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
    let filename = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
    let binaryPath = path.join(process.cwd(), "public", "bin", filename);
    if (!fs.existsSync(binaryPath)) {
      const tmpPath = path.join(process.platform === "win32" ? os.tmpdir() : "/tmp", filename);
      if (fs.existsSync(tmpPath)) {
        binaryPath = tmpPath;
      } else {
        console.log("Binary not found locally. Downloading from public assets...");
        const host = event.node.req.headers["host"];
        const protocol = event.node.req.headers["x-forwarded-proto"] || "http";
        const downloadUrl = `${protocol}://${host}/bin/${filename}`;
        console.log(`Downloading from ${downloadUrl} to ${tmpPath}`);
        const res = await fetch(downloadUrl);
        if (!res.ok) {
          throw new Error(`Failed to download binary from ${downloadUrl}: ${res.statusText}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(tmpPath, buffer);
        if (process.platform !== "win32") {
          fs.chmodSync(tmpPath, "755");
        }
        binaryPath = tmpPath;
        console.log("Binary downloaded and saved to " + binaryPath);
      }
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

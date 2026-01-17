import YTDlpWrap from 'yt-dlp-wrap';
console.log('Imported:', YTDlpWrap);
console.log('Keys:', Object.keys(YTDlpWrap));
console.log('Default:', YTDlpWrap.default);
if (YTDlpWrap.default) {
    console.log('Default Keys:', Object.keys(YTDlpWrap.default));
}
console.log('downloadFromGithub type:', typeof YTDlpWrap.downloadFromGithub);

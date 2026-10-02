const https = require('https');

https.get('https://www.youtube.com/@rajendran131', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const m1 = html.match(/"channelId":"([^"]+)"/);
    const m2 = html.match(/channel_id=([a-zA-Z0-9_-]+)/);
    const m3 = html.match(/"browseId":"([^"]+)"/);
    const m4 = html.match(/"externalId":"([^"]+)"/);
    console.log('channelId:', m1 ? m1[1] : null);
    console.log('channel_id regex:', m2 ? m2[1] : null);
    console.log('browseId:', m3 ? m3[1] : null);
    console.log('externalId:', m4 ? m4[1] : null);
  });
}).on('error', err => console.error(err));

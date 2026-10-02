const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(url, '=> Status:', res.statusCode, 'Length:', d.length);
        if (d.includes('<entry>')) {
          console.log('Found <entry> tags!');
        } else {
          console.log('Snippet:', d.slice(0, 200));
        }
        resolve();
      });
    }).on('error', err => {
      console.log('Error:', err.message);
      resolve();
    });
  });
}

async function run() {
  await testUrl('https://www.youtube.com/feeds/videos.xml?channel_id=UCMB60gSTfboAM7Gap-kYnsg');
  await testUrl('https://www.youtube.com/@rajendran131/videos');
}
run();

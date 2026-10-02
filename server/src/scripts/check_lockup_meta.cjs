const https = require('https');

https.get('https://www.youtube.com/@rajendran131/videos', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const jsonMatch = html.match(/var ytInitialData\s*=\s*({[\s\S]*?});<\/script>/) ||
                      html.match(/ytInitialData\s*=\s*({[\s\S]*?});/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[1]);
      function findKey(obj, key) {
        if (!obj || typeof obj !== 'object') return [];
        let results = [];
        if (obj[key]) results.push(obj[key]);
        for (const k of Object.keys(obj)) {
          results = results.concat(findKey(obj[k], key));
        }
        return results;
      }
      const lockups = findKey(data, 'lockupViewModel');
      if (lockups.length > 0) {
        const l = lockups[0];
        console.log('contentId:', l.contentId);
        console.log('metadata:', JSON.stringify(l.metadata, null, 2));
      }
    }
  });
});

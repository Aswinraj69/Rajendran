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
      function findRenderers(obj) {
        if (!obj || typeof obj !== 'object') return [];
        let list = [];
        for (const k of Object.keys(obj)) {
          if (k.toLowerCase().includes('videorenderer') || k.toLowerCase().includes('richitemrenderer')) {
            list.push({ key: k, val: obj[k] });
          } else {
            list = list.concat(findRenderers(obj[k]));
          }
        }
        return list;
      }
      const found = findRenderers(data);
      console.log('Found keys:', found.map(f => f.key).slice(0, 10));
      if (found.length > 0) {
        console.log('Sample item:', JSON.stringify(found[0], null, 2).slice(0, 500));
      }
    }
  });
});

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
    // Look for ytInitialData
    const jsonMatch = html.match(/var ytInitialData\s*=\s*({[\s\S]*?});<\/script>/) ||
                      html.match(/ytInitialData\s*=\s*({[\s\S]*?});/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        console.log('ytInitialData parsed successfully!');
        
        // Let's find videoRenderer objects
        const str = JSON.stringify(data);
        const videoIdMatches = [...str.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
        const uniqueIds = [...new Set(videoIdMatches.map(m => m[1]))];
        console.log('Found video IDs count:', uniqueIds.length);
        console.log('First 5 IDs:', uniqueIds.slice(0, 5));
      } catch (e) {
        console.error('Parse error:', e.message);
      }
    } else {
      console.log('ytInitialData not found in html');
    }
  });
});

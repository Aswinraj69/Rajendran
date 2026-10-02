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
      // Traverse to find richGridRenderer or tab contents
      function findKey(obj, key) {
        if (!obj || typeof obj !== 'object') return [];
        let results = [];
        if (obj[key]) results.push(obj[key]);
        for (const k of Object.keys(obj)) {
          results = results.concat(findKey(obj[k], key));
        }
        return results;
      }

      const videoRenderers = findKey(data, 'videoRenderer');
      console.log('Found videoRenderers count:', videoRenderers.length);
      if (videoRenderers.length > 0) {
        const v = videoRenderers[0];
        console.log('Sample video:');
        console.log('videoId:', v.videoId);
        console.log('title:', v.title?.runs?.[0]?.text || v.title?.simpleText);
        console.log('publishedTimeText:', v.publishedTimeText?.simpleText);
        console.log('viewCountText:', v.viewCountText?.simpleText);
        console.log('lengthText:', v.lengthText?.simpleText);
        console.log('descriptionSnippet:', v.descriptionSnippet?.runs?.map(r=>r.text).join(''));
        console.log('thumbnail:', v.thumbnail?.thumbnails?.[v.thumbnail?.thumbnails?.length - 1]?.url);
      }
    }
  });
});

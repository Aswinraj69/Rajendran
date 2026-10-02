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
      console.log('Total lockups found:', lockups.length);
      const list = lockups.map(l => {
        const meta = l.metadata?.lockupMetadataViewModel;
        const title = meta?.title?.content;
        const videoId = l.contentId;
        const thumb = l.contentImage?.thumbnailViewModel?.image?.sources?.pop()?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const timeBadge = l.contentImage?.thumbnailViewModel?.overlays;
        const metadataRows = meta?.metadata?.contentMetadataViewModel?.metadataRows;
        const subtext = metadataRows?.map(r => r.metadataParts?.map(p=>p.text?.content).join(' ')).join(' • ');
        return { videoId, title, thumb, subtext };
      });
      console.log('Parsed videos sample (first 3):', JSON.stringify(list.slice(0, 3), null, 2));
    }
  });
});

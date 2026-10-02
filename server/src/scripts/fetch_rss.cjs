const https = require("https");

const url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCMB60gSTfboAM7Gap-kYnsg";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const videoMatches = [...data.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<published>([^<]+)<\/published>/g)];
    const results = videoMatches.map(m => ({
      videoId: m[1],
      title: m[2],
      published: m[3]
    }));
    console.log(JSON.stringify(results, null, 2));
  });
}).on("error", err => console.error(err));

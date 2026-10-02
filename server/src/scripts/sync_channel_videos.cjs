const mongoose = require("mongoose");
require("dotenv").config();

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  youtubeUrl: String,
  youtubeVideoId: { type: String, unique: true },
  thumbnail: String,
  category: String,
  featured: Boolean,
  publishedAt: Date,
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

const realVideos = [
  {
    videoId: "fVFaudYAedY",
    title: "മഴവില്ലിന്റെ രാജകുമാരി | ഭാഗം 3 | ചിത്രത്തിലെ പെൺകുട്ടി ആരാണ്? 😱🌈",
    description: "രാജേന്ദ്രൻ കൈപ്പള്ളിൽ അവതരിപ്പിക്കുന്ന ഫാന്റസി കഥാഖ്യാനം - മഴവില്ലിന്റെ രാജകുമാരി ഭാഗം 3.",
    category: "stories",
    featured: true,
    publishedAt: new Date("2026-09-11T11:32:48Z"),
  },
  {
    videoId: "vkKiq1exDiQ",
    title: "🌈 നക്ഷത്രങ്ങളുടെ രാജകുമാരി | ഭാഗം 2 | തുമ്പിയുടെ അത്ഭുതശക്തി!",
    description: "Malayalam Fantasy Short Narrative created by Rajendran Kaippallil.",
    category: "short-films",
    featured: true,
    publishedAt: new Date("2026-09-07T11:47:29Z"),
  },
  {
    videoId: "tMfTNEWpHx8",
    title: "മുളയും മണ്ണും കൊണ്ട് ഒരു സ്വപ്നവീട് ❤️ | വെള്ളച്ചാട്ടത്തിനരികിലെ അവരുടെ ആദ്യരാത്രി",
    description: "പ്രകൃതിയും മനുഷ്യനും തമ്മിലുള്ള സുന്ദരമായ ആഖ്യാനം.",
    category: "stories",
    featured: true,
    publishedAt: new Date("2026-09-04T11:31:02Z"),
  },
  {
    videoId: "3Ey78vb7lWQ",
    title: "🌈 മഴവില്ലിന്റെ രാജകുമാരി | PART 1 | ഒരു പെൺകുട്ടി കണ്ട അത്ഭുതം!",
    description: "Malayalam Fantasy Story Series - Part 1.",
    category: "stories",
    featured: false,
    publishedAt: new Date("2026-09-02T11:41:52Z"),
  },
  {
    videoId: "ugIg6CFK31E",
    title: "രേവതിനക്ഷത്രക്കാർ അറിഞ്ഞിരിക്കേണ്ട 10 കാര്യങ്ങൾ! | സ്വഭാവം, വിവാഹം, സാമ്പത്തികം",
    description: "രേവതി നക്ഷത്ര വിശേഷങ്ങളും ജീവിതപാഠങ്ങളും.",
    category: "talks",
    featured: false,
    publishedAt: new Date("2026-08-30T11:30:06Z"),
  },
  {
    videoId: "Pvrgwbr66OU",
    title: "KASPAROV’S IMMORTAL! ♟️🔥 24.Rxd4!! — Topalov-നെ തകർത്ത മഹാഗെയിം",
    description: "ലോക ചെസ്സ് ചരിത്രത്തിലെ എക്കാലത്തെയും മഹത്തായ ഗെയിം വിശകലനം.",
    category: "talks",
    featured: false,
    publishedAt: new Date("2026-09-08T11:43:18Z"),
  },
  {
    videoId: "LjP07JT5TWI",
    title: "തൃശ്ശൂർ ജില്ല PSC ചോദ്യോത്തരങ്ങൾ | 100 അതീവ പ്രധാന ചോദ്യങ്ങൾ",
    description: "വിജ്ഞാനപ്രദമായ ചോദ്യോത്തരങ്ങൾ.",
    category: "talks",
    featured: false,
    publishedAt: new Date("2026-09-10T11:31:59Z"),
  },
  {
    videoId: "_Bzb5kYkFDc",
    title: "അശ്വതി നക്ഷത്രക്കാർ അറിഞ്ഞിരിക്കേണ്ട കാര്യങ്ങൾ! | Aswathy",
    description: "അശ്വതി നക്ഷത്ര സ്വഭാവ സവിശേഷതകളും വിലയിരുത്തലുകളും.",
    category: "talks",
    featured: true,
    publishedAt: new Date("2026-02-24T04:02:10Z"),
  },
];

async function sync() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas");

  // Remove the Rick Astley demo video
  await Video.deleteMany({ youtubeVideoId: "dQw4w9WgXcQ" });

  for (const v of realVideos) {
    await Video.findOneAndUpdate(
      { youtubeVideoId: v.videoId },
      {
        title: v.title,
        description: v.description,
        youtubeUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
        youtubeVideoId: v.videoId,
        thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
        category: v.category,
        featured: v.featured,
        publishedAt: v.publishedAt,
      },
      { upsert: true, new: true }
    );
  }

  const count = await Video.countDocuments();
  console.log(`Successfully synced ${realVideos.length} real videos. Total in DB: ${count}`);
  await mongoose.disconnect();
}

sync().catch(err => {
  console.error("Sync error:", err);
  process.exit(1);
});

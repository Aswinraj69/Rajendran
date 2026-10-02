import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import slugify from "slugify";
import { env } from "../config/env";
import { Story } from "../models/Story";
import { Video } from "../models/Video";
import { extractYouTubeVideoId, buildYouTubeThumbnail } from "../utils/youtube";

/**
 * Seeds a handful of clearly-marked DEMO stories and videos so the site
 * doesn't look empty in development. Nothing here is a real claim about
 * Rajendran's actual work — swap it out from the admin panel.
 * Run with: npm run seed
 */
async function run() {
  await mongoose.connect(env.mongodbUri);

  await Story.deleteMany({ tags: "demo-content" });
  await Video.deleteMany({ tags: "demo-content" as never }).catch(() => undefined);

  const demoStories = [
    {
      titleMalayalam: "മഴയുടെ ഓർമ്മകൾ",
      titleEnglish: "Memories of the Rain",
      excerptMalayalam: "ഒരു കുട്ടിക്കാല ഓർമ്മയുടെ ചെറിയ കുറിപ്പ്.",
      excerptEnglish: "A short note from a childhood memory of the monsoon.",
      contentEnglish:
        "<p>This is placeholder demo content. Replace it from the admin panel with a real story.</p>",
      contentMalayalam: "<p>ഇത് ഡെമോ ഉള്ളടക്കമാണ്. അഡ്മിൻ പാനലിൽ നിന്ന് യഥാർത്ഥ കഥ ചേർക്കുക.</p>",
      category: "story" as const,
      tags: ["demo-content", "monsoon"],
      featured: true,
      status: "published" as const,
      publishedAt: new Date(),
    },
    {
      titleEnglish: "On Writing in Malayalam Today",
      titleMalayalam: "ഇന്നത്തെ മലയാള എഴുത്തിനെക്കുറിച്ച്",
      excerptEnglish: "Placeholder essay excerpt — replace from the admin panel.",
      contentEnglish: "<p>Placeholder demo content.</p>",
      category: "essay" as const,
      tags: ["demo-content"],
      featured: false,
      status: "published" as const,
      publishedAt: new Date(Date.now() - 86400000 * 3),
    },
  ];

  for (const story of demoStories) {
    const slug = slugify(story.titleEnglish, { lower: true, strict: true });
    await Story.create({ ...story, slug });
  }

  const demoVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const videoId = extractYouTubeVideoId(demoVideoUrl)!;

  await Video.create({
    title: "Demo Video — replace from the admin panel",
    description: "Placeholder demo video entry.",
    youtubeUrl: demoVideoUrl,
    youtubeVideoId: videoId,
    thumbnail: buildYouTubeThumbnail(videoId),
    category: "youtube",
    featured: true,
    publishedAt: new Date(),
  });

  console.log("[seed] Demo content created");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

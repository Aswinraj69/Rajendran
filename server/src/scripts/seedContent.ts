import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { env } from "../config/env";
import { SiteContent } from "../models/SiteContent";

const defaultContent: { key: string; value: string; section: string }[] = [
  // ── Hero Section ──
  { key: "hero.kicker_en", value: "WRITER · SCRIPTWRITER · STORYTELLER · CREATOR", section: "hero" },
  { key: "hero.kicker_ml", value: "എഴുത്തുകാരൻ · തിരക്കഥാകൃത്ത് · കഥാകാരൻ", section: "hero" },
  { key: "hero.headline_part1_ml", value: "വാക്കുകൾ", section: "hero" },
  { key: "hero.headline_part2_ml", value: "കഥകളാകുമ്പോൾ…", section: "hero" },
  { key: "hero.headline_en", value: "When Words Become Stories…", section: "hero" },
  { key: "hero.author_name", value: "Rajendran Kaippallil", section: "hero" },
  { key: "hero.author_role_en", value: "Script Writer · Content Creator", section: "hero" },
  { key: "hero.author_role_ml", value: "തിരക്കഥാകൃത്ത് · കണ്ടന്റ് ക്രിയേറ്റർ", section: "hero" },
  { key: "hero.description_en", value: "Malayalam writer creating across scripts, stories, novels, video and sound — bridging language, culture and imagination.", section: "hero" },
  { key: "hero.description_ml", value: "തിരക്കഥകൾ, കഥകൾ, നോവലുകൾ, ദൃശ്യങ്ങൾ എന്നിവയിലൂടെ ഭാഷയെയും സംസ്കാരത്തെയും ഭാവനയെയും കോർത്തിണക്കുന്ന മലയാള സാഹിത്യകാരൻ.", section: "hero" },
  { key: "hero.cta_works_en", value: "Explore Works", section: "hero" },
  { key: "hero.cta_works_ml", value: "രചനകൾ കാണുക", section: "hero" },
  { key: "hero.cta_stories_en", value: "Read Stories", section: "hero" },
  { key: "hero.cta_stories_ml", value: "കഥകൾ വായിക്കുക", section: "hero" },
  { key: "hero.latest_video_badge_en", value: "Latest Video", section: "hero" },
  { key: "hero.latest_video_badge_ml", value: "പുതിയ വീഡിയോ", section: "hero" },

  // ── About Section ──
  { key: "about.banner_title", value: "Rajendran Kaippallil", section: "about" },
  { key: "about.banner_subtitle_en", value: "Writer · Storyteller · Screenwriter · Cultural Voice", section: "about" },
  { key: "about.banner_subtitle_ml", value: "എഴുത്തുകാരൻ · കഥാകാരൻ · സാംസ്കാരിക പ്രവർത്തകൻ", section: "about" },
  { key: "about.card_name", value: "Rajendran Kaippallil", section: "about" },
  { key: "about.location_en", value: "Kaipallil, Kerala, India", section: "about" },
  { key: "about.location_ml", value: "കൈപ്പള്ളി, കേരളം", section: "about" },
  { key: "about.stats_subscribers_num", value: "17.1K", section: "about" },
  { key: "about.stats_subscribers_label_en", value: "Subscribers", section: "about" },
  { key: "about.stats_subscribers_label_ml", value: "സബ്‌സ്‌ക്രൈബേഴ്‌സ്", section: "about" },
  { key: "about.stats_videos_num", value: "520+", section: "about" },
  { key: "about.stats_videos_label_en", value: "Videos", section: "about" },
  { key: "about.stats_videos_label_ml", value: "വീഡിയോകൾ", section: "about" },
  { key: "about.stats_views_num", value: "970K+", section: "about" },
  { key: "about.stats_views_label_en", value: "Total Views", section: "about" },
  { key: "about.stats_views_label_ml", value: "കാഴ്ചക്കാർ", section: "about" },
  { key: "about.cta_contact_en", value: "Get in Touch", section: "about" },
  { key: "about.cta_contact_ml", value: "ബന്ധപ്പെടുക", section: "about" },
  { key: "about.bio_lead_en", value: "Through the craft of Malayalam prose and visual media, Rajendran Kaipallil bridges timeless literary heritage with contemporary human stories.", section: "about" },
  { key: "about.bio_lead_ml", value: "വാക്കുകളിലൂടെ മനുഷ്യഹൃദയങ്ങളിലേക്കുള്ള പാത തെളിക്കുകയാണ് രാജേന്ദ്രൻ കൈപ്പള്ളിലിന്റെ എഴുത്തുജീവിതം.", section: "about" },
  { key: "about.bio_p1_en", value: "Rooted in the soil and cultural cadence of Kerala, his writing reflects an observant eye for subtle human emotions, community memories, and the quiet beauty of everyday life. Over decades of creative pursuit, his work has encompassed short stories, insightful cultural essays, screenplays, and dialogues.", section: "about" },
  { key: "about.bio_p1_ml", value: "നാട്ടിൻപുറങ്ങളുടെ ഗ്രാമീണഭംഗിയും മനുഷ്യബന്ധങ്ങളിലെ സൂക്ഷ്മമായ വൈകാരിക സങ്കീർണ്ണതകളും തനിമയോടെ പകർത്തുന്ന ശൈലിയാണ് അദ്ദേഹത്തിന്റെ രചനകളുടെ മുഖമുദ്ര. ചെറുകഥകളിലൂടെയും ചിന്തോദ്ദീപകമായ ലേഖനങ്ങളിലൂടെയും മലയാള വായനാലോകത്ത് തനതായ ഒരിടം കണ്ടെത്തുവാൻ അദ്ദേഹത്തിന് സാധിച്ചിട്ടുണ്ട്.", section: "about" },
  { key: "about.bio_p2_en", value: "Embracing new media, he regularly shares stories, reflections, and literary discussions through YouTube and digital formats, connecting generations of Malayalam readers across the world.", section: "about" },
  { key: "about.bio_p2_ml", value: "അക്ഷരങ്ങൾക്കൊപ്പം ദൃശ്യമാധ്യമത്തിന്റെ കരുത്തും തിരിച്ചറിഞ്ഞ്, യൂട്യൂബിലൂടെയും ഡിജിറ്റൽ പ്ലാറ്റ്‌ഫോമുകളിലൂടെയും സാംസ്കാരിക സംഭാഷണങ്ങളും കഥാവതരണങ്ങളും അവതരിപ്പിച്ചുവരുന്നു.", section: "about" },
  { key: "about.disciplines_heading_en", value: "Creative Disciplines", section: "about" },
  { key: "about.disciplines_heading_ml", value: "പ്രവർത്തന മേഖലകൾ", section: "about" },
  { key: "about.d1_title_en", value: "Malayalam Literature", section: "about" },
  { key: "about.d1_title_ml", value: "മലയാള സാഹിത്യം", section: "about" },
  { key: "about.d1_desc_en", value: "Fiction, short stories, and philosophical essays rooted in human relationships and cultural textures.", section: "about" },
  { key: "about.d1_desc_ml", value: "മനുഷ്യബന്ധങ്ങളുടെയും ജീവിതയാഥാർത്ഥ്യങ്ങളുടെയും ഉൾത്തുടിപ്പുകൾ പകർത്തുന്ന ചെറുകഥകളും ചിന്തകളും.", section: "about" },
  { key: "about.d2_title_en", value: "Screenwriting & Media", section: "about" },
  { key: "about.d2_title_ml", value: "തിരക്കഥ & മാധ്യമം", section: "about" },
  { key: "about.d2_desc_en", value: "Cinematic narratives, documentary narratives, and screen craft for visual media.", section: "about" },
  { key: "about.d2_desc_ml", value: "ദൃശ്യമാധ്യമങ്ങൾക്കായുള്ള രചനകൾ, ഡോക്യുമെന്ററി ആഖ്യാനങ്ങൾ, സ്ക്രിപ്റ്റ് നിർമ്മാണം.", section: "about" },
  { key: "about.d3_title_en", value: "Cultural Storytelling", section: "about" },
  { key: "about.d3_title_ml", value: "സാംസ്കാരിക അവതരണം", section: "about" },
  { key: "about.d3_desc_en", value: "Bringing folklore, Kerala traditions, and contemporary dialogue to YouTube and digital spaces.", section: "about" },
  { key: "about.d3_desc_ml", value: "പഴമയുടെ സാംസ്കാരിക തനിമയും വർത്തമാനകാല ചിന്തകളും ഡിജിറ്റൽ ലോകത്തേക്ക് എത്തിക്കുന്ന ഉദ്യമങ്ങൾ.", section: "about" },

  // ── Contact Section ──
  { key: "contact.badge_en", value: "Contact", section: "contact" },
  { key: "contact.badge_ml", value: "സമ്പർക്കം", section: "contact" },
  { key: "contact.heading_en", value: "Get in Touch", section: "contact" },
  { key: "contact.heading_ml", value: "സമ്പർക്കം പുലർത്തുക", section: "contact" },
  { key: "contact.subtitle_en", value: "For literary inquiries, collaborations, reading invitations, or personal messages.", section: "contact" },
  { key: "contact.subtitle_ml", value: "സാഹിത്യ ചർച്ചകൾ, സഹകരണങ്ങൾ, അല്ലെങ്കിൽ നിങ്ങളുടെ ചിന്തകൾ പങ്കുവയ്ക്കാൻ സ്വാഗതം.", section: "contact" },
  { key: "contact.direct_heading_en", value: "Direct Channels", section: "contact" },
  { key: "contact.direct_heading_ml", value: "നേരിട്ട് ബന്ധപ്പെടാൻ", section: "contact" },
  { key: "contact.email", value: "contact@rajendrankaipallil.com", section: "contact" },
  { key: "contact.location_en", value: "Kerala, India", section: "contact" },
  { key: "contact.location_ml", value: "കേരളം, ഇന്ത്യ", section: "contact" },
  { key: "contact.youtube_box_title_en", value: "YouTube & Media", section: "contact" },
  { key: "contact.youtube_box_title_ml", value: "യൂട്യൂബ് ചാനൽ", section: "contact" },
  { key: "contact.youtube_box_desc_en", value: "Watch discussions, stories, and reflections on the official YouTube channel.", section: "contact" },
  { key: "contact.youtube_box_desc_ml", value: "വീഡിയോകളും പുതിയ അപ്ഡേറ്റുകളും കാണാൻ ചാനൽ സന്ദർശിക്കുക.", section: "contact" },
  { key: "contact.youtube_url", value: "https://www.youtube.com/@rajendran131", section: "contact" },
  { key: "contact.youtube_link_label_en", value: "Visit YouTube Channel →", section: "contact" },
  { key: "contact.youtube_link_label_ml", value: "യൂട്യൂബ് ചാനൽ സന്ദർശിക്കുക →", section: "contact" },

  // ── Footer Section ──
  { key: "footer.tagline_en", value: "Writer · Scriptwriter · Storyteller · Creator", section: "footer" },
  { key: "footer.tagline_ml", value: "എഴുത്തുകാരൻ · തിരക്കഥാകൃത്ത് · കഥാകാരൻ · കണ്ടന്റ് ക്രിയേറ്റർ", section: "footer" },
  { key: "footer.contact_desc_en", value: "For collaborations, screenings, readings, or a simple hello.", section: "footer" },
  { key: "footer.contact_desc_ml", value: "സഹകരണങ്ങൾക്കും സാഹിത്യ ചർച്ചകൾക്കുമായി ബന്ധപ്പെടുക.", section: "footer" },
  { key: "footer.contact_btn_en", value: "Get in touch", section: "footer" },
  { key: "footer.contact_btn_ml", value: "ബന്ധപ്പെടുക", section: "footer" },
  { key: "footer.rights_en", value: "All rights reserved.", section: "footer" },
  { key: "footer.rights_ml", value: "സർവ്വ അവകാശങ്ങളും നിക്ഷിപ്തം.", section: "footer" },
  { key: "footer.sub_tagline", value: "Malayalam · English · Stories · Scripts · Sound", section: "footer" },

  // ── General / Branding ──
  { key: "site.brand_name_first", value: "Rajendran", section: "general" },
  { key: "site.brand_name_last", value: "Kaippallil", section: "general" },
  { key: "site.youtube_url", value: "https://www.youtube.com/@rajendran131", section: "general" },
  { key: "site.email", value: "contact@rajendrankaipallil.com", section: "general" },
];

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB!");

  const ops = defaultContent.map((item) => ({
    updateOne: {
      filter: { key: item.key },
      update: { $set: item },
      upsert: true,
    },
  }));

  const res = await SiteContent.bulkWrite(ops);
  console.log(`Seeded SiteContent successfully: ${ops.length} keys processed (upserted: ${res.upsertedCount}, matched: ${res.matchedCount}, modified: ${res.modifiedCount})`);

  await mongoose.disconnect();
  console.log("Disconnected.");
}

run().catch((err) => {
  console.error("Failed to seed site content:", err);
  process.exit(1);
});

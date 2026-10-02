import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Sparkles,
  BookOpen,
  Mail,
  PanelBottom,
} from "lucide-react";
import { fetchSiteContent, updateSiteContent, SiteContentEntry } from "../../api/siteContent";
import { useSiteContent } from "../../context/SiteContentContext";

type SectionTab = "hero" | "about" | "contact" | "footer";

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea";
  rows?: number;
  placeholder?: string;
  lang?: "en" | "ml" | "neutral";
  help?: string;
}

interface GroupDef {
  title: string;
  description?: string;
  fields: FieldDef[];
}

// Only the necessary, high-impact dynamic content
const ESSENTIAL_SECTIONS: Record<SectionTab, GroupDef[]> = {
  hero: [
    {
      title: "Hero Headline",
      description: "Change the big headline shown at the top of the homepage for different occasions or announcements.",
      fields: [
        {
          key: "hero.headline_part1_ml",
          label: "Malayalam Headline (Top Line)",
          placeholder: "വാക്കുകൾ",
          lang: "ml",
          help: "First line of the main heading (e.g. വാക്കുകൾ)",
        },
        {
          key: "hero.headline_part2_ml",
          label: "Malayalam Headline (Gradient / Highlighted Line)",
          placeholder: "കഥകളാകുമ്പോൾ…",
          lang: "ml",
          help: "Second line shown in moss-green gradient (e.g. കഥകളാകുമ്പോൾ…)",
        },
        {
          key: "hero.headline_en",
          label: "English Headline",
          placeholder: "When Words Become Stories…",
          lang: "en",
          help: "Displayed when English language is selected",
        },
      ],
    },
    {
      title: "Author Role & Hero Intro",
      description: "Roles and the summary paragraph under the author name",
      fields: [
        {
          key: "hero.author_role_en",
          label: "Role / Subtitle (English)",
          placeholder: "Script Writer · Content Creator",
          lang: "en",
        },
        {
          key: "hero.author_role_ml",
          label: "Role / Subtitle (Malayalam)",
          placeholder: "തിരക്കഥാകൃത്ത് · കണ്ടന്റ് ക്രിയേറ്റർ",
          lang: "ml",
        },
        {
          key: "hero.description_en",
          label: "Hero Intro Summary (English)",
          type: "textarea",
          rows: 3,
          placeholder: "Malayalam writer creating across scripts, stories, novels, video and sound…",
          lang: "en",
        },
        {
          key: "hero.description_ml",
          label: "Hero Intro Summary (Malayalam)",
          type: "textarea",
          rows: 3,
          placeholder: "തിരക്കഥകൾ, കഥകൾ, നോവലുകൾ, ദൃശ്യങ്ങൾ എന്നിവയിലൂടെ…",
          lang: "ml",
        },
      ],
    },
  ],

  about: [
    {
      title: "YouTube Channel Statistics",
      description: "Live numbers shown on the About profile card. Update as your channel grows!",
      fields: [
        {
          key: "about.stats_subscribers_num",
          label: "Subscribers Count",
          placeholder: "17.1K",
          lang: "neutral",
          help: "e.g. 17.1K or 20K",
        },
        {
          key: "about.stats_videos_num",
          label: "Videos Count",
          placeholder: "520+",
          lang: "neutral",
          help: "e.g. 520+ or 550+",
        },
        {
          key: "about.stats_views_num",
          label: "Total Views Count",
          placeholder: "970K+",
          lang: "neutral",
          help: "e.g. 970K+ or 1M+",
        },
      ],
    },
    {
      title: "About Biography & Story",
      description: "Main narrative text on the About page",
      fields: [
        {
          key: "about.bio_lead_en",
          label: "Opening Lead Sentence (English)",
          type: "textarea",
          rows: 2,
          placeholder: "Through the craft of Malayalam prose and visual media...",
          lang: "en",
        },
        {
          key: "about.bio_lead_ml",
          label: "Opening Lead Sentence (Malayalam)",
          type: "textarea",
          rows: 2,
          placeholder: "വാക്കുകളിലൂടെ മനുഷ്യഹൃദയങ്ങളിലേക്കുള്ള പാത തെളിക്കുകയാണ്...",
          lang: "ml",
        },
        {
          key: "about.bio_p1_en",
          label: "Main Biography Paragraph (English)",
          type: "textarea",
          rows: 4,
          placeholder: "Rooted in the soil and cultural cadence of Kerala...",
          lang: "en",
        },
        {
          key: "about.bio_p1_ml",
          label: "Main Biography Paragraph (Malayalam)",
          type: "textarea",
          rows: 4,
          placeholder: "നാട്ടിൻപുറങ്ങളുടെ ഗ്രാമീണഭംഗിയും മനുഷ്യബന്ധങ്ങളിലെ സൂക്ഷ്മമായ...",
          lang: "ml",
        },
      ],
    },
  ],

  contact: [
    {
      title: "Direct Contact Information",
      description: "Primary contact channels shown to visitors",
      fields: [
        {
          key: "contact.email",
          label: "Contact Email Address",
          placeholder: "contact@rajendrankaipallil.com",
          lang: "neutral",
        },
        {
          key: "contact.location_en",
          label: "Location (English)",
          placeholder: "Kerala, India",
          lang: "en",
        },
        {
          key: "contact.location_ml",
          label: "Location (Malayalam)",
          placeholder: "കേരളം, ഇന്ത്യ",
          lang: "ml",
        },
        {
          key: "contact.youtube_url",
          label: "Official YouTube Channel URL",
          placeholder: "https://www.youtube.com/@rajendran131",
          lang: "neutral",
        },
      ],
    },
  ],

  footer: [
    {
      title: "Footer Tagline",
      description: "Tagline shown under the logo in the website footer",
      fields: [
        {
          key: "footer.tagline_en",
          label: "Tagline (English)",
          placeholder: "Writer · Scriptwriter · Storyteller · Creator",
          lang: "en",
        },
        {
          key: "footer.tagline_ml",
          label: "Tagline (Malayalam)",
          placeholder: "എഴുത്തുകാരൻ · തിരക്കഥാകൃത്ത് · കഥാകാരൻ · കണ്ടന്റ് ക്രിയേറ്റർ",
          lang: "ml",
        },
      ],
    },
  ],
};

const TABS: { id: SectionTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "hero", label: "Hero Section", icon: Sparkles },
  { id: "about", label: "About & Stats", icon: BookOpen },
  { id: "contact", label: "Contact & Links", icon: Mail },
  { id: "footer", label: "Footer", icon: PanelBottom },
];

export default function SiteContentEditor() {
  const { updateLocalContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<SectionTab>("hero");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [initialData, setInitialData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchSiteContent();
      if (res && res.data) {
        setFormData(res.data);
        setInitialData(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load content: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  // Check if any visible field has unsaved changes
  const isDirty = useMemo(() => {
    const activeGroups = ESSENTIAL_SECTIONS[activeTab];
    for (const group of activeGroups) {
      for (const field of group.fields) {
        if ((formData[field.key] ?? "") !== (initialData[field.key] ?? "")) {
          return true;
        }
      }
    }
    // Also check all tabs
    for (const tabKey of Object.keys(ESSENTIAL_SECTIONS) as SectionTab[]) {
      for (const group of ESSENTIAL_SECTIONS[tabKey]) {
        for (const field of group.fields) {
          if ((formData[field.key] ?? "") !== (initialData[field.key] ?? "")) {
            return true;
          }
        }
      }
    }
    return false;
  }, [formData, initialData, activeTab]);

  function handleChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setFormData(initialData);
    toast("Changes reset to loaded values", { icon: "↩️" });
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Save only the essential entries
      const entries: SiteContentEntry[] = [];
      for (const tabKey of Object.keys(ESSENTIAL_SECTIONS) as SectionTab[]) {
        for (const group of ESSENTIAL_SECTIONS[tabKey]) {
          for (const field of group.fields) {
            entries.push({
              key: field.key,
              value: formData[field.key] ?? "",
              section: tabKey,
            });
          }
        }
      }

      const refreshed = await updateSiteContent(entries);
      setFormData((prev) => ({ ...prev, ...refreshed }));
      setInitialData((prev) => ({ ...prev, ...refreshed }));
      updateLocalContent(refreshed);
      toast.success("Saved successfully! Live site updated.");
    } catch (err: any) {
      toast.error("Failed to save content: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-ink-muted">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-moss border-t-transparent" />
          <span>Loading site content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-3xl text-ink">Site Content</h1>
            <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-xs font-semibold text-moss">
              Live Customizer
            </span>
          </div>
          <p className="mt-1 text-sm text-ink/60">
            Easily change headings, role, descriptions, about story, stats, and contact info.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-mist bg-white px-3 py-2 text-xs font-medium text-ink-soft hover:bg-paper-warm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </a>

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded border border-mist bg-white px-3 py-2 text-xs font-medium text-ink-soft hover:bg-paper-warm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className={`inline-flex items-center gap-2 rounded px-5 py-2 text-sm font-medium text-white shadow-sm transition ${
              isDirty
                ? "bg-moss hover:bg-moss-light cursor-pointer"
                : "bg-moss/40 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : isDirty ? "Save Changes *" : "Saved"}
          </button>
        </div>
      </div>

      {/* Dirty indicator */}
      {isDirty && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs text-ink">
          <span>⚠️ You have unsaved changes. Click <strong>Save Changes</strong> above to publish them to the live site.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-mist pb-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${
              activeTab === id
                ? "bg-moss text-white shadow-sm"
                : "bg-white text-ink-soft border border-mist hover:bg-paper-warm"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Active Tab Form Groups */}
      <div className="mt-6 space-y-6">
        {ESSENTIAL_SECTIONS[activeTab].map((group, idx) => (
          <div key={idx} className="rounded-xl border border-mist bg-white p-6 shadow-sm">
            <div className="border-b border-mist/80 pb-3 mb-5">
              <h2 className="font-display text-lg text-ink">{group.title}</h2>
              {group.description && (
                <p className="mt-0.5 text-xs text-ink/60">{group.description}</p>
              )}
            </div>

            <div className="space-y-5">
              {group.fields.map((field) => {
                const value = formData[field.key] ?? "";
                const isLangMl = field.lang === "ml";
                const isLangEn = field.lang === "en";

                return (
                  <div key={field.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ink/80 flex items-center gap-2">
                        <span>{field.label}</span>
                        {isLangMl && (
                          <span className="rounded bg-moss/10 px-1.5 py-0.5 text-[10px] font-normal text-moss">
                            മലയാളം
                          </span>
                        )}
                        {isLangEn && (
                          <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-normal text-ink-muted">
                            English
                          </span>
                        )}
                      </label>
                    </div>

                    {field.help && (
                      <p className="text-[11px] text-ink/50">{field.help}</p>
                    )}

                    {field.type === "textarea" ? (
                      <textarea
                        rows={field.rows || 3}
                        value={value}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        lang={isLangMl ? "ml" : undefined}
                        className={`w-full rounded-lg border border-mist bg-paper-cool p-3 text-sm text-ink placeholder:text-ink/30 transition focus:border-moss focus:bg-white focus:outline-none focus:ring-1 focus:ring-moss ${
                          isLangMl ? "font-serifml" : ""
                        }`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        lang={isLangMl ? "ml" : undefined}
                        className={`w-full rounded-lg border border-mist bg-paper-cool px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 transition focus:border-moss focus:bg-white focus:outline-none focus:ring-1 focus:ring-moss ${
                          isLangMl ? "font-serifml" : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteContent } from "../context/SiteContentContext";
import { Mail, MapPin, Send, CheckCircle2, Loader2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { sendContactMessage } from "../api/contact";
import toast from "react-hot-toast";

export default function Contact() {
  const { t, language } = useLanguage();
  const { c, raw } = useSiteContent();
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error(language === "ml" ? "ദയവായി ആവശ്യമായ എല്ലാ വിവരങ്ങളും നൽകുക" : "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setStatus("sent");
      toast.success(language === "ml" ? "സന്ദേശം വിജയകരമായി അയച്ചു!" : "Your message has been sent successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || (language === "ml" ? "സന്ദേശം അയക്കുന്നതിൽ പരാജയപ്പെട്ടു" : "Failed to send message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 md:pt-36">
      <div className="container-editorial">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-700"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
            {t.nav.contact}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-4xl text-ink md:text-5xl font-bold"
          >
            {language === "ml" ? "സമ്പർക്കം പുലർത്തുക" : "Get in Touch"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-ink-muted leading-relaxed font-manrope font-medium"
          >
            {language === "ml"
              ? "സാഹിത്യ ചർച്ചകൾ, സഹകരണങ്ങൾ, അല്ലെങ്കിൽ നിങ്ങളുടെ ചിന്തകൾ പങ്കുവയ്ക്കാൻ സ്വാഗതം."
              : "For literary inquiries, collaborations, reading invitations, or personal messages."}
          </motion.p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="card-glass p-8 shadow-glow-dual">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                    {language === "ml" ? "സന്ദേശം ലഭിച്ചു!" : "Message Received!"}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-ink-muted font-manrope">
                    {language === "ml"
                      ? "നിങ്ങളുടെ സന്ദേശത്തിന് നന്ദി. രാജേന്ദ്രൻ കൈപ്പള്ളിൽ ഉടൻ മറുപടി നൽകുന്നതാണ്."
                      : "Thank you for reaching out. Rajendran Kaipallil will review your note and get back to you shortly."}
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="mt-6 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-sky hover:from-sky-600 hover:to-orange-500 transition"
                  >
                    {language === "ml" ? "മറ്റൊരു സന്ദേശം അയക്കുക" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                        {language === "ml" ? "പേര്" : "Your Name"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-sky-100 bg-paper-ice px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                        {language === "ml" ? "ഇമെയിൽ" : "Email Address"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-sky-100 bg-paper-ice px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                        {language === "ml" ? "ഫോൺ നമ്പർ (ഐച്ഛികം)" : "Phone Number (Optional)"}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-sky-100 bg-paper-ice px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                        {language === "ml" ? "വിഷയം" : "Subject"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={language === "ml" ? "എന്താണ് വിഷയം?" : "Regarding a collaboration, inquiry..."}
                        className="w-full rounded-xl border border-sky-100 bg-paper-ice px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                      {language === "ml" ? "സന്ദേശം" : "Message"} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === "ml" ? "നിങ്ങളുടെ സന്ദേശം ഇവിടെ എഴുതുക..." : "Write your note here..."}
                      className="w-full rounded-xl border border-sky-100 bg-paper-ice px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-glow-dual transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {language === "ml" ? "അയക്കുന്നു..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {language === "ml" ? "സന്ദേശം അയക്കുക" : "Send Message"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Details / Direct Info */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="card-glass p-6 border-sky-100">
              <h3 className="font-display text-lg font-bold text-ink">
                {language === "ml" ? "നേരിട്ട് ബന്ധപ്പെടാൻ" : "Direct Channels"}
              </h3>
              <div className="mt-4 space-y-4 text-sm text-ink-soft font-manrope">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-sky-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-ink">Email</p>
                    <a href={`mailto:${raw("contact.email", "contact@rajendrankaipallil.com")}`} className="hover:text-sky-600 font-medium transition">
                      {raw("contact.email", "contact@rajendrankaipallil.com")}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-ink">Location</p>
                    <p className="font-medium">{c("contact.location", language === "ml" ? "കേരളം, ഇന്ത്യ" : "Kerala, India")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass p-6 border-orange-100">
              <h4 className="font-display text-base font-bold text-ink">
                {language === "ml" ? "യൂട്യൂബ് ചാനൽ" : "YouTube & Media"}
              </h4>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed font-manrope font-medium">
                {language === "ml"
                  ? "വീഡിയോകളും പുതിയ അപ്ഡേറ്റുകളും കാണാൻ ചാനൽ സന്ദർശിക്കുക."
                  : "Watch discussions, stories, and reflections on the official YouTube channel."}
              </p>
              <a
                href={raw("contact.youtube_url", "https://www.youtube.com/@rajendran131")}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-sky-600 transition"
              >
                Visit YouTube Channel &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

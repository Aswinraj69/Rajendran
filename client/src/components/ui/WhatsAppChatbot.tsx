import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  ExternalLink,
  Sparkles,
  Bot,
  CheckCheck,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  showWhatsAppCard?: boolean;
  queryParam?: string;
}

const WHATSAPP_NUMBER = "9747775333";
const WHATSAPP_DISPLAY = "+91 97477 75333";

export function WhatsAppChatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeText =
    language === "ml"
      ? "നമസ്കാരം! രാജേന്ദ്രൻ കൈപ്പള്ളിലിന്റെ ഔദ്യോഗിക വെബ്‌സൈറ്റിലേക്ക് സ്വാഗതം. നിങ്ങൾക്ക് എന്തെങ്കിലും വിവരങ്ങൾ ആവശ്യമുണ്ടോ? ഇവിടെ ചോദിക്കൂ."
      : "Hello & welcome to Rajendran Kaipallil's official portal! How can I assist you today?";

  const botReplyLead =
    language === "ml"
      ? "നിങ്ങളുടെ അന്വേഷണത്തിന് നന്ദി! കൂടുതൽ വിവരങ്ങൾക്കും നേരിട്ട് സംസാരിക്കുന്നതിനുമായി രാജേന്ദ്രൻ കൈപ്പള്ളിലുമായി വാട്സ്ആപ്പിൽ ബന്ധപ്പെടുക:"
      : "Thank you for reaching out! For direct communication, literary collaborations, and immediate response, please connect directly with Rajendran Kaipallil on WhatsApp:";

  const quickPrompts =
    language === "ml"
      ? [
          "📚 കഥകളും സാഹിത്യവും",
          "🎬 തിരക്കഥ & സിനിമ",
          "🎙️ ഓഡിയോ & ശബ്ദ സാന്നിധ്യം",
          "💬 നേരിട്ട് ബന്ധപ്പെടാൻ",
        ]
      : [
          "📚 Literary Inquiries & Stories",
          "🎬 Screenwriting & Films",
          "🎙️ Audio & Voice Works",
          "💬 Direct Discussion",
        ];

  // Initialize welcome message
  useEffect(() => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcomeText,
        timestamp: time,
        showWhatsAppCard: false,
      },
    ]);
  }, [language]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setHasInteracted(true);
    setIsTyping(true);

    // Simulate realistic bot reply
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botReplyLead,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        showWhatsAppCard: true,
        queryParam: userText,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const getWhatsAppUrl = (queryText?: string) => {
    const defaultMsg =
      language === "ml"
        ? `നമസ്കാരം രാജേന്ദ്രൻ സാർ, താങ്കളുടെ ഔദ്യോഗിക വെബ്‌സൈറ്റിൽ നിന്നാണ് ബന്ധപ്പെടുന്നത്.`
        : `Hello Rajendran Sir, I am contacting you from your official website.`;

    const queryPart = queryText
      ? `\n\nRegarding: "${queryText}"`
      : "";

    const fullMessage = encodeURIComponent(defaultMsg + queryPart);
    return `https://wa.me/91${WHATSAPP_NUMBER}?text=${fullMessage}`;
  };

  return (
    <>
      {/* ── 1. Floating Launcher Button ── */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[85]">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative flex items-center gap-3"
            >
              {/* Optional Callout Bubble */}
              {!hasInteracted && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  onClick={() => setIsOpen(true)}
                  className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-ink shadow-glow-dual border border-sky-200/80 cursor-pointer hover:border-orange-300 transition"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === "ml" ? "സഹായം വേണോ? ഇവിടെ ചാറ്റ് ചെയ്യാം" : "Need help? Chat with us"}</span>
                </motion.div>
              )}

              {/* Launcher Circle */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open Chat Assistant"
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-[0_8px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
              >
                {/* Pulse Ring */}
                <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping opacity-75 pointer-events-none" />
                <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" />

                {/* Online Green Badge */}
                <span className="absolute top-0 right-0 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white" />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. Interactive Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[95] flex flex-col w-[calc(100vw-24px)] sm:w-[380px] max-h-[580px] h-[82vh] sm:h-[560px] rounded-3xl border border-emerald-500/20 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden font-manrope"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 px-5 py-4 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/rajendran-hero.jpg"
                    alt="Rajendran Kaipallil"
                    className="h-10 w-10 rounded-full object-cover object-[center_20%] border-2 border-white/80 shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-700" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold leading-tight flex items-center gap-1.5">
                    Rajendran Kaipallil
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-current" />
                  </h3>
                  <p className="text-[11px] text-emerald-100/90 font-medium">
                    Official Studio Assistant • Online
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {/* ── Message Feed ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-paper-ice/50 via-white to-paper-ice/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs"
                        : "bg-white text-ink border border-sky-100 rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* WhatsApp Redirect Card */}
                    {msg.showWhatsAppCard && (
                      <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 shadow-2xs">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-950 font-manrope">
                              WhatsApp Direct
                            </p>
                            <p className="text-[11px] font-semibold text-emerald-700">
                              {WHATSAPP_DISPLAY}
                            </p>
                          </div>
                        </div>

                        <a
                          href={getWhatsAppUrl(msg.queryParam)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white py-2.5 px-3 text-xs font-bold shadow-glow-sky transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>
                            {language === "ml" ? "വാട്സ്ആപ്പിൽ ചാറ്റ് ചെയ്യുക" : "Chat on WhatsApp"}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="mt-1 px-1 text-[10px] text-ink-muted flex items-center gap-1">
                    {msg.timestamp}
                    {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-emerald-600" />}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-sky-100 px-3.5 py-2.5 w-fit shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-ink-muted ml-1">Typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Action Suggestion Chips ── */}
            <div className="px-3 pt-2 pb-1 border-t border-sky-100 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5 px-1">
                {language === "ml" ? "വേഗത്തിൽ ചോദിക്കാൻ" : "Quick Topics"}
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 rounded-full border border-emerald-200/80 bg-emerald-50/70 hover:bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Input Box ── */}
            <div className="p-3 bg-white border-t border-sky-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "ml" ? "നിങ്ങളുടെ സന്ദേശം എഴുതുക..." : "Type your message..."}
                  className="flex-1 rounded-xl border border-sky-100 bg-paper-ice px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {/* Direct Quick WhatsApp Footer Button */}
              <div className="mt-2 text-center">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>
                    {language === "ml" ? "നേരിട്ട് വാട്സ്ആപ്പ് തുറക്കുക" : "Direct WhatsApp"}: {WHATSAPP_DISPLAY}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

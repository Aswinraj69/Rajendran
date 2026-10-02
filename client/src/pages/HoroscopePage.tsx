import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Compass,
  Heart,
  ShieldAlert,
  Calendar,
  Clock,
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  CreditCard,
  QrCode,
  ShieldCheck,
  Download,
  Share2,
  Loader2,
  Star,
  Award,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import {
  ALL_RASHIS,
  ALL_NAKSHATRAS,
  ALL_PAADAMS,
  ALL_DAYS,
  RashiInfo,
  fetchDailyHoroscope,
  calculatePorutham,
  analyzeChovvaDosham,
  DailyHoroscopeResponse,
  PoruthamResponse,
  ChovvaDoshamResponse,
} from "../api/horoscope";

export default function HoroscopePage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "rashi";
  const [activeTab, setActiveTab] = useState<"rashi" | "porutham" | "chovva" | "full">(
    (initialTab as any) || "rashi"
  );

  // ── Unlock / Blur Paywall States ──
  const [isDailyUnlocked, setIsDailyUnlocked] = useState(false);
  const [isPoruthamUnlocked, setIsPoruthamUnlocked] = useState(false);
  const [isChovvaUnlocked, setIsChovvaUnlocked] = useState(false);
  const [isFullUnlocked, setIsFullUnlocked] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; type: string }>({
    name: "സമ്പൂർണ്ണ ജാതക റിപ്പോർട്ട് (Full Package)",
    price: 99,
    type: "all",
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // ── 1. Daily Rashi State ──
  const [selectedRashi, setSelectedRashi] = useState<RashiInfo>(ALL_RASHIS[0]);
  const [dailyData, setDailyData] = useState<DailyHoroscopeResponse["data"] | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // ── 2. Marriage Porutham Form State (Comprehensive Groom & Bride Data) ──
  const [groomForm, setGroomForm] = useState({
    name: "",
    dob: "1996-08-14",
    day: "ബുധൻ (Wednesday)",
    tob: "07:30 AM",
    pob: "കോഴിക്കോട് (Kozhikode)",
    star: ALL_NAKSHATRAS[0],
    paadam: "1 (ഒന്നാം പാദം)",
    rashi: "മേടം",
  });

  const [brideForm, setBrideForm] = useState({
    name: "",
    dob: "1999-11-22",
    day: "തിങ്കൾ (Monday)",
    tob: "09:45 AM",
    pob: "തൃശ്ശൂർ (Thrissur)",
    star: ALL_NAKSHATRAS[3],
    paadam: "2 (രണ്ടാം പാദം)",
    rashi: "ഇടവം",
  });

  const [poruthamData, setPoruthamData] = useState<PoruthamResponse["data"] | null>(null);
  const [loadingPorutham, setLoadingPorutham] = useState(false);

  // ── 3. Chovva Dosham State ──
  const [chovvaForm, setChovvaForm] = useState({
    name: "",
    gender: "male",
    dob: "1998-05-15",
    day: "വെള്ളി (Friday)",
    tob: "10:30 AM",
    pob: "എറണാകുളം (Ernakulam)",
    nakshatra: ALL_NAKSHATRAS[0],
    paadam: "1 (ഒന്നാം പാദം)",
  });
  const [chovvaData, setChovvaData] = useState<ChovvaDoshamResponse["data"] | null>(null);
  const [loadingChovva, setLoadingChovva] = useState(false);

  // Fetch Daily Horoscope on Rashi change
  useEffect(() => {
    setLoadingDaily(true);
    fetchDailyHoroscope(selectedRashi.id)
      .then((res) => setDailyData(res.data))
      .catch(() => toast.error("Failed to fetch daily horoscope"))
      .finally(() => setLoadingDaily(false));
  }, [selectedRashi]);

  // Handle Porutham Calculation
  const handleCalculatePorutham = async () => {
    setLoadingPorutham(true);
    try {
      const res = await calculatePorutham({
        groomName: groomForm.name || "വരൻ",
        groomDob: groomForm.dob,
        groomDay: groomForm.day,
        groomTob: groomForm.tob,
        groomPob: groomForm.pob,
        groomStar: groomForm.star,
        groomPaadam: groomForm.paadam,
        groomRashi: groomForm.rashi,
        brideName: brideForm.name || "വധു",
        brideDob: brideForm.dob,
        brideDay: brideForm.day,
        brideTob: brideForm.tob,
        bridePob: brideForm.pob,
        brideStar: brideForm.star,
        bridePaadam: brideForm.paadam,
        brideRashi: brideForm.rashi,
      });
      setPoruthamData(res.data);
      toast.success(
        language === "ml"
          ? "10 പൊരുത്ത വിശകലനം പൂർത്തിയായി!"
          : "10 Poruthams calculated successfully!"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to calculate porutham");
    } finally {
      setLoadingPorutham(false);
    }
  };

  // Handle Chovva Dosham Check
  const handleCheckChovva = async () => {
    setLoadingChovva(true);
    try {
      const res = await analyzeChovvaDosham({
        name: chovvaForm.name || "ജാതകൻ",
        gender: chovvaForm.gender,
        dateOfBirth: chovvaForm.dob,
        timeOfBirth: chovvaForm.tob,
        placeOfBirth: chovvaForm.pob,
        nakshatra: chovvaForm.nakshatra,
        paadam: chovvaForm.paadam,
      });
      setChovvaData(res.data);
      toast.success(
        language === "ml"
          ? "ചൊവ്വാദോഷ പരിശോധന പൂർത്തിയായി!"
          : "Chovva Dosha analysis completed!"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze dosham");
    } finally {
      setLoadingChovva(false);
    }
  };

  // Trigger Paywall Checkout
  const triggerPayment = (planName: string, price: number, type: string) => {
    setSelectedPlan({ name: planName, price, type });
    setShowPaymentModal(true);
  };

  // Process Payment Unlock
  const handleCompletePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      if (selectedPlan.type === "daily") setIsDailyUnlocked(true);
      else if (selectedPlan.type === "porutham") setIsPoruthamUnlocked(true);
      else if (selectedPlan.type === "chovva") setIsChovvaUnlocked(true);
      else {
        setIsDailyUnlocked(true);
        setIsPoruthamUnlocked(true);
        setIsChovvaUnlocked(true);
        setIsFullUnlocked(true);
      }
      setShowPaymentModal(false);
      toast.success(
        language === "ml"
          ? "പേയ്‌മെന്റ് വിജയകരം! സമ്പൂർണ്ണ ജാതക റിപ്പോർട്ട് അൺലോക്ക് ചെയ്തു."
          : "Payment Successful! Full Astrological Report Unlocked."
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-amber-50/20 to-paper pt-24 pb-20 text-ink">
      <div className="container-editorial">

        {/* ── Page Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 border border-amber-300/80 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-900 shadow-2xs font-manrope">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>{language === "ml" ? "കേരള ജ്യോതിഷം & ജാതക കേന്ദ്രം" : "Authentic Kerala Vedic Astrology"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight">
            {language === "ml"
              ? "ജാതക വിശകലനവും രാശിഫലവും"
              : "Horoscope & Marriage Compatibility"}
          </h1>

          <p className="font-manrope text-sm sm:text-base text-ink-soft leading-relaxed">
            {language === "ml"
              ? "പ്രതിദിന രാശിഫലം, 10 പൊരുത്തങ്ങൾ, ചൊവ്വാദോഷ പരിശോധന, സമ്പൂർണ്ണ ജാതകം എന്നിവ ശാസ്ത്രീയമായി അറിയാം."
              : "Explore daily Rashi Phalam, 10 Poruthams matchmaking, Chovva Dosham verification, and full astrological insights."}
          </p>
        </div>

        {/* ── Interactive Category Tabs ── */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 border-b border-amber-200/70 pb-5">
          <button
            onClick={() => { setActiveTab("rashi"); setSearchParams({ tab: "rashi" }); }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "rashi"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-amber scale-105"
                : "bg-white border border-amber-200/80 text-ink hover:bg-amber-50 hover:border-amber-400"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>{language === "ml" ? "പ്രതിദിന രാശിഫലം" : "Daily Rashi Phalam"}</span>
          </button>

          <button
            onClick={() => { setActiveTab("porutham"); setSearchParams({ tab: "porutham" }); }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "porutham"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-amber scale-105"
                : "bg-white border border-amber-200/80 text-ink hover:bg-amber-50 hover:border-amber-400"
            }`}
          >
            <Heart className="h-4 w-4 text-pink-500" />
            <span>{language === "ml" ? "10 പൊരുത്തങ്ങൾ (വിവാഹം)" : "Marriage Porutham (10 Match)"}</span>
          </button>

          <button
            onClick={() => { setActiveTab("chovva"); setSearchParams({ tab: "chovva" }); }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "chovva"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-amber scale-105"
                : "bg-white border border-amber-200/80 text-ink hover:bg-amber-50 hover:border-amber-400"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span>{language === "ml" ? "ചൊവ്വാദോഷം (Kuja Dosha)" : "Chovva Dosha Check"}</span>
          </button>

          <button
            onClick={() => { setActiveTab("full"); setSearchParams({ tab: "full" }); }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "full"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-amber scale-105"
                : "bg-white border border-amber-200/80 text-ink hover:bg-amber-50 hover:border-amber-400"
            }`}
          >
            <Star className="h-4 w-4 text-amber-500" />
            <span>{language === "ml" ? "സമ്പൂർണ്ണ ജാതകം (Premium)" : "Full Kundali & Report"}</span>
          </button>
        </div>


        {/* ══════════════════════════════════════════════════
            TAB 1: DAILY RASHI PHALAM (പ്രതിദിന രാശിഫലം)
            ══════════════════════════════════════════════════ */}
        {activeTab === "rashi" && (
          <div className="mt-8 space-y-8">
            {/* 12 Rashis Selector Grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted text-center mb-4 font-manrope">
                {language === "ml" ? "നിങ്ങളുടെ രാശി തിരഞ്ഞെടുക്കുക" : "Select Your Zodiac Sign (രാശി)"}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                {ALL_RASHIS.map((rashi) => {
                  const isSelected = selectedRashi.id === rashi.id;
                  return (
                    <button
                      key={rashi.id}
                      onClick={() => setSelectedRashi(rashi)}
                      className={`flex flex-col items-center justify-center rounded-2xl p-3 sm:p-4 transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-105 ring-2 ring-amber-400"
                          : "bg-white border border-amber-200/70 text-ink hover:border-amber-400 hover:bg-amber-50/50"
                      }`}
                    >
                      <span className="text-2xl mb-1">{rashi.symbol}</span>
                      <span className="font-display font-bold text-sm sm:text-base">{rashi.ml}</span>
                      <span className={`text-[11px] font-manrope ${isSelected ? "text-amber-100" : "text-ink-muted"}`}>
                        {rashi.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Rashi Report Card */}
            {loadingDaily ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            ) : dailyData ? (
              <div className="rounded-3xl border border-amber-300/80 bg-white/95 backdrop-blur-md p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
                
                {/* Top Public Badge & Title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{dailyData.rashi.symbol}</span>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-950">
                        {dailyData.rashi.ml} ({dailyData.rashi.en})
                      </h2>
                      <p className="text-xs text-ink-muted">
                        അധിപൻ: <span className="font-semibold text-amber-800">{dailyData.rashi.lord}</span> · ഭൂതം: <span className="font-semibold text-amber-800">{dailyData.rashi.element}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">ഭാഗ്യ ശതമാനം (Fortune Score)</p>
                      <p className="text-lg font-bold text-amber-950">{dailyData.fortuneScore}%</p>
                    </div>
                  </div>
                </div>

                {/* ── BLURRED OR REVEALED RESULTS CONTENT ── */}
                <div className="relative">
                  
                  {/* Results Container with Blur Filter if Not Unlocked */}
                  <div className={`space-y-6 transition-all duration-300 ${
                    !isDailyUnlocked ? "filter blur-[7px] select-none pointer-events-none opacity-60" : ""
                  }`}>
                    {/* Daily Prediction Text */}
                    <div className="space-y-3 bg-amber-50/70 rounded-2xl p-6 border border-amber-200">
                      <h3 className="font-display text-lg font-bold text-amber-950 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        {language === "ml" ? "ഇന്നത്തെ ഫലം (Daily Astrological Prediction)" : "Today's Astrological Outlook"}
                      </h3>
                      <p className="font-sansml text-base sm:text-lg leading-relaxed text-ink font-medium">
                        {dailyData.predictionMalayalam}
                      </p>
                      <p className="font-manrope text-sm text-ink-soft leading-relaxed pt-1">
                        {dailyData.predictionEnglish}
                      </p>
                    </div>

                    {/* 4 Lucky Key Indicators */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div className="rounded-2xl border border-amber-200 bg-white p-4 text-center">
                        <p className="text-[10px] font-bold uppercase text-amber-700">ഭാഗ്യ നമ്പർ (Lucky No)</p>
                        <p className="mt-1 font-display text-2xl font-bold text-amber-950">{dailyData.luckyNumber}</p>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-white p-4 text-center">
                        <p className="text-[10px] font-bold uppercase text-amber-700">ഭാഗ്യ നിറം (Lucky Color)</p>
                        <p className="mt-1 font-display text-sm sm:text-base font-bold text-amber-950 truncate">{dailyData.luckyColor}</p>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-white p-4 text-center">
                        <p className="text-[10px] font-bold uppercase text-amber-700">ഭാഗ്യ ദിശ (Direction)</p>
                        <p className="mt-1 font-display text-sm sm:text-base font-bold text-amber-950 truncate">{dailyData.luckyDirection}</p>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-white p-4 text-center">
                        <p className="text-[10px] font-bold uppercase text-amber-700">ധന സ്ഥിതി (Wealth Score)</p>
                        <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{dailyData.wealthScore}%</p>
                      </div>
                    </div>

                    {/* Extra Astrological Scores */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-xl bg-slate-50 border p-3">
                        <p className="text-[10px] font-bold uppercase text-ink-muted">തൊഴിൽ വിജയം (Career)</p>
                        <p className="text-sm font-bold text-slate-800">{dailyData.careerScore}%</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 border p-3">
                        <p className="text-[10px] font-bold uppercase text-ink-muted">ദാമ്പത്യം / പ്രണയം (Love)</p>
                        <p className="text-sm font-bold text-pink-700">{dailyData.loveScore}%</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 border p-3">
                        <p className="text-[10px] font-bold uppercase text-ink-muted">ആരോഗ്യം (Health)</p>
                        <p className="text-sm font-bold text-emerald-700">{dailyData.healthScore}%</p>
                      </div>
                    </div>
                  </div>

                  {/* ── OVERLAY LOCK PAYWALL (Displayed when Locked) ── */}
                  {!isDailyUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="max-w-md w-full rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-amber-400 p-6 sm:p-8 text-center shadow-2xl space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md mx-auto">
                          <Lock className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-display text-xl font-bold text-amber-950">
                            {language === "ml" ? "ഇന്നത്തെ സമ്പൂർണ്ണ രാശിഫലം ലോക്ക് ചെയ്തിരിക്കുന്നു" : "Detailed Daily Forecast Locked"}
                          </h4>
                          <p className="text-xs text-ink-soft mt-1">
                            {language === "ml"
                              ? "സമ്പൂർണ്ണ ഫലങ്ങളും ഭാഗ്യ നമ്പറുകളും പരിഹാര നിർദ്ദേശങ്ങളും കാണാൻ അൺലോക്ക് ചെയ്യുക."
                              : "Unlock complete daily horoscope, lucky factors, and personalized remedies."}
                          </p>
                        </div>

                        <div className="pt-2 flex justify-center">
                          <button
                            onClick={() => triggerPayment("പ്രതിദിന രാശിഫലം (Daily Horoscope)", 29, "daily")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition active:scale-95"
                          >
                            <Unlock className="h-4 w-4" />
                            <span>അൺലോക്ക് ചെയ്യുക (₹29)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ) : null}
          </div>
        )}


        {/* ══════════════════════════════════════════════════
            TAB 2: MARRIAGE PORUTHAM (വിവാഹ പൊരുത്തം 10)
            ══════════════════════════════════════════════════ */}
        {activeTab === "porutham" && (
          <div className="mt-8 space-y-8">
            <div className="rounded-3xl border border-amber-200 bg-white p-6 sm:p-10 shadow-xl space-y-8">
              
              <div className="border-b border-amber-100 pb-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-950">
                  {language === "ml" ? "പത്തു പൊരുത്ത പരിശോധന (10 Poruthams Vedic Match)" : "Marriage Compatibility Matchmaking"}
                </h2>
                <p className="text-xs text-ink-soft mt-1">
                  വരന്റേയും വധുവിന്റേയും വിശദമായ ജനന വിവരങ്ങളും നക്ഷത്ര പാദങ്ങളും നൽകി സൂക്ഷ്മ പരിശോധന നടത്തുക.
                </p>
              </div>

              {/* ── Two Column Profile Inputs: Groom & Bride ── */}
              <div className="grid gap-8 lg:grid-cols-2">
                
                {/* 1. GROOM DETAILS (വരന്റെ വിവരങ്ങൾ) */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-blue-200 pb-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-display text-lg font-bold text-blue-950">
                      വരന്റെ വിവരങ്ങൾ (Groom Details)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-ink/70">പേര് (Groom Name)</label>
                      <input
                        type="text"
                        value={groomForm.name}
                        onChange={(e) => setGroomForm({ ...groomForm, name: e.target.value })}
                        placeholder="e.g. രാഹുൽ കൃഷ്ണൻ (Rahul)"
                        className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന തീയതി (DOB)</label>
                        <input
                          type="date"
                          value={groomForm.dob}
                          onChange={(e) => setGroomForm({ ...groomForm, dob: e.target.value })}
                          className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന ദിവസം (Day)</label>
                        <select
                          value={groomForm.day}
                          onChange={(e) => setGroomForm({ ...groomForm, day: e.target.value })}
                          className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                        >
                          {ALL_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന സമയം (Time)</label>
                        <input
                          type="text"
                          value={groomForm.tob}
                          onChange={(e) => setGroomForm({ ...groomForm, tob: e.target.value })}
                          placeholder="e.g. 07:30 AM"
                          className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന സ്ഥലം (City/Place)</label>
                        <input
                          type="text"
                          value={groomForm.pob}
                          onChange={(e) => setGroomForm({ ...groomForm, pob: e.target.value })}
                          placeholder="e.g. Kozhikode"
                          className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">നക്ഷത്രം (Nakshatra)</label>
                        <select
                          value={groomForm.star}
                          onChange={(e) => setGroomForm({ ...groomForm, star: e.target.value })}
                          className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                        >
                          {ALL_NAKSHATRAS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">പാദം (Quarter/Paadam)</label>
                        <select
                          value={groomForm.paadam}
                          onChange={(e) => setGroomForm({ ...groomForm, paadam: e.target.value })}
                          className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-ink"
                        >
                          {ALL_PAADAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. BRIDE DETAILS (വധുവിന്റെ വിവരങ്ങൾ) */}
                <div className="rounded-2xl border border-pink-200 bg-pink-50/30 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-pink-200 pb-3">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <h3 className="font-display text-lg font-bold text-pink-950">
                      വധുവിന്റെ വിവരങ്ങൾ (Bride Details)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-ink/70">പേര് (Bride Name)</label>
                      <input
                        type="text"
                        value={brideForm.name}
                        onChange={(e) => setBrideForm({ ...brideForm, name: e.target.value })}
                        placeholder="e.g. അഞ്ജലി നായർ (Anjali)"
                        className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന തീയതി (DOB)</label>
                        <input
                          type="date"
                          value={brideForm.dob}
                          onChange={(e) => setBrideForm({ ...brideForm, dob: e.target.value })}
                          className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന ദിവസം (Day)</label>
                        <select
                          value={brideForm.day}
                          onChange={(e) => setBrideForm({ ...brideForm, day: e.target.value })}
                          className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                        >
                          {ALL_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന സമയം (Time)</label>
                        <input
                          type="text"
                          value={brideForm.tob}
                          onChange={(e) => setBrideForm({ ...brideForm, tob: e.target.value })}
                          placeholder="e.g. 09:45 AM"
                          className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">ജനന സ്ഥലം (City/Place)</label>
                        <input
                          type="text"
                          value={brideForm.pob}
                          onChange={(e) => setBrideForm({ ...brideForm, pob: e.target.value })}
                          placeholder="e.g. Thrissur"
                          className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">നക്ഷത്രം (Nakshatra)</label>
                        <select
                          value={brideForm.star}
                          onChange={(e) => setBrideForm({ ...brideForm, star: e.target.value })}
                          className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                        >
                          {ALL_NAKSHATRAS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-ink/70">പാദം (Quarter/Paadam)</label>
                        <select
                          value={brideForm.paadam}
                          onChange={(e) => setBrideForm({ ...brideForm, paadam: e.target.value })}
                          className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs font-semibold text-ink"
                        >
                          {ALL_PAADAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleCalculatePorutham}
                  disabled={loadingPorutham}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-10 py-4 text-sm font-bold text-white shadow-glow-amber hover:from-amber-600 hover:to-orange-600 transition active:scale-95 disabled:opacity-50"
                >
                  {loadingPorutham ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5" />}
                  <span>{language === "ml" ? "10 പൊരുത്തങ്ങൾ കണക്കുകൂട്ടുക" : "Calculate 10 Poruthams & Compatibility"}</span>
                </button>
              </div>

              {/* ── Porutham Results (Blurred until Unlocked) ── */}
              {poruthamData && (
                <div className="mt-8 pt-8 border-t border-amber-200 space-y-6 relative">
                  
                  {/* Public Summary Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-ink-muted">വരൻ (Groom)</p>
                      <p className="font-bold text-ink">{poruthamData.groom.name || "Groom"}</p>
                      <p className="text-amber-800">{poruthamData.groom.star}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-ink-muted">വധു (Bride)</p>
                      <p className="font-bold text-ink">{poruthamData.bride.name || "Bride"}</p>
                      <p className="text-amber-800">{poruthamData.bride.star}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-ink-muted">പൊരുത്ത സ്കോർ</p>
                      <p className="text-base font-bold text-emerald-700">{poruthamData.totalScore} / 10</p>
                      <p className="text-ink-soft">ഗുണങ്ങൾ: {poruthamData.gunaScore}/36</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-ink-muted">രജ്ജു ശുദ്ധി</p>
                      <p className="font-bold text-emerald-700">{poruthamData.isRajjuMatched ? "✓ ശുദ്ധം (Safe)" : "ദോഷം (Caution)"}</p>
                    </div>
                  </div>

                  {/* ── Deep Results Container (Blurred if not unlocked) ── */}
                  <div className={`space-y-6 transition-all duration-300 ${
                    !isPoruthamUnlocked ? "filter blur-[8px] select-none pointer-events-none opacity-60" : ""
                  }`}>
                    
                    {/* Verdict Banner */}
                    <div className={`rounded-2xl p-6 border ${
                      poruthamData.isRecommended
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : "bg-amber-50 border-amber-300 text-amber-950"
                    }`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                            <h3 className="font-display text-xl font-bold">
                              {poruthamData.totalScore} / {poruthamData.maxScore} {language === "ml" ? "പൊരുത്തങ്ങൾ ഉത്തമം (Verified)" : "Poruthams Matched"}
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium">{poruthamData.verdictMalayalam}</p>
                        </div>

                        <div className="shrink-0 bg-white px-4 py-2 rounded-xl border shadow-xs text-center">
                          <p className="text-[10px] font-bold uppercase text-ink-muted">പാപസാമ്യം (Papasamyam)</p>
                          <p className="text-xs font-bold text-emerald-700">{poruthamData.papasamyam.status}</p>
                        </div>
                      </div>
                    </div>

                    {/* 10 Poruthams Breakdown Table */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {poruthamData.poruthams.map((p, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
                            p.matched ? "bg-white border-emerald-200" : "bg-slate-50 border-slate-200 opacity-70"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-ink">{p.nameMl}</p>
                              {p.importance && (
                                <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-semibold">
                                  {p.importance}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-ink-muted mt-0.5">{p.desc}</p>
                          </div>
                          <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                            p.matched ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                          }`}>
                            {p.matched ? "✓ ഉത്തമം" : "മധ്യമം"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Papasamyam & Dasha Sandhi Check */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-2">
                        <p className="text-xs font-bold text-amber-800 uppercase">പാപസാമ്യ വിശകലനം (Papasamyam Score)</p>
                        <div className="flex justify-between text-xs font-bold text-ink">
                          <span>വരന്റെ പാപ പോയിന്റുകൾ: {poruthamData.papasamyam.groomPapa}</span>
                          <span>വധുവിന്റെ പാപ പോയിന്റുകൾ: {poruthamData.papasamyam.bridePapa}</span>
                        </div>
                        <p className="text-xs text-ink-soft">{poruthamData.papasamyam.status}</p>
                      </div>

                      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-2">
                        <p className="text-xs font-bold text-amber-800 uppercase">ദശാസന്ധി പരിശോധന (Dasha Sandhi)</p>
                        <p className="text-xs font-bold text-emerald-700">{poruthamData.dashaSandhi.status}</p>
                        <p className="text-xs text-ink-soft">{poruthamData.dashaSandhi.advice}</p>
                      </div>
                    </div>

                  </div>

                  {/* ── OVERLAY LOCK PAYWALL (Displayed when Locked) ── */}
                  {!isPoruthamUnlocked && (
                    <div className="absolute inset-x-0 bottom-0 top-32 flex items-center justify-center p-4">
                      <div className="max-w-md w-full rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-amber-400 p-6 sm:p-8 text-center shadow-2xl space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md mx-auto">
                          <Lock className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-display text-xl font-bold text-amber-950">
                            {language === "ml" ? "10 പൊരുത്ത വിശദ റിപ്പോർട്ട് ലോക്ക് ചെയ്തിരിക്കുന്നു" : "Detailed 10 Poruthams Report Locked"}
                          </h4>
                          <p className="text-xs text-ink-soft mt-1">
                            {language === "ml"
                              ? "രജ്ജുദോഷം, പാപസാമ്യം, ദശാസന്ധി വിവരങ്ങൾ ഉൾപ്പെടുന്ന സമ്പൂർണ്ണ റിപ്പോർട്ട് കാണാൻ അൺലോക്ക് ചെയ്യുക."
                              : "Unlock complete 10 Poruthams breakdown, Rajju analysis, Papasamyam scores, and Mangalya verdict."}
                          </p>
                        </div>

                        <div className="pt-2 flex justify-center">
                          <button
                            onClick={() => triggerPayment("വിവാഹ പൊരുത്ത റിപ്പോർട്ട് (10 Poruthams)", 49, "porutham")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition active:scale-95"
                          >
                            <Unlock className="h-4 w-4" />
                            <span>റിപ്പോർട്ട് അൺലോക്ക് ചെയ്യുക (₹49)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}


        {/* ══════════════════════════════════════════════════
            TAB 3: CHOVVA DOSHAM CHECKER (ചൊവ്വാദോഷം)
            ══════════════════════════════════════════════════ */}
        {activeTab === "chovva" && (
          <div className="mt-8 space-y-8">
            <div className="rounded-3xl border border-amber-200 bg-white p-6 sm:p-10 shadow-xl space-y-6">
              
              <div className="border-b border-amber-100 pb-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-950">
                  {language === "ml" ? "ചൊവ്വാദോഷ & മാംഗല്യ പരിശോധന" : "Chovva Dosham (Kuja Dosha) Analysis"}
                </h2>
                <p className="text-xs text-ink-soft mt-1">
                  ജനന തീയതി, സമയം, നക്ഷത്ര പാദം എന്നിവ നൽകി ചൊവ്വാദോഷ സാന്നിധ്യവും പരിഹാര മാർഗ്ഗങ്ങളും അറിയാം.
                </p>
              </div>

              {/* Input Form */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink/70">പേര് (Name)</label>
                  <input
                    type="text"
                    value={chovvaForm.name}
                    onChange={(e) => setChovvaForm({ ...chovvaForm, name: e.target.value })}
                    placeholder="e.g. അശ്വിൻ"
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs font-semibold text-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink/70">ജനന തീയതി (Date of Birth)</label>
                  <input
                    type="date"
                    value={chovvaForm.dob}
                    onChange={(e) => setChovvaForm({ ...chovvaForm, dob: e.target.value })}
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs font-semibold text-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink/70">ജനന സമയം (Time of Birth)</label>
                  <input
                    type="text"
                    value={chovvaForm.tob}
                    onChange={(e) => setChovvaForm({ ...chovvaForm, tob: e.target.value })}
                    placeholder="e.g. 10:30 AM"
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs font-semibold text-ink"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink/70">ജനന സ്ഥലം (Place of Birth)</label>
                  <input
                    type="text"
                    value={chovvaForm.pob}
                    onChange={(e) => setChovvaForm({ ...chovvaForm, pob: e.target.value })}
                    placeholder="e.g. Ernakulam"
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs font-semibold text-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink/70">നക്ഷത്രം (Nakshatra)</label>
                  <select
                    value={chovvaForm.nakshatra}
                    onChange={(e) => setChovvaForm({ ...chovvaForm, nakshatra: e.target.value })}
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs font-semibold text-ink"
                  >
                    {ALL_NAKSHATRAS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink/70">പാദം (Paadam)</label>
                  <select
                    value={chovvaForm.paadam}
                    onChange={(e) => setChovvaForm({ ...chovvaForm, paadam: e.target.value })}
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs font-semibold text-ink"
                  >
                    {ALL_PAADAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleCheckChovva}
                  disabled={loadingChovva}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow-amber hover:from-amber-600 hover:to-orange-600 transition active:scale-95 disabled:opacity-50"
                >
                  {loadingChovva ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                  <span>{language === "ml" ? "ചൊവ്വാദോഷം പരിശോധിക്കുക" : "Analyze Kuja Dosha"}</span>
                </button>
              </div>

              {/* Chovva Results (Blurred if not unlocked) */}
              {chovvaData && (
                <div className="mt-8 pt-6 border-t border-amber-100 space-y-6 relative">
                  
                  <div className={`space-y-6 transition-all duration-300 ${
                    !isChovvaUnlocked ? "filter blur-[8px] select-none pointer-events-none opacity-60" : ""
                  }`}>
                    <div className={`rounded-2xl p-6 border ${
                      chovvaData.hasDosham
                        ? "bg-amber-50 border-amber-300 text-amber-950"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}>
                      <h3 className="font-display text-xl font-bold flex items-center gap-2">
                        {chovvaData.hasDosham ? <ShieldAlert className="h-5 w-5 text-amber-600" /> : <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        <span>{chovvaData.severity}</span>
                      </h3>
                      <p className="mt-2 text-sm font-medium">{chovvaData.analysisMalayalam}</p>
                      <p className="mt-1 text-xs text-ink-muted">{chovvaData.analysisEnglish}</p>
                    </div>

                    {/* Temple Remedies Section */}
                    {chovvaData.hasDosham && (
                      <div className="rounded-2xl border border-amber-200 bg-white p-6 space-y-4">
                        <h4 className="font-display text-base font-bold text-amber-950 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                          {language === "ml" ? "പ്രത്യേക ക്ഷേത്ര പരിഹാര പൂജകൾ" : "Recommended Astrological Remedies"}
                        </h4>
                        <ul className="space-y-2">
                          {chovvaData.remediesMalayalam.map((rem, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-ink">
                              <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              <span>{rem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* ── OVERLAY LOCK PAYWALL (Displayed when Locked) ── */}
                  {!isChovvaUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="max-w-md w-full rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-amber-400 p-6 sm:p-8 text-center shadow-2xl space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md mx-auto">
                          <Lock className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-display text-xl font-bold text-amber-950">
                            {language === "ml" ? "ചൊവ്വാദോഷ & പരിഹാര റിപ്പോർട്ട് ലോക്ക് ചെയ്തിരിക്കുന്നു" : "Chovva Dosha Analysis Locked"}
                          </h4>
                          <p className="text-xs text-ink-soft mt-1">
                            {language === "ml"
                              ? "കുജന്റെ ഭാവസ്ഥിതിയും ക്ഷേത്ര പൂജാ പരിഹാരങ്ങളും പൂർണ്ണമായി അറിയാൻ അൺലോക്ക് ചെയ്യുക."
                              : "Unlock planetary placement insights, Kuja severity degree, and recommended temple remedies."}
                          </p>
                        </div>

                        <div className="pt-2 flex justify-center">
                          <button
                            onClick={() => triggerPayment("ചൊവ്വാദോഷ റിപ്പോർട്ട് (Chovva Dosha)", 39, "chovva")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition active:scale-95"
                          >
                            <Unlock className="h-4 w-4" />
                            <span>അൺലോക്ക് ചെയ്യുക (₹39)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}


        {/* ══════════════════════════════════════════════════
            TAB 4: FULL KUNDALI & CONSULTATION (സമ്പൂർണ്ണ ജാതകം)
            ══════════════════════════════════════════════════ */}
        {activeTab === "full" && (
          <div className="mt-8 space-y-8">
            
            {/* If Not Unlocked: Show Paywall Card */}
            {!isFullUnlocked ? (
              <div className="rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-white via-amber-50/40 to-white p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg mx-auto">
                    <Lock className="h-8 w-8" />
                  </div>

                  <div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-amber-950">
                      {language === "ml" ? "സമ്പൂർണ്ണ ജാതക വിശകലന റിപ്പോർട്ട്" : "Unlock Full Detailed Horoscope Report"}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                      ഗ്രഹസ്ഥിതി ചാർട്ട്, നവാംശകം, ദശാപഹാരങ്ങൾ, തൊഴിൽ-ധന യോഗങ്ങൾ, വിവാഹ-സന്താന ഫലങ്ങൾ, ശുപാർശ ചെയ്യുന്ന ഭാഗ്യ രത്നങ്ങൾ എന്നിവ അടങ്ങിയ സമ്പൂർണ്ണ ഡിജിറ്റൽ ജാതകം.
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto pt-2 text-xs font-semibold text-ink">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>ഗ്രഹസ്ഥിതി ചാർട്ട് (Rashi Chart)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>ദശാപഹാര വിശകലനം (Dasha)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>തൊഴിൽ & സാമ്പത്തിക യോഗം</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>രത്നനിർദ്ദേശം (Lucky Gemstone)</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => triggerPayment("സമ്പൂർണ്ണ ജാതക പാക്കേജ് (All-in-One)", 99, "full")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-4 text-sm font-bold text-white shadow-glow-amber hover:from-amber-600 hover:to-orange-600 transition active:scale-95"
                    >
                      <Unlock className="h-4 w-4 text-amber-200" />
                      <span>റിപ്പോർട്ട് അൺലോക്ക് ചെയ്യുക (₹99)</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-ink-muted">
                    Instant Downloadable PDF · 100% Authentic Kerala Vedic Astrology
                  </p>
                </div>
              </div>
            ) : (
              /* Unlocked Comprehensive Report */
              <div className="rounded-3xl border border-amber-300 bg-white p-6 sm:p-10 shadow-2xl space-y-8">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" /> UNLOCKED FULL ASTROLOGICAL REPORT
                    </span>
                    <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-amber-950">
                      രാജേന്ദ്രൻ കൈപ്പള്ളിൽ ജ്യോതിഷ കേന്ദ്രം · സമ്പൂർണ്ണ ജാതകം
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success("PDF Download Initiated!")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                  </div>
                </div>

                {/* 1. Kundali / Rashi Grid Chart */}
                <div>
                  <h3 className="font-display text-lg font-bold text-amber-950 mb-3">
                    1. ഗ്രഹസ്ഥിതി ചക്രം (Planetary Rashi Chart)
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold font-manrope">
                    <div className="border border-amber-300 p-4 bg-amber-50/60 rounded-xl">മീനം (ബുധൻ)</div>
                    <div className="border border-amber-300 p-4 bg-white rounded-xl">മേടം (ലഗ്നം)</div>
                    <div className="border border-amber-300 p-4 bg-amber-50/60 rounded-xl">ഇടവം (ശുക്രൻ)</div>
                    <div className="border border-amber-300 p-4 bg-white rounded-xl">മിഥുനം (രാഹു)</div>
                    <div className="border border-amber-300 p-4 bg-white rounded-xl">കുംഭം (ശനി)</div>
                    <div className="col-span-2 row-span-2 border-2 border-amber-400 bg-gradient-to-br from-amber-100/50 to-orange-50/50 rounded-2xl flex flex-col items-center justify-center p-4">
                      <Sparkles className="h-6 w-6 text-amber-600 mb-1" />
                      <p className="font-display text-base font-bold text-amber-950">രാശി ചക്രം</p>
                      <p className="text-[10px] text-amber-800">Kerala Traditional Kundali</p>
                    </div>
                    <div className="border border-amber-300 p-4 bg-amber-50/60 rounded-xl">കർക്കിടകം (ചന്ദ്രൻ)</div>
                    <div className="border border-amber-300 p-4 bg-amber-50/60 rounded-xl">മകരം (കുജൻ)</div>
                    <div className="border border-amber-300 p-4 bg-white rounded-xl">ചിങ്ങം (സൂര്യൻ)</div>
                    <div className="border border-amber-300 p-4 bg-white rounded-xl">ധനു (വ്യാഴം)</div>
                    <div className="border border-amber-300 p-4 bg-amber-50/60 rounded-xl">വൃശ്ചികം (കേതു)</div>
                    <div className="border border-amber-300 p-4 bg-white rounded-xl">തുലാം</div>
                    <div className="border border-amber-300 p-4 bg-amber-50/60 rounded-xl">കന്നി</div>
                  </div>
                </div>

                {/* 2. Dasha Periods & Predictions */}
                <div className="space-y-3 bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
                  <h3 className="font-display text-base font-bold text-amber-950">
                    2. നിലവിലെ ദശാകാല ഫലങ്ങൾ (Current Dasha & Predictions)
                  </h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-ink">
                    നിലവിൽ വ്യാഴദശയിൽ ശുക്രാപഹാരമാണ് നടക്കുന്നത്. ഇത് തൊഴിൽപരമായി വളരെ ഉയർന്ന സ്ഥാനമാനങ്ങളും വിദേശബന്ധങ്ങളും സാമ്പത്തിക വളർച്ചയും ഉറപ്പുനൽകുന്നു. കുടുംബത്തിൽ മംഗളകർമ്മങ്ങൾ നടക്കും.
                  </p>
                </div>

                {/* 3. Gemstone & Temple Remedies */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-amber-200 bg-white p-5 space-y-2">
                    <p className="text-xs font-bold text-amber-800 uppercase">ശുപാർശ ചെയ്യുന്ന ഭാഗ്യ രത്നം</p>
                    <p className="font-display text-lg font-bold text-amber-950">മഞ്ഞ പുഷ്യരാഗം (Yellow Sapphire)</p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      വ്യാഴപ്രീതിക്കും ഉയർന്ന സാമ്പത്തിക വിജയത്തിനും സ്വർണ്ണത്തിൽ ധരിക്കുന്നത് അത്യുത്തമം.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-white p-5 space-y-2">
                    <p className="text-xs font-bold text-amber-800 uppercase">ക്ഷേത്ര ദർശന നിർദ്ദേശം</p>
                    <p className="font-display text-lg font-bold text-amber-950">ഗുരുവായൂർ & ചോറ്റാനിക്കര</p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      വ്യാഴാഴ്ചകളിൽ വിഷ്ണു സഹസ്രനാമ ജപവും വെണ്ണ നിവേദ്യവും നടത്തുക.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════
          PAYMENT MODAL (UPI / GPay / PhonePe / Cards Flow)
          ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-amber-300 bg-white p-6 sm:p-8 shadow-2xl text-center space-y-6"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure 256-Bit Payment Gateway
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-amber-950">
                  {selectedPlan.name}
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Instant Full Report Unlock · PDF Download Access
                </p>
              </div>

              {/* Amount Box */}
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                <p className="text-xs text-amber-800 font-semibold">Total Payable Amount</p>
                <p className="font-display text-3xl font-bold text-amber-950">₹{selectedPlan.price} <span className="text-xs font-normal text-ink-muted">INR (All Inclusive)</span></p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between p-3 rounded-xl border border-amber-300 bg-amber-50/50">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="h-5 w-5 text-amber-700" />
                    <div>
                      <p className="text-xs font-bold text-ink">UPI / Google Pay / PhonePe / Paytm</p>
                      <p className="text-[10px] text-ink-muted">Instant QR scan & UPI handle</p>
                    </div>
                  </div>
                  <input type="radio" name="payMethod" defaultChecked className="text-amber-600 focus:ring-amber-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-5 w-5 text-slate-700" />
                    <div>
                      <p className="text-xs font-bold text-ink">Debit / Credit Card / Netbanking</p>
                      <p className="text-[10px] text-ink-muted">Visa, Mastercard, RuPay, SBI, HDFC</p>
                    </div>
                  </div>
                  <input type="radio" name="payMethod" className="text-amber-600 focus:ring-amber-500" />
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleCompletePayment}
                disabled={paymentProcessing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-glow-amber hover:from-amber-600 hover:to-orange-600 transition active:scale-95 disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Payment…</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay ₹{selectedPlan.price} & Unlock Now</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-xs text-ink-muted hover:text-ink transition"
              >
                Cancel & Go Back
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

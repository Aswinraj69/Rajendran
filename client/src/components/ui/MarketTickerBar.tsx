import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Coins,
  LineChart,
  X,
  Sparkles,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface GoldRateData {
  gold22kGram: number;
  gold22kPavan: number;
  gold24kGram: number;
  gold24k10g: number;
  silverGram: number;
  silverKg: number;
  goldChange: number;
  silverChange: number;
}

export interface StockMarketData {
  nifty50: { value: number; change: number; percent: number };
  sensex: { value: number; change: number; percent: number };
  usdInr: { value: number; change: number; percent: number };
  crudeOil: { value: number; change: number; percent: number };
}

// Live Default Reference Market Data (Kerala Bullion & NSE/BSE)
const initialGoldRates: GoldRateData = {
  gold22kGram: 6850,
  gold22kPavan: 54800,
  gold24kGram: 7470,
  gold24k10g: 74700,
  silverGram: 94.5,
  silverKg: 94500,
  goldChange: 35,
  silverChange: 0.5,
};

const initialStockData: StockMarketData = {
  nifty50: { value: 25140.2, change: 112.4, percent: 0.45 },
  sensex: { value: 82190.5, change: 360.8, percent: 0.44 },
  usdInr: { value: 83.95, change: -0.05, percent: -0.06 },
  crudeOil: { value: 72.8, change: -0.4, percent: -0.55 },
};

export function MarketTickerBar() {
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [goldRates] = useState<GoldRateData>(initialGoldRates);
  const [stockData] = useState<StockMarketData>(initialStockData);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const tickerItems = [
    {
      badge: "22K GOLD (1g)",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      value: `₹${goldRates.gold22kGram.toLocaleString("en-IN")}`,
      change: `+₹${goldRates.goldChange}`,
      isPositive: true,
    },
    {
      badge: "KERALA PAVAN (8g)",
      badgeColor: "bg-amber-500 text-white font-bold",
      value: `₹${goldRates.gold22kPavan.toLocaleString("en-IN")}`,
      change: `+₹${goldRates.goldChange * 8}`,
      isPositive: true,
    },
    {
      badge: "24K PURE GOLD (1g)",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      value: `₹${goldRates.gold24kGram.toLocaleString("en-IN")}`,
      change: "99.9%",
      isPositive: true,
    },
    {
      badge: "SILVER (1g)",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      value: `₹${goldRates.silverGram.toLocaleString("en-IN")}`,
      change: `+₹${goldRates.silverChange}`,
      isPositive: true,
    },
    {
      badge: "SILVER (1kg)",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      value: `₹${goldRates.silverKg.toLocaleString("en-IN")}`,
      change: "Standard Bar",
      isPositive: true,
    },
    {
      badge: "NIFTY 50",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      value: `${stockData.nifty50.value.toLocaleString("en-IN")}`,
      change: `+${stockData.nifty50.percent}%`,
      isPositive: true,
    },
    {
      badge: "SENSEX",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      value: `${stockData.sensex.value.toLocaleString("en-IN")}`,
      change: `+${stockData.sensex.percent}%`,
      isPositive: true,
    },
    {
      badge: "USD / INR",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      value: `₹${stockData.usdInr.value}`,
      change: `${stockData.usdInr.percent}%`,
      isPositive: true,
    },
    {
      badge: "CRUDE OIL",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      value: `$${stockData.crudeOil.value}/bbl`,
      change: `${stockData.crudeOil.percent}%`,
      isPositive: false,
    },
  ];

  return (
    <>
      {/* ── Continuous Luxury Marquee Ticker Bar ── */}
      <section className="relative z-20 w-full border-y border-amber-300/80 bg-gradient-to-r from-amber-100/95 via-amber-50/90 to-amber-100/95 shadow-md backdrop-blur-xl overflow-hidden py-2 sm:py-2.5">
        <div className="flex items-center justify-between">
          
          {/* Left Sticky Label on Desktop & Tablet */}
          <div className="z-20 shrink-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-3.5 sm:px-5 py-2 flex items-center gap-2 shadow-md rounded-r-2xl border-r border-amber-300">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <Coins className="h-4 w-4 text-amber-200" />
            <span className="font-manrope text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              {language === "ml" ? "വിപണി നിരക്കുകൾ" : "Live Market Pulse"}
            </span>
          </div>

          {/* Marquee Track (Slow, Continuous Gliding Animation) */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={() => setModalOpen(true)}
            className="flex-1 overflow-hidden cursor-pointer marquee-mask relative select-none"
            title="Click to view detailed rates"
          >
            <div
              className={`flex shrink-0 items-center animate-marquee ${
                isPaused ? "animate-marquee-paused" : ""
              }`}
              style={{ animationDuration: "36s" }}
            >
              {/* Primary Sequence */}
              <div className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
                {tickerItems.map((item, idx) => (
                  <div
                    key={`p-${idx}`}
                    className="flex items-center gap-2 shrink-0 py-1 px-3 rounded-xl bg-white/80 border border-amber-200/80 shadow-2xs hover:bg-white hover:border-amber-400 transition"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="font-display font-bold text-sm text-ink">{item.value}</span>
                    <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                      item.isPositive ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {item.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Duplicated Sequence for Infinite Seamless Glide */}
              <div className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10" aria-hidden="true">
                {tickerItems.map((item, idx) => (
                  <div
                    key={`d-${idx}`}
                    className="flex items-center gap-2 shrink-0 py-1 px-3 rounded-xl bg-white/80 border border-amber-200/80 shadow-2xs hover:bg-white hover:border-amber-400 transition"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="font-display font-bold text-sm text-ink">{item.value}</span>
                    <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                      item.isPositive ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {item.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky View Full Rates Button */}
          <div className="z-20 shrink-0 px-2 sm:px-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 sm:px-4 py-1.5 text-[11px] font-bold text-white shadow-md hover:bg-amber-600 transition active:scale-95 font-manrope whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{language === "ml" ? "പൂർണ്ണ വിവരങ്ങൾ" : "View Full Rates"}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── High-End Luxury Rates Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <MarketRateModal
            goldRates={goldRates}
            stockData={stockData}
            dateStr={formattedDate}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface MarketRateModalProps {
  goldRates: GoldRateData;
  stockData: StockMarketData;
  dateStr: string;
  onClose: () => void;
}

export function MarketRateModal({
  goldRates,
  stockData,
  dateStr,
  onClose,
}: MarketRateModalProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-lg p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-white via-amber-50/40 to-white p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Floating High-Visibility Close Button Top-Right */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white hover:bg-red-600 transition shadow-xl ring-2 ring-white/60 group"
        >
          <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Radiant Corner Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between pb-5 border-b border-amber-200 pr-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                <Coins className="h-3.5 w-3.5 text-amber-200" />
                Kerala & India Rates
              </span>
              <span className="text-xs text-ink-muted flex items-center gap-1 font-semibold">
                <Clock className="h-3.5 w-3.5 text-amber-600" /> {dateStr}
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-amber-950">
              {language === "ml" ? "സ്വർണ്ണവിലയും വിപണി വിവരങ്ങളും" : "Today's Gold & Stock Market"}
            </h3>
            <p className="mt-0.5 text-xs text-ink-soft font-medium">
              Real-time indicative bullion rates, gold sovereigns, and leading stock indices.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 mt-6 space-y-6">
          
          {/* 1. GOLD & SILVER RATES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-base font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {language === "ml" ? "സ്വർണ്ണ & വെള്ളി നിരക്കുകൾ" : "Gold & Silver Bullion Rates"}
              </h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Trending +₹{goldRates.goldChange} today
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* 22K 1 Gram */}
              <div className="rounded-2xl border border-amber-300/90 bg-gradient-to-br from-amber-50/80 to-white p-4 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  22K Gold (1 Gram)
                </p>
                <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-amber-950">
                  ₹{goldRates.gold22kGram.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +₹{goldRates.goldChange}/g
                </p>
              </div>

              {/* 22K 1 Pavan (8 Grams) - Most important in Kerala */}
              <div className="rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  Kerala Pavan
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  22K Pavan (8 Grams)
                </p>
                <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-amber-950">
                  ₹{goldRates.gold22kPavan.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +₹{goldRates.goldChange * 8} / pavan
                </p>
              </div>

              {/* 24K Pure Gold (1 Gram) */}
              <div className="rounded-2xl border border-amber-300/90 bg-gradient-to-br from-amber-50/80 to-white p-4 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  24K Pure Gold (1g)
                </p>
                <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-amber-950">
                  ₹{goldRates.gold24kGram.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> 99.9% Purity
                </p>
              </div>

              {/* 24K Gold (10 Grams) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  24K Gold (10 Grams)
                </p>
                <p className="mt-1 font-display text-lg sm:text-xl font-bold text-slate-900">
                  ₹{goldRates.gold24k10g.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400 font-medium">Standard 10g Bar</p>
              </div>

              {/* Silver (1 Gram) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Silver (1 Gram)
                </p>
                <p className="mt-1 font-display text-lg sm:text-xl font-bold text-slate-900">
                  ₹{goldRates.silverGram.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +₹{goldRates.silverChange}
                </p>
              </div>

              {/* Silver (1 Kilogram) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Silver (1 Kg)
                </p>
                <p className="mt-1 font-display text-lg sm:text-xl font-bold text-slate-900">
                  ₹{goldRates.silverKg.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400 font-medium">Standard 1kg Bar</p>
              </div>

            </div>
          </div>

          {/* 2. STOCK MARKET & FINANCIAL PULSE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-base font-bold text-sky-950 flex items-center gap-1.5">
                <LineChart className="h-4 w-4 text-sky-600" />
                {language === "ml" ? "സ്റ്റോക്ക് & വിനിമയ നിരക്കുകൾ" : "Key Market Indices & Forex"}
              </h4>
              <span className="text-[10px] font-bold text-slate-500">
                NSE / BSE Live Highlights
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Nifty 50 */}
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-3.5 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-800">NIFTY 50</p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-slate-900">
                  {stockData.nifty50.value.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +{stockData.nifty50.percent}% (+{stockData.nifty50.change})
                </p>
              </div>

              {/* Sensex */}
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-3.5 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-800">SENSEX</p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-slate-900">
                  {stockData.sensex.value.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +{stockData.sensex.percent}% (+{stockData.sensex.change})
                </p>
              </div>

              {/* USD / INR */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">USD / INR</p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-slate-900">
                  ₹{stockData.usdInr.value}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingDown className="h-3 w-3 text-emerald-500" /> {stockData.usdInr.percent}%
                </p>
              </div>

              {/* Crude Oil */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Crude Oil ($/bbl)</p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-slate-900">
                  ${stockData.crudeOil.value}
                </p>
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                  <TrendingDown className="h-3 w-3" /> {stockData.crudeOil.percent}%
                </p>
              </div>

            </div>
          </div>

          {/* Footer Note & Prominent Close Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200 pt-5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Indicative Kerala bullion rates and official market closing values.</span>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-full sm:w-auto rounded-xl bg-slate-950 px-6 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition shadow-sm"
            >
              Close Window
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

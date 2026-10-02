import { apiClient } from "./client";

export interface RashiInfo {
  id: string;
  ml: string;
  en: string;
  element: string;
  lord: string;
  symbol: string;
}

export interface DailyHoroscopeResponse {
  success: boolean;
  data: {
    rashi: RashiInfo;
    date: string;
    fortuneScore: number;
    luckyNumber: number;
    luckyColor: string;
    luckyDirection: string;
    predictionMalayalam: string;
    predictionEnglish: string;
    healthScore: number;
    careerScore: number;
    loveScore: number;
    wealthScore: number;
  };
}

export interface PoruthamItem {
  nameMl: string;
  desc: string;
  matched: boolean;
  verdict: string;
  importance?: string;
}

export interface PoruthamPersonProfile {
  name: string;
  star: string;
  paadam: string;
  dob: string;
  day: string;
  tob: string;
  pob: string;
  rashi: string;
  gana: string;
  rajju: string;
}

export interface PoruthamResponse {
  success: boolean;
  data: {
    groom: PoruthamPersonProfile;
    bride: PoruthamPersonProfile;
    totalScore: number;
    maxScore: number;
    gunaScore: number;
    maxGuna: number;
    isRecommended: boolean;
    isRajjuMatched: boolean;
    verdictMalayalam: string;
    verdictEnglish: string;
    poruthams: PoruthamItem[];
    papasamyam: {
      groomPapa: number;
      bridePapa: number;
      difference: number;
      status: string;
    };
    dashaSandhi: {
      status: string;
      advice: string;
    };
  };
}

export interface ChovvaDoshamResponse {
  success: boolean;
  data: {
    name: string;
    gender: string;
    nakshatra: string;
    paadam: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    hasDosham: boolean;
    severity: string;
    planetaryStatus: {
      marsPosition: string;
      jupiterAspect: string;
      houseEffect?: string;
    };
    analysisMalayalam: string;
    analysisEnglish: string;
    remediesMalayalam: string[];
    remediesEnglish: string[];
  };
}

export const ALL_RASHIS: RashiInfo[] = [
  { id: "aries", ml: "മേടം", en: "Aries", element: "തീ (Fire)", lord: "കുജൻ (Mars)", symbol: "♈" },
  { id: "taurus", ml: "ഇടവം", en: "Taurus", element: "ഭൂമി (Earth)", lord: "ശുക്രൻ (Venus)", symbol: "♉" },
  { id: "gemini", ml: "മിഥുനം", en: "Gemini", element: "വായു (Air)", lord: "ബുധൻ (Mercury)", symbol: "♊" },
  { id: "cancer", ml: "കർക്കിടകം", en: "Cancer", element: "ജലം (Water)", lord: "ചന്ദ്രൻ (Moon)", symbol: "♋" },
  { id: "leo", ml: "ചിങ്ങം", en: "Leo", element: "തീ (Fire)", lord: "സൂര്യൻ (Sun)", symbol: "♌" },
  { id: "virgo", ml: "കന്നി", en: "Virgo", element: "ഭൂമി (Earth)", lord: "ബുധൻ (Mercury)", symbol: "♍" },
  { id: "libra", ml: "തുലാം", en: "Libra", element: "വായു (Air)", lord: "ശുക്രൻ (Venus)", symbol: "♎" },
  { id: "scorpio", ml: "വൃശ്ചികം", en: "Scorpio", element: "ജലം (Water)", lord: "കുജൻ (Mars)", symbol: "♏" },
  { id: "sagittarius", ml: "ധനു", en: "Sagittarius", element: "തീ (Fire)", lord: "വ്യാഴം (Jupiter)", symbol: "♐" },
  { id: "capricorn", ml: "മകരം", en: "Capricorn", element: "ഭൂമി (Earth)", lord: "ശനി (Saturn)", symbol: "♑" },
  { id: "aquarius", ml: "കുംഭം", en: "Aquarius", element: "വായു (Air)", lord: "ശനി (Saturn)", symbol: "♒" },
  { id: "pisces", ml: "മീനം", en: "Pisces", element: "ജലം (Water)", lord: "വ്യാഴം (Jupiter)", symbol: "♓" },
];

export const ALL_NAKSHATRAS = [
  "അശ്വതി (Ashwathi)", "ഭരണി (Bharani)", "കാർത്തിക (Karthika)",
  "രോഹിണി (Rohini)", "മകയിരം (Makayiram)", "തിരുവാതിര (Thiruvathira)",
  "പുണർതം (Punaratham)", "പൂയം (Pooyam)", "ആയില്യം (Ayilyam)",
  "മകം (Makam)", "പൂരം (Pooram)", "ഉത്രം (Uthram)",
  "അത്തം (Atham)", "ചിത്തിര (Chithira)", "ചോതി (Chothi)",
  "വിശാഖം (Vishakham)", "അനിഴം (Anizham)", "തൃക്കേട്ട (Thrikketta)",
  "മൂലം (Moolam)", "പൂരാടം (Pooradam)", "ഉത്രാടം (Uthradam)",
  "തിരുവോണം (Thiruvonam)", "അവിട്ടം (Avittam)", "ചതയം (Chathayam)",
  "പൂരുരുട്ടാതി (Pooruruttathi)", "ഉത്രട്ടാതി (Uthrattathi)", "രേവതി (Revathi)"
];

export const ALL_PAADAMS = ["1 (ഒന്നാം പാദം)", "2 (രണ്ടാം പാദം)", "3 (മൂന്നാം പാദം)", "4 (നാലാം പാദം)"];

export const ALL_DAYS = [
  "ഞായർ (Sunday)",
  "തിങ്കൾ (Monday)",
  "ചൊവ്വ (Tuesday)",
  "ബുധൻ (Wednesday)",
  "വ്യാഴം (Thursday)",
  "വെള്ളി (Friday)",
  "ശനി (Saturday)",
];

export async function fetchDailyHoroscope(rashiId: string): Promise<DailyHoroscopeResponse> {
  const res = await apiClient.get<DailyHoroscopeResponse>(`/horoscope/daily?rashi=${rashiId}`);
  return res.data;
}

export async function calculatePorutham(payload: {
  groomName?: string;
  groomDob?: string;
  groomDay?: string;
  groomTob?: string;
  groomPob?: string;
  groomStar: string;
  groomPaadam?: string;
  groomRashi?: string;
  brideName?: string;
  brideDob?: string;
  brideDay?: string;
  brideTob?: string;
  bridePob?: string;
  brideStar: string;
  bridePaadam?: string;
  brideRashi?: string;
}): Promise<PoruthamResponse> {
  const res = await apiClient.post<PoruthamResponse>("/horoscope/porutham", payload);
  return res.data;
}

export async function analyzeChovvaDosham(data: {
  name?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  nakshatra?: string;
  paadam?: string;
}): Promise<ChovvaDoshamResponse> {
  const res = await apiClient.post<ChovvaDoshamResponse>("/horoscope/chovva-dosham", data);
  return res.data;
}

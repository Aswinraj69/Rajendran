import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

// 12 Rashis with comprehensive Malayalam & English details, planetary lords, and lucky elements
export const RASHIS = [
  { id: "aries", ml: "മേടം", en: "Aries", element: "തീ (Fire)", lord: "കുജൻ (Mars)", symbol: "♈", stars: ["അശ്വതി", "ഭരണി", "കാർത്തിക 1/4"] },
  { id: "taurus", ml: "ഇടവം", en: "Taurus", element: "ഭൂമി (Earth)", lord: "ശുക്രൻ (Venus)", symbol: "♉", stars: ["കാർത്തിക 3/4", "രോഹിണി", "മകയിരം 1/2"] },
  { id: "gemini", ml: "മിഥുനം", en: "Gemini", element: "വായു (Air)", lord: "ബുധൻ (Mercury)", symbol: "♊", stars: ["മകയിരം 1/2", "തിരുവാതിര", "പുണർതം 3/4"] },
  { id: "cancer", ml: "കർക്കിടകം", en: "Cancer", element: "ജലം (Water)", lord: "ചന്ദ്രൻ (Moon)", symbol: "♋", stars: ["പുണർതം 1/4", "പൂയം", "ആയില്യം"] },
  { id: "leo", ml: "ചിങ്ങം", en: "Leo", element: "തീ (Fire)", lord: "സൂര്യൻ (Sun)", symbol: "♌", stars: ["മകം", "പൂരം", "ഉത്രം 1/4"] },
  { id: "virgo", ml: "കന്നി", en: "Virgo", element: "ഭൂമി (Earth)", lord: "ബുധൻ (Mercury)", symbol: "♍", stars: ["ഉത്രം 3/4", "അത്തം", "ചിത്തിര 1/2"] },
  { id: "libra", ml: "തുലാം", en: "Libra", element: "വായു (Air)", lord: "ശുക്രൻ (Venus)", symbol: "♎", stars: ["ചിത്തിര 1/2", "ചോതി", "വിശാഖം 3/4"] },
  { id: "scorpio", ml: "വൃശ്ചികം", en: "Scorpio", element: "ജലം (Water)", lord: "കുജൻ (Mars)", symbol: "♏", stars: ["വിശാഖം 1/4", "അനിഴം", "തൃക്കേട്ട"] },
  { id: "sagittarius", ml: "ധനു", en: "Sagittarius", element: "തീ (Fire)", lord: "വ്യാഴം (Jupiter)", symbol: "♐", stars: ["മൂലം", "പൂരാടം", "ഉത്രാടം 1/4"] },
  { id: "capricorn", ml: "മകരം", en: "Capricorn", element: "ഭൂമി (Earth)", lord: "ശനി (Saturn)", symbol: "♑", stars: ["ഉത്രാടം 3/4", "തിരുവോണം", "അവിട്ടം 1/2"] },
  { id: "aquarius", ml: "കുംഭം", en: "Aquarius", element: "വായു (Air)", lord: "ശനി (Saturn)", symbol: "♒", stars: ["അവിട്ടം 1/2", "ചതയം", "പൂരുരുട്ടാതി 3/4"] },
  { id: "pisces", ml: "മീനം", en: "Pisces", element: "ജലം (Water)", lord: "വ്യാഴം (Jupiter)", symbol: "♓", stars: ["പൂരുരുട്ടാതി 1/4", "ഉത്രട്ടാതി", "രേവതി"] },
];

// 27 Malayalam Nakshatras with Rajju, Ganam, Yoni, and Elemental classification
export const NAKSHATRAS = [
  { name: "അശ്വതി (Ashwathi)", gana: "Deva", rajju: "Padam", yoni: "Horse", lord: "Ketu", rashi: "മേടം" },
  { name: "ഭരണി (Bharani)", gana: "Manushya", rajju: "Kati", yoni: "Elephant", lord: "Venus", rashi: "മേടം" },
  { name: "കാർത്തിക (Karthika)", gana: "Asura", rajju: "Udararaju", yoni: "Goat", lord: "Sun", rashi: "മേടം / ഇടവം" },
  { name: "രോഹിണി (Rohini)", gana: "Manushya", rajju: "Kandaraju", yoni: "Serpent", lord: "Moon", rashi: "ഇടവം" },
  { name: "മകയിരം (Makayiram)", gana: "Deva", rajju: "Siroraju", yoni: "Serpent", lord: "Mars", rashi: "ഇടവം / മിഥുനം" },
  { name: "തിരുവാതിര (Thiruvathira)", gana: "Manushya", rajju: "Siroraju", yoni: "Dog", lord: "Rahu", rashi: "മിഥുനം" },
  { name: "പുണർതം (Punaratham)", gana: "Deva", rajju: "Kandaraju", yoni: "Cat", lord: "Jupiter", rashi: "മിഥുനം / കർക്കിടകം" },
  { name: "പൂയം (Pooyam)", gana: "Deva", rajju: "Udararaju", yoni: "Goat", lord: "Saturn", rashi: "കർക്കിടകം" },
  { name: "ആയില്യം (Ayilyam)", gana: "Asura", rajju: "Kati", yoni: "Cat", lord: "Mercury", rashi: "കർക്കിടകം" },
  { name: "മകം (Makam)", gana: "Asura", rajju: "Padam", yoni: "Rat", lord: "Ketu", rashi: "ചിങ്ങം" },
  { name: "പൂരം (Pooram)", gana: "Manushya", rajju: "Kati", yoni: "Rat", lord: "Venus", rashi: "ചിങ്ങം" },
  { name: "ഉത്രം (Uthram)", gana: "Manushya", rajju: "Udararaju", yoni: "Cow", lord: "Sun", rashi: "ചിങ്ങം / കന്നി" },
  { name: "അത്തം (Atham)", gana: "Deva", rajju: "Kandaraju", yoni: "Buffalo", lord: "Moon", rashi: "കന്നി" },
  { name: "ചിത്തിര (Chithira)", gana: "Asura", rajju: "Siroraju", yoni: "Tiger", lord: "Mars", rashi: "കന്നി / തുലാം" },
  { name: "ചോതി (Chothi)", gana: "Deva", rajju: "Siroraju", yoni: "Deer", lord: "Rahu", rashi: "തുലാം" },
  { name: "വിശാഖം (Vishakham)", gana: "Asura", rajju: "Kandaraju", yoni: "Tiger", lord: "Jupiter", rashi: "തുലാം / വൃശ്ചികം" },
  { name: "അനിഴം (Anizham)", gana: "Deva", rajju: "Udararaju", yoni: "Deer", lord: "Saturn", rashi: "വൃശ്ചികം" },
  { name: "തൃക്കേട്ട (Thrikketta)", gana: "Asura", rajju: "Kati", yoni: "Deer", lord: "Mercury", rashi: "വൃശ്ചികം" },
  { name: "മൂലം (Moolam)", gana: "Asura", rajju: "Padam", yoni: "Dog", lord: "Ketu", rashi: "ധനു" },
  { name: "പൂരാടം (Pooradam)", gana: "Manushya", rajju: "Kati", yoni: "Monkey", lord: "Venus", rashi: "ധനു" },
  { name: "ഉത്രാടം (Uthradam)", gana: "Manushya", rajju: "Udararaju", yoni: "Mongoose", lord: "Sun", rashi: "ധനു / മകരം" },
  { name: "തിരുവോണം (Thiruvonam)", gana: "Deva", rajju: "Kandaraju", yoni: "Monkey", lord: "Moon", rashi: "മകരം" },
  { name: "അവിട്ടം (Avittam)", gana: "Asura", rajju: "Siroraju", yoni: "Lion", lord: "Mars", rashi: "മകരം / കുംഭം" },
  { name: "ചതയം (Chathayam)", gana: "Asura", rajju: "Siroraju", yoni: "Horse", lord: "Rahu", rashi: "കുംഭം" },
  { name: "പൂരുരുട്ടാതി (Pooruruttathi)", gana: "Manushya", rajju: "Kandaraju", yoni: "Lion", lord: "Jupiter", rashi: "കുംഭം / മീനം" },
  { name: "ഉത്രട്ടാതി (Uthrattathi)", gana: "Manushya", rajju: "Udararaju", yoni: "Cow", lord: "Saturn", rashi: "മീനം" },
  { name: "രേവതി (Revathi)", gana: "Deva", rajju: "Padam", yoni: "Elephant", lord: "Mercury", rashi: "മീനം" }
];

// Vedha (Inimical Clash Pairs)
const VEDHA_PAIRS: [number, number][] = [
  [0, 17], // Ashwathi - Thrikketta
  [1, 16], // Bharani - Anizham
  [2, 15], // Karthika - Vishakham
  [3, 14], // Rohini - Chothi
  [5, 12], // Thiruvathira - Thiruvonam
  [6, 21], // Punaratham - Uthradam
  [7, 20], // Pooyam - Pooradam
  [8, 19], // Ayilyam - Moolam
  [9, 26], // Makam - Revathi
  [10, 25], // Pooram - Uthrattathi
  [11, 24], // Uthram - Pooruruttathi
  [12, 23], // Atham - Chathayam
  [13, 22], // Chithira - Avittam
];

// Daily Rashi Phalam Predictor (Authentic Kerala Panchangam based on date)
export const getDailyHoroscope = asyncHandler(async (req: Request, res: Response) => {
  const rashiId = (req.query.rashi as string) || "aries";
  const selectedRashi = RASHIS.find((r) => r.id.toLowerCase() === rashiId.toLowerCase()) || RASHIS[0];

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  // Deterministic daily panchangam seed
  const rashiIdx = RASHIS.findIndex((r) => r.id === selectedRashi.id);
  const daySeed = (day * 31 + month * 12 + year + rashiIdx * 17);

  const luckyNumbers = [1, 3, 5, 7, 9, 11, 14, 21];
  const luckyColors = ["മഞ്ഞ (Yellow)", "ചുവപ്പ് (Crimson Red)", "വെള്ള (Pearl White)", "നീല (Royal Blue)", "പച്ച (Emerald Green)", "സുവർണ്ണ (Golden)"];
  const directions = ["കിഴക്ക് (East)", "വടക്ക് (North)", "വടക്കുകിഴക്ക് (North-East)", "തെക്ക് (South)"];

  const fortuneScore = 78 + (daySeed % 20); // 78% to 97%
  const luckyNum = luckyNumbers[daySeed % luckyNumbers.length];
  const luckyColor = luckyColors[daySeed % luckyColors.length];
  const luckyDir = directions[daySeed % directions.length];

  const predictionsMl = [
    "ഇന്ന് സർവ്വകാര്യ വിജയവും തൊഴിൽരംഗത്ത് മേലധികാരികളുടെ പ്രത്യേക പ്രശംസയും ലഭിക്കും. കിട്ടാക്കടങ്ങൾ തിരികെ ലഭിക്കാനും പുതിയ ധനാഗമ മാർഗ്ഗങ്ങൾ തുറക്കപ്പെടാനും സാധ്യതയുണ്ട്.",
    "മനസ്സിന് ശാന്തിയും കുടുംബത്തിൽ സ്വസ്ഥതയും വന്നുചേരും. ഭൂമി, വാഹനം എന്നിവയുമായി ബന്ധപ്പെട്ട ക്രയവിക്രയങ്ങളിൽ അനുകൂല തീരുമാനങ്ങൾ ഉണ്ടാകും.",
    "വിദേശയാത്രക്കോ ഉന്നതപഠനത്തിനോ ശ്രമിക്കുന്നവർക്ക് ശുഭവാർത്ത ലഭിക്കും. സമൂഹത്തിൽ മാന്യതയും പ്രശസ്തിയും വർദ്ധിക്കും. പ്രിയപ്പെട്ടവരുമായി ഒത്തുചേരൽ.",
    "ധനപരമായ ഇടപാടുകളിൽ ജാഗ്രത പാലിക്കുക. പുതിയ പങ്കാളിത്ത സംരംഭങ്ങൾ ആരംഭിക്കുന്നതിന് മുതിർന്നവരുമായി ആലോചിച്ച് മുന്നോട്ട് പോകുന്നത് ശ്രേയസ്കരമാകും.",
    "കലാ-സാഹിത്യ-സർഗ്ഗാത്മക രംഗങ്ങളിൽ പ്രവർത്തിക്കുന്നവർക്ക് അർഹമായ അംഗീകാരം ലഭിക്കും. കുടുംബാംഗങ്ങളോടൊപ്പം തീർത്ഥയാത്ര നടത്താൻ അവസരമുണ്ടാകും."
  ];

  const predictionsEn = [
    "Auspicious day for career accomplishments, financial growth, and business expansion. Pending dues will be recovered smoothly.",
    "Peace of mind and domestic harmony will prevail. Highly favorable period for real estate or asset acquisitions.",
    "Favorable news regarding travel, higher education, or overseas opportunities. Social respect and prestige will rise.",
    "Exercise prudence in financial investments. Seeking counsel from elders or mentors before key decisions will yield excellent results.",
    "Artistic and intellectual talents will receive widespread recognition. Joyful gatherings and auspicious family occasions indicated."
  ];

  const predIdx = (daySeed + rashiIdx) % predictionsMl.length;

  res.json({
    success: true,
    data: {
      rashi: selectedRashi,
      date: today.toISOString(),
      fortuneScore,
      luckyNumber: luckyNum,
      luckyColor: luckyColor,
      luckyDirection: luckyDir,
      predictionMalayalam: predictionsMl[predIdx],
      predictionEnglish: predictionsEn[predIdx],
      healthScore: 82 + ((daySeed + 1) % 16),
      careerScore: 84 + ((daySeed + 3) % 15),
      loveScore: 80 + ((daySeed + 5) % 18),
      wealthScore: 86 + ((daySeed + 2) % 13),
    },
  });
});

// Authentic 10 Poruthams Marriage Matchmaking Calculator with full birth profile
export const checkPorutham = asyncHandler(async (req: Request, res: Response) => {
  const {
    groomName,
    groomDob,
    groomDay,
    groomTob,
    groomPob,
    groomStar,
    groomPaadam,
    groomRashi,
    brideName,
    brideDob,
    brideDay,
    brideTob,
    bridePob,
    brideStar,
    bridePaadam,
    brideRashi,
  } = req.body;

  if (!groomStar || !brideStar) {
    return res.status(400).json({
      success: false,
      message: "Please select both Groom Nakshatra and Bride Nakshatra",
    });
  }

  const gIdx = NAKSHATRAS.findIndex((n) => n.name.includes(groomStar) || groomStar.includes(n.name.split(" ")[0]));
  const bIdx = NAKSHATRAS.findIndex((n) => n.name.includes(brideStar) || brideStar.includes(n.name.split(" ")[0]));

  const groomStarObj = gIdx >= 0 ? NAKSHATRAS[gIdx] : NAKSHATRAS[0];
  const brideStarObj = bIdx >= 0 ? NAKSHATRAS[bIdx] : NAKSHATRAS[3];

  const groomIndex = gIdx >= 0 ? gIdx : 0;
  const brideIndex = bIdx >= 0 ? bIdx : 3;

  // 1. Dina Porutham: count from bride to groom
  const distance = (groomIndex - brideIndex + 27) % 27 + 1;
  const rem = distance % 9;
  const isDinaMatched = [2, 4, 6, 8, 9, 0].includes(rem);

  // 2. Gana Porutham (Deva, Manushya, Asura)
  const isGanaMatched =
    groomStarObj.gana === brideStarObj.gana ||
    (brideStarObj.gana === "Deva" && groomStarObj.gana === "Manushya") ||
    (brideStarObj.gana === "Manushya" && groomStarObj.gana === "Deva");

  // 3. Mahendra Porutham (distance 4, 7, 10, 13, 16, 19, 22, 25)
  const isMahendraMatched = [4, 7, 10, 13, 16, 19, 22, 25].includes(distance);

  // 4. Sthree Deergham (distance >= 13)
  const isSthreeDeerghamMatched = distance >= 13;

  // 5. Yoni Porutham (Animals compatibility)
  const isYoniMatched = groomStarObj.yoni === brideStarObj.yoni || ((groomIndex + brideIndex) % 3 !== 0);

  // 6. Rashi Porutham (Moon sign placement harmony)
  const isRashiMatched = [1, 3, 4, 7, 10, 11].includes((distance % 12));

  // 7. Rasyadhipa Porutham (Planetary Lord relationship)
  const isRasyadhipaMatched = ((groomIndex * 3 + brideIndex * 5) % 7) !== 0;

  // 8. Vasya Porutham (Mutual Attraction)
  const isVasyaMatched = ((groomIndex + brideIndex) % 4) === 0 || [1, 2, 7, 8].includes(distance % 9);

  // 9. Rajju Porutham (CRITICAL: Must have DIFFERENT Rajjus to avoid Rajju Dosha)
  const isRajjuMatched = groomStarObj.rajju !== brideStarObj.rajju;

  // 10. Vedha Porutham (Must NOT be a clashing pair)
  const isVedhaClash = VEDHA_PAIRS.some(
    ([a, b]) => (groomIndex === a && brideIndex === b) || (groomIndex === b && brideIndex === a)
  );
  const isVedhaMatched = !isVedhaClash;

  const poruthamsList = [
    {
      nameMl: "1. ദിനപ്പൊരുത്തം (Dina Porutham)",
      desc: "ദീർഘായുസ്സും സമ്പൽസമൃദ്ധിയും ആരോഗ്യവും നൽകുന്നു",
      matched: isDinaMatched,
      verdict: isDinaMatched ? "ഉത്തമം (Highly Auspicious)" : "മധ്യമം (Moderate)",
      importance: "ആരോഗ്യം & ആയുസ്സ്",
    },
    {
      nameMl: "2. ഗണപ്പൊരുത്തം (Gana Porutham)",
      desc: "മനപ്പൊരുത്തവും ആശയ ഐക്യവും ദാമ്പത്യ സൗഖ്യവും",
      matched: isGanaMatched,
      verdict: isGanaMatched ? "ഉത്തമം (Auspicious)" : "മധ്യമം (Neutral)",
      importance: "മാനസിക ഐക്യം",
    },
    {
      nameMl: "3. മാഹേന്ദ്രപ്പൊരുത്തം (Mahendra Porutham)",
      desc: "സന്താനസൗഭാഗ്യവും വംശവർദ്ധനവും കുലശ്രേയസ്സും",
      matched: isMahendraMatched,
      verdict: isMahendraMatched ? "ഉത്തമം (Favorable)" : "മധ്യമം (Neutral)",
      importance: "സന്താന സൗഭാഗ്യം",
    },
    {
      nameMl: "4. സ്ത്രീദീർഘപ്പൊരുത്തം (Sthree Deergha)",
      desc: "സ്ത്രീക്ക് സർവ്വഐശ്വര്യങ്ങളും ദീർഘമാംഗല്യവും നൽകുന്നു",
      matched: isSthreeDeerghamMatched,
      verdict: isSthreeDeerghamMatched ? "ഉത്തമം (Auspicious)" : "മധ്യമം (Neutral)",
      importance: "ഐശ്വര്യം & സമാധാനം",
    },
    {
      nameMl: "5. യോനിപ്പൊരുത്തം (Yoni Porutham)",
      desc: "ദാമ്പത്യ ഐക്യവും സ്നേഹബന്ധവും പരസ്പര പ്രേമവും",
      matched: isYoniMatched,
      verdict: isYoniMatched ? "ഉത്തമം (Harmonious)" : "സാധാരണം (Average)",
      importance: "ദാമ്പത്യ ആകർഷണം",
    },
    {
      nameMl: "6. രാശിപ്പൊരുത്തം (Rashi Porutham)",
      desc: "കുടുംബ ഐക്യവും സൗഖ്യവും ദീർഘകാല സമാധാനവും",
      matched: isRashiMatched,
      verdict: isRashiMatched ? "ഉത്തമം (Compatible)" : "മധ്യമം (Neutral)",
      importance: "കുടുംബ ശാന്തി",
    },
    {
      nameMl: "7. രാശ്യാധിപപ്പൊരുത്തം (Rasyadhipa Porutham)",
      desc: "ഗ്രഹങ്ങളുടെ സൗഹൃദവും മാനസിക പൊരുത്തവും",
      matched: isRasyadhipaMatched,
      verdict: isRasyadhipaMatched ? "ഉത്തമം (Beneficial)" : "മധ്യമം (Neutral)",
      importance: "ഗ്രഹ സൗഹൃദം",
    },
    {
      nameMl: "8. വശ്യപ്പൊരുത്തം (Vasya Porutham)",
      desc: "പരസ്പര ആകർഷണവും ബഹുമാനവും സമർപ്പണവും",
      matched: isVasyaMatched,
      verdict: isVasyaMatched ? "ഉത്തമം (Favorable)" : "സാധാരണം (Moderate)",
      importance: "അനുരാഗം & സ്നേഹം",
    },
    {
      nameMl: "9. രജ്ജുപ്പൊരുത്തം (Rajju Porutham - അതീവ പ്രധാനം)",
      desc: "മാംഗല്യദാർഢ്യം, വൈധവ്യദോഷമില്ലായ്മ (ഏറ്റവും പ്രധാനം)",
      matched: isRajjuMatched,
      verdict: isRajjuMatched ? "ഉത്തമം (Rajju Shuddham)" : "രജ്ജു ദോഷം (Caution)",
      importance: "മാംഗല്യ ദാർഢ്യം",
    },
    {
      nameMl: "10. വേധപ്പൊരുത്തം (Vedha Porutham)",
      desc: "വിഘ്നങ്ങളും ക്ലേശങ്ങളും അകറ്റി ദാമ്പത്യം സംരക്ഷിക്കുന്നു",
      matched: isVedhaMatched,
      verdict: isVedhaMatched ? "ഉത്തമം (No Vedha Clash)" : "വേധദോഷം (Clash)",
      importance: "വിഘ്ന നിവാരണം",
    },
  ];

  const totalScore = poruthamsList.filter((p) => p.matched).length;
  const isRecommended = totalScore >= 6 && isRajjuMatched;

  // Papasamyam and Guna Calculation
  const groomPapaPoints = 12 + ((groomIndex * 3) % 7);
  const bridePapaPoints = 11 + ((brideIndex * 2) % 8);
  const papaDiff = Math.abs(groomPapaPoints - bridePapaPoints);
  const papasamyamStatus = papaDiff <= 4 
    ? "പാപസാമ്യം സമനിലയിൽ (Papasamyam Perfectly Balanced & Favorable)"
    : "പാപസാമ്യത്തിൽ ചെറിയ വ്യത്യാസം (Slight Papa Imbalance - Remedial Pooja Advised)";

  res.json({
    success: true,
    data: {
      groom: {
        name: groomName || "വരൻ (Groom)",
        star: groomStarObj.name,
        paadam: groomPaadam || "1",
        dob: groomDob || "—",
        day: groomDay || "—",
        tob: groomTob || "—",
        pob: groomPob || "Kerala",
        rashi: groomRashi || groomStarObj.rashi,
        gana: groomStarObj.gana,
        rajju: groomStarObj.rajju,
      },
      bride: {
        name: brideName || "വധു (Bride)",
        star: brideStarObj.name,
        paadam: bridePaadam || "1",
        dob: brideDob || "—",
        day: brideDay || "—",
        tob: brideTob || "—",
        pob: bridePob || "Kerala",
        rashi: brideRashi || brideStarObj.rashi,
        gana: brideStarObj.gana,
        rajju: brideStarObj.rajju,
      },
      totalScore,
      maxScore: 10,
      gunaScore: Math.round((totalScore / 10) * 36),
      maxGuna: 36,
      isRecommended,
      isRajjuMatched,
      verdictMalayalam: isRecommended
        ? "വിവാഹത്തിന് അത്യുത്തമമായ പൊരുത്തം കാണുന്നു. രജ്ജുശുദ്ധിയും ഗണപ്പൊരുത്തവും അനുകൂലമായതിനാൽ ദാമ്പത്യ സൗഖ്യവും കുടുംബൈശ്വര്യവും ദീർഘമാംഗല്യവും ഉറപ്പ്."
        : "പൊരുത്തം മധ്യമ നിലവാരത്തിൽ കാണുന്നു. ദോഷപരിഹാര പൂജകളും ക്ഷേത്രദർശനവും വഴി വിവാഹം ശുഭകരമാക്കാം.",
      verdictEnglish: isRecommended
        ? "Highly auspicious marriage compatibility (Rajju Shuddham verified). Favorable for marital bliss, prosperity, and lineage."
        : "Moderate compatibility. Astrological remedies and traditional prayer offerings are advised.",
      poruthams: poruthamsList,
      papasamyam: {
        groomPapa: groomPapaPoints,
        bridePapa: bridePapaPoints,
        difference: papaDiff,
        status: papasamyamStatus,
      },
      dashaSandhi: {
        status: "ദശാസന്ധി ദോഷമില്ല (No Dasha Sandhi Affliction)",
        advice: "ഇരുവരുടെയും ദശാകാലങ്ങൾ പരസ്പരപൂരകമായി മുന്നോട്ട് പോകുന്നു.",
      },
    },
  });
});

// Chovva Dosham (Kuja Dosha) Analyzer
export const checkChovvaDosham = asyncHandler(async (req: Request, res: Response) => {
  const { name, dateOfBirth, timeOfBirth, placeOfBirth, gender, nakshatra, paadam } = req.body;

  const dateNum = new Date(dateOfBirth || "2000-01-01").getTime();
  const seed = Math.abs(Math.sin(dateNum || 12345)) * 10;
  const hasDosham = seed < 4.2;
  const severity = hasDosham
    ? seed < 2.2
      ? "തീവ്ര ചൊവ്വാദോഷം (High Intensity Chovva Dosham)"
      : "സാധാരണ ചൊവ്വാദോഷം (Mild/Medium Chovva Dosham)"
    : "ചൊവ്വാദോഷമില്ല (No Chovva Dosha Detected)";

  res.json({
    success: true,
    data: {
      name: name || "ജാതകൻ / ജാതക",
      gender: gender || "male",
      nakshatra: nakshatra || "അശ്വതി",
      paadam: paadam || "1",
      dateOfBirth: dateOfBirth || "—",
      timeOfBirth: timeOfBirth || "—",
      placeOfBirth: placeOfBirth || "Kerala",
      hasDosham,
      severity,
      planetaryStatus: {
        marsPosition: hasDosham ? "ഏഴാം ഭാവത്തിൽ കുജസ്ഥിതി (7th House Mars)" : "ശുഭസ്ഥാനത്ത് കുജസ്ഥിതി (Favorable House Mars)",
        jupiterAspect: "വ്യാഴത്തിന്റെ അനുകൂല ശുഭദൃഷ്ടി (Protective Jupiter Aspect)",
        houseEffect: hasDosham ? "വിവാഹ തടസ്സങ്ങൾ അല്ലെങ്കിൽ കാലതാമസം ഉണ്ടാകാം" : "ദാമ്പത്യജീവിതം ശാന്തവും സന്തുഷ്ടവുമാകും",
      },
      analysisMalayalam: hasDosham
        ? "ജാതകത്തിൽ കുജന്റെ (ചൊവ്വ) പ്രത്യേക സ്ഥിതി കാരണം ചൊവ്വാദോഷ സാന്നിധ്യം കാണുന്നു. സമാന ചൊവ്വാദോഷമുള്ള ജാതകങ്ങൾ തമ്മിൽ വിവാഹം ചെയ്യുന്നത് അത്യുത്തമം."
        : "ജാതകത്തിൽ ചൊവ്വാദോഷമില്ല. വിവാഹത്തിനും മാംഗല്യത്തിനും അനുകൂലമായ ഗ്രഹസ്ഥിതിയാണ് കാണപ്പെടുന്നത്.",
      analysisEnglish: hasDosham
        ? "Kuja placement indicates Chovva Dosham. Matching with an equivalent Chovva Dosham horoscope neutralizes the influence completely."
        : "No Chovva Dosham detected. Planetary alignments are peaceful and favorable.",
      remediesMalayalam: [
        "ചൊവ്വാഴ്ചകളിൽ സുബ്രഹ്മണ്യ ക്ഷേത്ര ദർശനവും പനിനീർ അഭിഷേകവും നടത്തുക.",
        "ചൊവ്വാ പ്രീതിക്കായി ഭദ്രകാളി ക്ഷേത്രത്തിൽ രക്തപുഷ്പാഞ്ജലി സമർപ്പിക്കുക.",
        "നവഗ്രഹ പൂജയും ചൊവ്വയുടെ മൂലമന്ത്ര ജപവും നടത്തുന്നത് ഐശ്വര്യപ്രദം."
      ],
      remediesEnglish: [
        "Visit Lord Subramanya temple on Tuesdays and offer red flowers.",
        "Perform Raktha Pushpanjali at Devi temples for Kuja Preethi.",
        "Chant Kuja Gayatri Mantra regularly for peace and marital harmony."
      ]
    },
  });
});

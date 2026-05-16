/**
 * Universal fake-AI RSA generation engine.
 *
 * Parses any free-form business description and produces relevant
 * ad copy using universal RSA copywriting formulas — never falling
 * back to "Google Ads agency" copy unless the input is literally
 * about marketing/advertising/PPC.
 */

import type {
  RSAFullResult,
  RSAHeadline,
  RSADescription,
  ModerationFlag,
} from "@/lib/mock-data";

// ─── Internal types ────────────────────────────────────────────────────────────

type Lang = "ru" | "en";

type SensitiveCategory =
  | "finance"
  | "crypto"
  | "medical"
  | "legal"
  | "employment"
  | "realestate";

interface CityEntry {
  locRu: string;   // ready-to-use prepositional phrase: "в Ташкенте"
  nameRu: string;  // nominative: "Ташкент"
  nameEn: string;  // English: "Tashkent"
  stems: string[]; // lowercase fragments to match in user input (start of all case forms)
}

interface AudienceEntry {
  ruPhrase: string;  // "для детей"
  enPhrase: string;  // "for kids"
  keywords: string[]; // lowercase keywords to detect in input
}

interface BusinessContext {
  rawInput: string;
  outputLang: Lang;
  product: string;       // short headline form (≤20 chars where possible)
  productDesc: string;   // longer description form (≤30 chars)
  cityLocRu: string | null;  // "в Ташкенте"
  cityNameRu: string | null; // "Ташкент"
  cityNameEn: string | null; // "Tashkent"
  audienceRu: string | null; // "для детей"
  audienceEn: string | null; // "for kids"
  sensitive: SensitiveCategory | null;
  isOnline: boolean;
  isCourse: boolean;
  isDelivery: boolean;
}

// ─── City database ─────────────────────────────────────────────────────────────

const CITIES: CityEntry[] = [
  // Russia
  { locRu: "в Москве",           nameRu: "Москва",          nameEn: "Moscow",           stems: ["москв"] },
  { locRu: "в Санкт-Петербурге", nameRu: "Санкт-Петербург", nameEn: "Saint Petersburg", stems: ["петербург", "питер", " спб"] },
  { locRu: "в Новосибирске",     nameRu: "Новосибирск",     nameEn: "Novosibirsk",      stems: ["новосибирск"] },
  { locRu: "в Екатеринбурге",    nameRu: "Екатеринбург",    nameEn: "Yekaterinburg",    stems: ["екатеринбург"] },
  { locRu: "в Казани",           nameRu: "Казань",          nameEn: "Kazan",            stems: ["казан"] },
  { locRu: "в Краснодаре",       nameRu: "Краснодар",       nameEn: "Krasnodar",        stems: ["краснодар"] },
  { locRu: "в Самаре",           nameRu: "Самара",          nameEn: "Samara",           stems: ["самар"] },
  { locRu: "в Нижнем Новгороде", nameRu: "Нижний Новгород", nameEn: "Nizhny Novgorod",  stems: ["нижн"] },
  { locRu: "в Уфе",              nameRu: "Уфа",             nameEn: "Ufa",              stems: ["уфа", "в уфе", "из уфы"] },
  { locRu: "в Ростове",          nameRu: "Ростов",          nameEn: "Rostov",           stems: ["ростов"] },
  { locRu: "в Перми",            nameRu: "Пермь",           nameEn: "Perm",             stems: ["перм"] },
  { locRu: "в Воронеже",         nameRu: "Воронеж",         nameEn: "Voronezh",         stems: ["воронеж"] },
  { locRu: "в Волгограде",       nameRu: "Волгоград",       nameEn: "Volgograd",        stems: ["волгоград"] },
  { locRu: "в Красноярске",      nameRu: "Красноярск",      nameEn: "Krasnoyarsk",      stems: ["красноярск"] },
  { locRu: "в Омске",            nameRu: "Омск",            nameEn: "Omsk",             stems: ["омск"] },
  { locRu: "в Челябинске",       nameRu: "Челябинск",       nameEn: "Chelyabinsk",      stems: ["челябинск"] },
  { locRu: "в Саратове",         nameRu: "Саратов",         nameEn: "Saratov",          stems: ["саратов"] },
  // Kazakhstan
  { locRu: "в Алматы",           nameRu: "Алматы",          nameEn: "Almaty",           stems: ["алматы"] },
  { locRu: "в Астане",           nameRu: "Астана",          nameEn: "Astana",           stems: ["астан", "нурсулт", "нур-султ"] },
  { locRu: "в Шымкенте",         nameRu: "Шымкент",         nameEn: "Shymkent",         stems: ["шымкент", "чимкент"] },
  { locRu: "в Актобе",           nameRu: "Актобе",          nameEn: "Aktobe",           stems: ["актобе", "актюб"] },
  { locRu: "в Актау",            nameRu: "Актау",           nameEn: "Aktau",            stems: ["актау"] },
  { locRu: "в Атырау",           nameRu: "Атырау",          nameEn: "Atyrau",           stems: ["атырау"] },
  // Uzbekistan
  { locRu: "в Ташкенте",         nameRu: "Ташкент",         nameEn: "Tashkent",         stems: ["ташкент"] },
  { locRu: "в Самарканде",       nameRu: "Самарканд",       nameEn: "Samarkand",        stems: ["самарканд"] },
  { locRu: "в Бухаре",           nameRu: "Бухара",          nameEn: "Bukhara",          stems: ["бухар"] },
  { locRu: "в Андижане",         nameRu: "Андижан",         nameEn: "Andijan",          stems: ["андижан"] },
  { locRu: "в Намангане",        nameRu: "Наманган",        nameEn: "Namangan",         stems: ["наманган"] },
  { locRu: "в Фергане",          nameRu: "Фергана",         nameEn: "Fergana",          stems: ["ферган"] },
  // Ukraine
  { locRu: "в Киеве",            nameRu: "Киев",            nameEn: "Kyiv",             stems: ["киев", "київ"] },
  { locRu: "в Харькове",         nameRu: "Харьков",         nameEn: "Kharkiv",          stems: ["харьков", "харків"] },
  { locRu: "в Одессе",           nameRu: "Одесса",          nameEn: "Odessa",           stems: ["одесс"] },
  { locRu: "в Днепре",           nameRu: "Днепр",           nameEn: "Dnipro",           stems: ["днепр", "дніпр"] },
  { locRu: "во Львове",          nameRu: "Львов",           nameEn: "Lviv",             stems: ["львов", "львів"] },
  { locRu: "в Запорожье",        nameRu: "Запорожье",       nameEn: "Zaporizhzhia",     stems: ["запорожь", "запоріжж"] },
  // Belarus
  { locRu: "в Минске",           nameRu: "Минск",           nameEn: "Minsk",            stems: ["минск"] },
  { locRu: "в Гомеле",           nameRu: "Гомель",          nameEn: "Homel",            stems: ["гомел"] },
  { locRu: "в Бресте",           nameRu: "Брест",           nameEn: "Brest",            stems: ["брест"] },
  // Caucasus & Central Asia
  { locRu: "в Тбилиси",          nameRu: "Тбилиси",         nameEn: "Tbilisi",          stems: ["тбилис"] },
  { locRu: "в Батуми",           nameRu: "Батуми",          nameEn: "Batumi",           stems: ["батум"] },
  { locRu: "в Баку",             nameRu: "Баку",            nameEn: "Baku",             stems: ["баку"] },
  { locRu: "в Ереване",          nameRu: "Ереван",          nameEn: "Yerevan",          stems: ["ереван"] },
  { locRu: "в Кишинёве",         nameRu: "Кишинёв",         nameEn: "Chisinau",         stems: ["кишинёв", "кишинев"] },
  { locRu: "в Бишкеке",          nameRu: "Бишкек",          nameEn: "Bishkek",          stems: ["бишкек"] },
  { locRu: "в Душанбе",          nameRu: "Душанбе",         nameEn: "Dushanbe",         stems: ["душанбе"] },
  { locRu: "в Ашхабаде",         nameRu: "Ашхабад",         nameEn: "Ashgabat",         stems: ["ашхабад"] },
  // Global
  { locRu: "в Дубае",            nameRu: "Дубай",           nameEn: "Dubai",            stems: ["дубай", "dubai"] },
  { locRu: "в Берлине",          nameRu: "Берлин",          nameEn: "Berlin",           stems: ["берлин", "berlin"] },
  { locRu: "в Лондоне",          nameRu: "Лондон",          nameEn: "London",           stems: ["лондон", "london"] },
  { locRu: "в Стамбуле",         nameRu: "Стамбул",         nameEn: "Istanbul",         stems: ["стамбул", "istanbul"] },
  { locRu: "в Варшаве",          nameRu: "Варшава",         nameEn: "Warsaw",           stems: ["варшав", "warsaw"] },
  { locRu: "в Вене",             nameRu: "Вена",            nameEn: "Vienna",           stems: ["в вене", "вены", "вену", "vienna"] },
  { locRu: "в Праге",            nameRu: "Прага",           nameEn: "Prague",           stems: ["праг", "prague"] },
  { locRu: "в Риге",             nameRu: "Рига",            nameEn: "Riga",             stems: ["риг", "riga"] },
  { locRu: "в Таллине",          nameRu: "Таллин",          nameEn: "Tallinn",          stems: ["таллин"] },
  { locRu: "в Вильнюсе",         nameRu: "Вильнюс",         nameEn: "Vilnius",          stems: ["вильнюс"] },
];

// Country-level fallback (when no city found in text but country selected on form)
const COUNTRY_LOC: Record<string, { ru: string; en: string }> = {
  RU:  { ru: "в России",           en: "in Russia" },
  KZ:  { ru: "в Казахстане",       en: "in Kazakhstan" },
  UA:  { ru: "в Украине",          en: "in Ukraine" },
  BY:  { ru: "в Беларуси",         en: "in Belarus" },
  UZ:  { ru: "в Узбекистане",      en: "in Uzbekistan" },
  AZ:  { ru: "в Азербайджане",     en: "in Azerbaijan" },
  AM:  { ru: "в Армении",          en: "in Armenia" },
  GE:  { ru: "в Грузии",           en: "in Georgia" },
  MD:  { ru: "в Молдове",          en: "in Moldova" },
  KG:  { ru: "в Кыргызстане",      en: "in Kyrgyzstan" },
  TJ:  { ru: "в Таджикистане",     en: "in Tajikistan" },
  TM:  { ru: "в Туркменистане",    en: "in Turkmenistan" },
  US:  { ru: "в США",              en: "in the US" },
  GB:  { ru: "в Великобритании",   en: "in the UK" },
  DE:  { ru: "в Германии",         en: "in Germany" },
  AU:  { ru: "в Австралии",        en: "in Australia" },
  CA:  { ru: "в Канаде",           en: "in Canada" },
  FR:  { ru: "во Франции",         en: "in France" },
  NL:  { ru: "в Нидерландах",      en: "in the Netherlands" },
  CH:  { ru: "в Швейцарии",        en: "in Switzerland" },
  AE:  { ru: "в ОАЭ",             en: "in UAE" },
  SG:  { ru: "в Сингапуре",        en: "in Singapore" },
  ES:  { ru: "в Испании",          en: "in Spain" },
  IT:  { ru: "в Италии",           en: "in Italy" },
  PL:  { ru: "в Польше",           en: "in Poland" },
  SE:  { ru: "в Швеции",           en: "in Sweden" },
  NO:  { ru: "в Норвегии",         en: "in Norway" },
  DK:  { ru: "в Дании",            en: "in Denmark" },
  CIS: { ru: "в СНГ",              en: "in CIS" },
  CEE: { ru: "в Восточной Европе", en: "in Eastern Europe" },
};

// ─── Audience database ─────────────────────────────────────────────────────────

const AUDIENCES: AudienceEntry[] = [
  { ruPhrase: "для детей",           enPhrase: "for kids",           keywords: ["детей", "дети", "for kids", "for children", "ребенок", "ребёнок"] },
  { ruPhrase: "для начинающих",      enPhrase: "for beginners",      keywords: ["начинающих", "новичков", "с нуля", "beginners", "newcomers", "from scratch"] },
  { ruPhrase: "для бизнеса",         enPhrase: "for businesses",     keywords: ["для бизнеса", "for business", "b2b", "предпринимателей", "предпринимателя"] },
  { ruPhrase: "для студентов",       enPhrase: "for students",       keywords: ["студентов", "студенты", "students"] },
  { ruPhrase: "для взрослых",        enPhrase: "for adults",         keywords: ["взрослых", "взрослые", "adults"] },
  { ruPhrase: "для пенсионеров",     enPhrase: "for seniors",        keywords: ["пенсионеров", "пожилых", "seniors", "elderly"] },
  { ruPhrase: "для семьи",           enPhrase: "for families",       keywords: ["семьи", "семей", "families", "family"] },
  { ruPhrase: "для женщин",          enPhrase: "for women",          keywords: ["женщин", "женщины", "for women"] },
  { ruPhrase: "для мужчин",          enPhrase: "for men",            keywords: ["мужчин", "мужчины", "for men"] },
];

// ─── Sensitive categories ──────────────────────────────────────────────────────

// Order matters: more specific categories first
const SENSITIVE_KEYWORDS: [SensitiveCategory, string[]][] = [
  ["crypto",     ["крипт", "биткоин", "bitcoin", "ethereum", "nft", "blockchain", "defi", "crypto", " btc", " eth", "токен", "token", "альткоин", "altcoin"]],
  ["finance",    ["инвестир", "финансов", "трейдинг", "биржа", "форекс", "forex", "invest", "trading", "stock market", "bond", "займ", "кредит", "credit", "loan", "страхован", "insurance", "портфел"]],
  ["medical",    ["клиник", "врач", "лечени", "здоровь", "медиц", "стоматол", "dentis", "clinic", "doctor", "hospital", "health care", "medical", "фарм", "pharma", "диагнос", "diagnos", "хирург", "surgeon", "терапев"]],
  ["legal",      ["юридич", "адвокат", "нотариус", "юрист", "legal serv", "lawyer", "attorney", "law firm", "нотари", "правовая"]],
  ["employment", ["вакансии", "найм персонала", "рекрутинг", "подбор персонала", "employment agency", "recruitment", "staffing"]],
  ["realestate", ["недвижимост", "квартир", "аренд", "ипотека", "real estate", "property", "mortgage", "жильё", "жилье", "риелт", "realtor", "апартамент"]],
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function hasCyrillic(s: string): boolean {
  return /[а-яё]/i.test(s);
}

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function fit(text: string, max = 30): string | null {
  return text.length <= max ? text : null;
}

/** Truncate at word boundary, keeping within maxLen */
function truncWords(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const words = text.split(" ");
  let result = "";
  for (const word of words) {
    const candidate = result ? result + " " + word : word;
    if (candidate.length > maxLen) break;
    result = candidate;
  }
  return result || words[0].slice(0, maxLen);
}

/** Convert first word of a Russian noun phrase to accusative (best-effort) */
function accRu(phrase: string): string {
  if (!hasCyrillic(phrase)) return phrase;
  const parts = phrase.split(" ");
  const w = parts[0];
  let acc = w;
  if (w.endsWith("ия"))  acc = w.slice(0, -2) + "ию";
  else if (w.endsWith("ья")) acc = w.slice(0, -2) + "ью";
  else if (w.endsWith("ая")) acc = w.slice(0, -2) + "ую";   // парикмахерская → парикмахерскую
  else if (w.endsWith("яя")) acc = w.slice(0, -2) + "юю";
  else if (w.endsWith("ка")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("га")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("жа")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ша")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ща")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ха")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ца")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("та")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("да")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("на")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ла")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ма")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ра")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("са")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ва")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("ба")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("па")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("фа")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("за")) acc = w.slice(0, -1) + "у";
  else if (w.endsWith("а") && w.length >= 3) acc = w.slice(0, -1) + "у"; // general
  return [acc, ...parts.slice(1)].join(" ");
}

// ─── Extraction functions ──────────────────────────────────────────────────────

export function extractLocation(text: string, countryCode: string): CityEntry | null {
  const lower = text.toLowerCase();
  for (const city of CITIES) {
    for (const stem of city.stems) {
      if (lower.includes(stem)) {
        const idx = lower.indexOf(stem);
        // Verify it's at a word start (preceded by space, comma, or string start)
        if (idx === 0 || /[\s,.(]/.test(lower[idx - 1])) {
          return city;
        }
      }
    }
  }
  return null;
}

export function extractAudience(text: string): AudienceEntry | null {
  const lower = text.toLowerCase();
  for (const entry of AUDIENCES) {
    if (entry.keywords.some(kw => lower.includes(kw))) return entry;
  }
  return null;
}

export function detectSensitiveCategory(text: string): SensitiveCategory | null {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of SENSITIVE_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return null;
}

function stripCityFromText(text: string, city: CityEntry): string {
  let result = text;
  for (const stem of city.stems) {
    // Remove "в/во/из/по [word containing stem]"
    result = result.replace(
      new RegExp(`(?:в|во|из|по)\\s+[а-яёa-z-]*${stem}[а-яёa-z-]*`, "gi"),
      ""
    );
    // Remove standalone word containing stem
    result = result.replace(
      new RegExp(`\\b[а-яёa-z-]*${stem}[а-яёa-z-]*\\b`, "gi"),
      ""
    );
  }
  return result.replace(/\s{2,}/g, " ").trim();
}

function stripAudienceFromText(text: string, audience: AudienceEntry): string {
  let result = text;
  for (const kw of audience.keywords) {
    result = result.replace(new RegExp(`(?:для\\s+)?${kw}`, "gi"), "");
  }
  // Also remove generic "для [word]" if audience was in "для X" pattern
  result = result.replace(/\bдля\s+\S+/gi, "").replace(/\bfor\s+\S+/gi, "");
  return result.replace(/\s{2,}/g, " ").trim();
}

function stripIntros(text: string): string {
  const ruPatterns = [
    /^у меня\s+/i, /^у нас\s+/i,
    /^я продаю\s+/i, /^мы продаём?\s+/i, /^продаём?\s+/i, /^продаю\s+/i,
    /^я занимаюсь\s+/i, /^мы занимаемся\s+/i, /^занимаюсь\s+/i, /^занимаемся\s+/i,
    /^открыл(?:а|и)?\s+/i, /^есть\s+/i, /^имею\s+/i, /^имеем\s+/i,
    /^предоставляю\s+/i, /^предоставляем\s+/i,
    /^оказываю\s+/i, /^оказываем\s+/i,
    /^работаю\s+(?:в\s+сфере\s+)?/i, /^работаем\s+(?:в\s+сфере\s+)?/i,
    /^нужна реклама для\s+/i, /^реклама для\s+/i, /^хочу рекламировать\s+/i,
    /^рекламирую\s+/i, /^запускаю\s+/i,
    /^мой бизнес[:\s]+/i, /^наш бизнес[:\s]+/i,
    /^я предлагаю\s+/i, /^мы предлагаем\s+/i, /^предлагаю\s+/i,
  ];
  const enPatterns = [
    /^i sell\s+/i, /^we sell\s+/i, /^i have\s+(?:a\s+)?/i, /^we have\s+(?:a\s+)?/i,
    /^i run\s+(?:a\s+)?/i, /^we run\s+(?:a\s+)?/i,
    /^my (?:business|company)\s+(?:is\s+)?(?:a\s+)?/i,
    /^our (?:business|company)\s+(?:is\s+)?(?:a\s+)?/i,
    /^i(?:'m| am)\s+(?:selling|offering|providing)\s+/i,
    /^we(?:'re| are)\s+(?:selling|offering|providing)\s+/i,
    /^(?:need|looking for) (?:ads|advertising) for\s+/i,
    /^advertising for\s+/i,
    /^i offer\s+/i, /^we offer\s+/i,
  ];
  let result = text;
  for (const re of [...ruPatterns, ...enPatterns]) {
    result = result.replace(re, "");
  }
  // Remove leading prepositions left behind ("по", "с", "в")
  result = result.replace(/^(?:по|с|в|во|из|для)\s+/i, "");
  return result.replace(/\s{2,}/g, " ").trim();
}

export function extractProductOrService(
  rawInput: string,
  city: CityEntry | null,
  audience: AudienceEntry | null
): { short: string; full: string } {
  let text = rawInput;

  // Remove city
  if (city) text = stripCityFromText(text, city);

  // Remove audience
  if (audience) text = stripAudienceFromText(text, audience);

  // Strip intro phrases
  text = stripIntros(text);

  // Remove punctuation at ends, clean spaces
  text = text.replace(/[,.:;!?]+$/, "").replace(/^[,.:;!?\s]+/, "").trim();

  if (!text) text = rawInput.trim();

  const full = truncWords(cap(text), 28);
  const short = truncWords(cap(text), 20);
  return { short, full };
}

// ─── Business context parser ───────────────────────────────────────────────────

export function parseBusinessInput(
  niche: string,
  countryCode: string,
  language: string
): BusinessContext {
  const outputLang: Lang = language === "Russian" ? "ru" : "en";
  const lower = niche.toLowerCase();

  const city = extractLocation(niche, countryCode);
  const audience = extractAudience(niche);
  const { short, full } = extractProductOrService(niche, city, audience);
  const sensitive = detectSensitiveCategory(niche);

  // Compute localized location phrase
  let cityLocRu: string | null = city?.locRu ?? null;
  let cityNameRu: string | null = city?.nameRu ?? null;
  let cityNameEn: string | null = city?.nameEn ?? null;

  // Fall back to country-level location
  if (!city && countryCode && COUNTRY_LOC[countryCode]) {
    const cp = COUNTRY_LOC[countryCode];
    cityLocRu = cp.ru;
    cityNameRu = cp.ru.replace(/^(?:в|во|из|на)\s+/i, "");
    cityNameEn = cp.en.replace(/^(?:in|the)\s+/i, "");
  }

  return {
    rawInput: niche,
    outputLang,
    product: short,
    productDesc: full,
    cityLocRu,
    cityNameRu,
    cityNameEn,
    audienceRu: audience?.ruPhrase ?? null,
    audienceEn: audience?.enPhrase ?? null,
    sensitive,
    isOnline: /онлайн|online|дистанц|remote|удалённо/i.test(lower),
    isCourse: /курс|обучени|тренинг|вебинар|course|training|webinar|класс|class/i.test(lower),
    isDelivery: /доставк|delivery|доставляем/i.test(lower),
  };
}

// ─── Headline generation ───────────────────────────────────────────────────────

interface HeadlineCandidate {
  text: string;
  score: number;
  tip: string;
}

function generateUniversalHeadlines(ctx: BusinessContext): HeadlineCandidate[] {
  const { product, outputLang: lang, cityLocRu, cityNameEn, audienceRu, audienceEn, sensitive, isOnline, isCourse } = ctx;
  const loc = lang === "ru" ? cityLocRu : (cityNameEn ? `in ${cityNameEn}` : null);
  const aud = lang === "ru" ? audienceRu : audienceEn;
  const acc = lang === "ru" ? accRu(product) : product;

  const candidates: HeadlineCandidate[] = [];

  const add = (text: string | null, score: number, tip: string) => {
    if (text && text.length <= 30) candidates.push({ text, score, tip });
  };

  // ── Tier 1: product + location (most specific) ──
  if (loc) {
    add(fit(`${product} ${loc}`), 94, lang === "ru"
      ? "Геолокация + продукт — точное совпадение с поисковым запросом"
      : "Location + product — exact match with local search intent");
  }

  // ── Tier 2: product + audience ──
  if (aud) {
    add(fit(`${product} ${aud}`), 91, lang === "ru"
      ? "Продукт + аудитория — высокая релевантность для целевой группы"
      : "Product + audience — high relevance for the target group");
  }

  // ── Tier 3: product action variations ──
  if (lang === "ru") {
    add(fit(`${product}: узнайте условия`), 88, "Продукт + призыв к действию — снимает барьер первого шага");
    add(fit(`${product} онлайн`),           87, "«Онлайн» повышает CTR для сервисов с возможностью записи");
    add(fit(`Подберите ${acc} онлайн`),     86, "Глагол «подберите» снижает порог принятия решения");
    add(fit(`Узнайте о ${product}`),        84, "Информационный фрейм — безопасен для любой ниши");
    add(fit(`${product}: оставьте заявку`), 83, "Прямой CTA в заголовке ускоряет конверсию");
    add(fit(`Закажите ${acc}`),             82, "Прямой призыв к покупке — работает для товаров и услуг");
    add(fit(`${product} с консультацией`),  81, "Консультация снижает страх перед первым контактом");
    if (isCourse) {
      add(fit(`Запишитесь: ${product}`),   90, "«Запишитесь» — самый конверсионный CTA для курсов");
      add(fit(`${product} — начни сейчас`), 88, "Срочность + образование = высокий CTR в EdTech");
    }
    if (isOnline && !fit(`${product} онлайн`)) {
      add(fit(`${product}. Формат онлайн`), 85, "Уточнение онлайн-формата повышает кликабельность");
    }
    if (loc) {
      add(fit(`${product} — работаем ${loc}`), 83, "Подтверждение присутствия в регионе укрепляет доверие");
    }
    if (aud) {
      add(fit(`${acc} ${aud}`), 82, "Акцент на ЦА — сильный сигнал релевантности для алгоритма");
    }
  } else {
    // English
    add(fit(`${product} Online`),                 87, "Online modifier boosts CTR for service-based businesses");
    add(fit(`Choose ${product} Today`),           86, "Action verb + urgency = higher engagement rate");
    add(fit(`Find ${product} ${loc ?? "Nearby"}`),84, "Location relevance drives local searcher clicks");
    add(fit(`Book ${product} Consultation`),       83, "Low-friction CTA — 'book' is softer than 'buy'");
    add(fit(`${product}: Get Details`),            82, "Colon structure draws attention in search results");
    add(fit(`${product} With Free Advice`),        81, "Free consultation offer lowers conversion barrier");
    add(fit(`Compare ${product} Options`),         80, "Comparison frame works well for consideration-phase buyers");
    if (isCourse) {
      add(fit(`Enroll: ${product}`),              90, "Enroll CTA is #1 for online education ads");
      add(fit(`${product} — Start Today`),        88, "Immediacy + education = strong EdTech hook");
    }
    if (loc) {
      add(fit(`${product} in ${cityNameEn}`),     89, "City-specific headline matches local search perfectly");
    }
    if (aud) {
      add(fit(`${product} ${aud}`),               86, "Audience qualifier increases ad relevance score");
    }
  }

  // ── Tier 4: universal safety formulas ──
  if (lang === "ru") {
    const universals: [string, number, string][] = [
      ["Найдите подходящий вариант",    76, "Нейтральный призыв — работает для любого продукта"],
      ["Получите консультацию",         75, "Консультация как первый шаг — снижает порог входа"],
      ["Сравните варианты заранее",     74, "Фрейм сравнения привлекает аудиторию на стадии выбора"],
      ["Узнайте условия сегодня",       74, "Сигнал срочности без агрессивных обещаний"],
      ["Начните с понятного шага",      73, "Снижает тревогу перед новым продуктом"],
      ["Оставьте заявку онлайн",        72, "Прямой CTA с низким порогом — высокий CTR для лидов"],
      ["Подберите решение онлайн",      72, "«Подберите» — мягкий призыв без давления"],
      ["Получите подробности",          71, "Информационный запрос — безопасен для любой ниши"],
      ["Разберитесь перед выбором",     70, "Снимает страх покупки через образование"],
      ["Выберите подходящий формат",    69, "Акцент на выборе — доверительный тон"],
      ["Получите вводную консультацию", 68, "«Вводная» снижает воспринимаемый риск контакта"],
      ["Узнайте больше перед выбором",  67, "Информационный фрейм отвечает на стадию исследования"],
      ["Официальная информация онлайн", 66, "Сигнал надёжности без конкретных обещаний"],
      ["Запросить детали сегодня",      65, "Лёгкий первый шаг — оптимален для B2B-запросов"],
      ["Выберите подходящий вариант",   65, "Акцент на выборе повышает вовлечённость"],
    ];
    for (const [text, score, tip] of universals) add(text, score, tip);
  } else {
    const universals: [string, number, string][] = [
      ["Find the Right Option",          76, "Discovery framing appeals to consideration-phase buyers"],
      ["Get a Free Consultation",        75, "Free consultation offer reduces conversion friction"],
      ["Compare Options Before Buying",  74, "Comparison frame matches research-phase search intent"],
      ["Learn More Before You Choose",   73, "Educational tone builds trust before the ask"],
      ["Simple Start — No Pressure",     72, "Low-pressure framing lowers bounce rate"],
      ["Request Information Today",      72, "Soft CTA with urgency signal — high CTR for leads"],
      ["Get Clear Details Online",       71, "Clarity promise works for any complex product"],
      ["Book a Consultation Online",     70, "Booking CTA is safe and conversion-friendly"],
      ["Explore Your Options Today",     69, "Exploration verb suits awareness-stage searchers"],
      ["Start With Basic Information",   68, "Low-commitment opener — great for new audiences"],
      ["Official Information Online",    67, "Trust signal — effective for regulated industries"],
      ["Choose the Right Solution",      66, "Solution framing appeals to problem-aware buyers"],
      ["Get Advice — No Obligation",     65, "Zero-obligation reassurance drives hesitant clickers"],
      ["See What Works for You",         65, "Personalization language increases perceived relevance"],
      ["Take the First Step Today",      64, "Urgency + low commitment = reliable CTR booster"],
    ];
    for (const [text, score, tip] of universals) add(text, score, tip);
  }

  // Sensitive-category safe overrides (inject extra caution)
  if (sensitive === "finance" || sensitive === "crypto") {
    if (lang === "ru") {
      add("Узнайте условия и риски",   85, "Упоминание рисков соответствует политике Google Ads для финансовых тем");
      add("Получите вводный материал", 83, "Образовательный фрейм снижает риск отклонения модерации");
    } else {
      add("Understand the Risks First", 85, "Risk mention satisfies Google's financial product policy");
      add("Educational Materials First", 83, "Framing as education reduces moderation rejection risk");
    }
  }
  if (sensitive === "medical") {
    if (lang === "ru") {
      add("Запись к специалисту онлайн", 88, "«Специалист» вместо «врач» — нейтральнее для модерации");
      add("Получите профессиональный совет", 82, "Совет, а не лечение — безопасный фрейм для медтематики");
    } else {
      add("Book a Specialist Online", 88, "Specialist framing is safer than medical promises");
      add("Get Professional Advice",  82, "Advice over treatment — compliant with medical ad policies");
    }
  }
  if (sensitive === "legal") {
    if (lang === "ru") add("Задайте вопрос юристу", 88, "«Вопрос» снимает правовую ответственность за совет");
    else               add("Ask a Legal Question",    88, "Question framing avoids unauthorized legal advice claims");
  }

  // Deduplicate by text and return sorted by score
  const seen = new Set<string>();
  return candidates
    .filter(c => { if (seen.has(c.text)) return false; seen.add(c.text); return true; })
    .sort((a, b) => b.score - a.score);
}

export function generateHeadlines(ctx: BusinessContext): RSAHeadline[] {
  const candidates = generateUniversalHeadlines(ctx);
  return candidates.slice(0, 15).map((c, i) => ({
    id: `h${i + 1}`,
    text: c.text,
    strength: c.score >= 88 ? "excellent" : c.score >= 80 ? "good" : c.score >= 70 ? "average" : "weak",
    strengthScore: c.score,
    tip: c.tip,
  }));
}

// ─── Description generation ────────────────────────────────────────────────────

export function generateDescriptions(ctx: BusinessContext): RSADescription[] {
  const { productDesc: p, outputLang: lang, cityLocRu, cityNameEn, audienceRu, audienceEn, sensitive } = ctx;
  const loc = lang === "ru" ? (cityLocRu ?? "") : (cityNameEn ? `in ${cityNameEn}` : "");
  const aud = lang === "ru" ? (audienceRu ?? "") : (audienceEn ?? "");

  // Build 4 descriptions using different copywriting angles
  const descs: Array<{ text: string; score: number; tip: string }> = [];

  if (lang === "ru") {
    const locSuffix = loc ? ` ${loc}` : "";
    const audSuffix = aud ? ` ${aud}` : "";

    // 1. Question opener — high emotional resonance
    const d1 = `Ищете ${accRu(p)}${audSuffix}? Помогаем подобрать вариант${locSuffix}. Оставьте заявку.`;
    // 2. Offer statement — clear value proposition
    const d2 = `Предлагаем ${accRu(p)}${locSuffix}. Широкий выбор${aud ? ` ${aud}` : ""}. Консультация бесплатно.`;
    // 3. Benefit-first — trust-building
    const d3 = `${cap(p)}${locSuffix}. Удобный выбор онлайн. Прозрачные условия. Без обязательств.`;
    // 4. CTA-forward — action-oriented
    const d4 = `Подберём подходящий вариант${locSuffix}${audSuffix}. Ответим в течение часа. Запросите детали.`;

    const sensitiveNote = sensitive === "finance" || sensitive === "crypto"
      ? " Информация носит образовательный характер." : "";

    descs.push({ text: truncWords(d1 + sensitiveNote, 90), score: 93, tip: "Вопрос-боль + призыв к заявке — самый высококонверсионный шаблон" });
    descs.push({ text: truncWords(d2 + sensitiveNote, 90), score: 90, tip: "Оффер + соцдоказательство + CTA — классическая структура продающего описания" });
    descs.push({ text: truncWords(d3 + sensitiveNote, 90), score: 87, tip: "Снятие возражений через прозрачность — эффективно для новой аудитории" });
    descs.push({ text: truncWords(d4 + sensitiveNote, 90), score: 85, tip: "Срочность ответа как дифференциатор — повышает доверие к компании" });
  } else {
    const locSuffix = loc ? ` ${loc}` : "";
    const audSuffix = aud ? ` ${aud}` : "";

    const d1 = `Looking for ${p}${audSuffix}${locSuffix}? We'll help you find the right fit. Get in touch.`;
    const d2 = `We offer ${p}${locSuffix}. Multiple options available${aud ? ` ${aud}` : ""}. Free consultation.`;
    const d3 = `${cap(p)}${locSuffix}. Browse options online. Clear terms. No commitment required.`;
    const d4 = `Find the right ${p}${locSuffix}${audSuffix}. We respond within the hour. Request details.`;

    const sensitiveNote = sensitive === "finance" || sensitive === "crypto"
      ? " For informational purposes only." : "";

    descs.push({ text: truncWords(d1 + sensitiveNote, 90), score: 93, tip: "Question opener + benefit + CTA — highest-converting description structure" });
    descs.push({ text: truncWords(d2 + sensitiveNote, 90), score: 90, tip: "Offer + availability + free consultation — classic ad description formula" });
    descs.push({ text: truncWords(d3 + sensitiveNote, 90), score: 87, tip: "Objection removal through transparency — effective for cold audiences" });
    descs.push({ text: truncWords(d4 + sensitiveNote, 90), score: 85, tip: "Response speed as differentiator — builds trust and drives calls" });
  }

  return descs.map((d, i) => ({
    id: `d${i + 1}`,
    text: d.text,
    strength: d.score >= 90 ? "excellent" : d.score >= 80 ? "good" : "average",
    strengthScore: d.score,
    tip: d.tip,
  }));
}

// ─── CTA generation ────────────────────────────────────────────────────────────

export function generateCTA(ctx: BusinessContext): string[] {
  const { outputLang: lang, isCourse, sensitive } = ctx;
  if (lang === "ru") {
    const base = [
      "Оставить заявку", "Получить консультацию", "Узнать подробнее",
      "Подобрать вариант", "Запросить информацию", "Сравнить варианты",
      "Получить предложение", "Связаться с нами", "Узнать цену", "Начать сейчас",
    ];
    if (isCourse) base.splice(0, 0, "Записаться на курс", "Попробовать бесплатно", "Смотреть программу");
    if (sensitive === "medical") base.splice(0, 0, "Записаться к специалисту", "Получить консультацию врача");
    if (sensitive === "legal") base.splice(0, 0, "Задать вопрос юристу", "Получить юридическую консультацию");
    return base.slice(0, 10);
  } else {
    const base = [
      "Get a Free Consultation", "Learn More", "Request Information",
      "Compare Options", "Get a Quote", "Book a Consultation",
      "Contact Us Today", "See Details", "Get Started", "Find Out More",
    ];
    if (isCourse) base.splice(0, 0, "Enroll Now", "Try for Free", "View Course Details");
    if (sensitive === "medical") base.splice(0, 0, "Book a Specialist", "Get Medical Advice");
    if (sensitive === "legal") base.splice(0, 0, "Ask a Lawyer", "Get Legal Advice");
    return base.slice(0, 10);
  }
}

// ─── Moderation generation ─────────────────────────────────────────────────────

export function generateRiskWarnings(ctx: BusinessContext): RSAFullResult["moderation"] {
  const { sensitive, outputLang: lang } = ctx;
  const flags: ModerationFlag[] = [];
  let score = 92;
  let level: "LOW" | "MEDIUM" | "HIGH" = "LOW";

  if (sensitive === "crypto") {
    score = 68; level = "MEDIUM";
    flags.push({
      field: lang === "ru" ? "Тема криптовалют" : "Cryptocurrency topic",
      issue: lang === "ru"
        ? "Реклама криптовалют требует верификации в Google Ads и запрещена в ряде стран. Необходимо получить разрешение в аккаунте."
        : "Crypto ads require account-level certification in Google Ads and are restricted in many countries.",
      severity: "high",
      safer: lang === "ru" ? "Образование по финансовым инструментам" : "Financial instruments education",
    });
    flags.push({
      field: lang === "ru" ? "Упоминание доходности" : "Yield/income mention",
      issue: lang === "ru"
        ? "Любые указания на доходность или прибыль запрещены без обязательного предупреждения о рисках."
        : "Any yield or profit claims require mandatory risk disclosure statements.",
      severity: "high",
      safer: lang === "ru" ? "Узнайте, как работают инструменты" : "Learn how financial instruments work",
    });
  } else if (sensitive === "finance") {
    score = 79; level = "LOW";
    flags.push({
      field: lang === "ru" ? "Финансовая тематика" : "Financial topic",
      issue: lang === "ru"
        ? "Финансовая реклама запрещает обещания прибыли или гарантированного дохода. Используйте только образовательный фрейм."
        : "Financial ads may not promise profit or guaranteed returns. Use educational framing only.",
      severity: "medium",
      safer: lang === "ru" ? "Обучение инвестированию — узнайте больше" : "Investment education — learn the basics",
    });
  } else if (sensitive === "medical") {
    score = 84; level = "LOW";
    flags.push({
      field: lang === "ru" ? "Медицинская тематика" : "Medical topic",
      issue: lang === "ru"
        ? "Медицинская реклама не должна обещать лечение или гарантировать результат. Рекомендуется добавить дисклеймер."
        : "Medical ads must not promise cures or guarantee outcomes. A disclaimer is strongly recommended.",
      severity: "low",
      safer: lang === "ru" ? "Консультация специалиста — узнайте подробнее" : "Specialist consultation — learn more",
    });
  } else if (sensitive === "legal") {
    score = 87; level = "LOW";
    flags.push({
      field: lang === "ru" ? "Юридические услуги" : "Legal services",
      issue: lang === "ru"
        ? "Реклама юридических услуг не должна обещать конкретный исход дела или давать юридические советы."
        : "Legal ads must not promise specific case outcomes or give legal advice.",
      severity: "low",
      safer: lang === "ru" ? "Юридическая консультация — задайте вопрос" : "Legal consultation — ask a question",
    });
  } else if (sensitive === "realestate") {
    score = 86; level = "LOW";
    flags.push({
      field: lang === "ru" ? "Недвижимость" : "Real estate",
      issue: lang === "ru"
        ? "Объявления о недвижимости должны содержать точные данные без вводящих в заблуждение заявлений о стоимости или доходности."
        : "Real estate ads must use accurate information without misleading price or yield claims.",
      severity: "low",
      safer: lang === "ru" ? "Подберём вариант под бюджет" : "Find options within your budget",
    });
  }

  return { score, level, flags };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function generateRSA(
  niche: string,
  countryCode: string,
  language: string,
  _goal: string,
  _tone: string
): RSAFullResult {
  const ctx = parseBusinessInput(niche, countryCode, language);
  return {
    generatedAt: language === "Russian" ? "Только что · 2.1с" : "Just now · 2.1s",
    headlines: generateHeadlines(ctx),
    descriptions: generateDescriptions(ctx),
    ctaSuggestions: generateCTA(ctx),
    moderation: generateRiskWarnings(ctx),
  };
}

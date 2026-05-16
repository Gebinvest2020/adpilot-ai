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

/** Broad niche for semantic headline expansion (non-policy-sensitive categories) */
type NicheCategory =
  | "homegoods"
  | "food"
  | "clothing"
  | "electronics"
  | "furniture"
  | "fitness"
  | "travel"
  | "automotive"
  | "beauty"
  | "ecommerce";

// Order matters: more specific first
const NICHE_KEYWORDS: [NicheCategory, string[]][] = [
  ["homegoods",   ["подушк", "матрас", "постел", "одеял", "плед", "полотенц", "текстил", "шторы", "штор", "наволочк", "пододеяльник", "постельн", "pillow", "bedding", "mattress", "blanket", "linen", "textile"]],
  ["furniture",   ["мебел", "диван", "столы", "кресл", "шкаф", "кровать", "полк", "комод", "тумб", "стеллаж", "furniture", "sofa", "wardrobe", "shelf", "dresser"]],
  ["food",        ["суши", "пицц", "бургер", "шаурм", "роллы", "пирог", "торт", "выпечк", "кондитер", "доставка еды", "фастфуд", "sushi", "pizza", "burger", "food delivery", "bakery", "cake", "pastry"]],
  ["clothing",    ["одежд", "обув", "платье", "костюм", "куртк", "брюки", "футболк", "носки", "трикот", "джинс", "shirt", "dress", "shoes", "clothing", "jacket", "pants", "jeans", "fashion"]],
  ["electronics", ["телефон", "ноутбук", "компьютер", "смартфон", "планшет", "электроник", "гаджет", "наушник", "зарядк", "аксессуар", "phone", "laptop", "computer", "tablet", "electronics", "gadget", "headphone"]],
  ["fitness",     ["фитнес", "спортзал", "тренажер", "йог", "бокс", "качалка", "CrossFit", "gym", "fitness", "yoga", "boxing", "workout", "sport hall"]],
  ["travel",      ["туризм", "путёвк", "путевк", "курорт", "путешеств", "отель", "гостиниц", "hotel", "travel", "resort", "vacation", "trip"]],
  ["automotive",  ["автомобил", "шиномонтаж", "кузовн", "автосерви", "автозапч", "car ", "vehicle", "tire"]],
  ["beauty",      ["салон красот", "парикмахер", "маникюр", "педикюр", "косметолог", "барбер", "beauty salon", "nail", "hair salon", "barbershop"]],
  ["ecommerce",   ["интернет-магазин", "онлайн-магазин", "online store", "web shop", "интернет магазин"]],
];

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
  product: string;          // extracted full name (≤28 chars)
  productShort: string;     // semantic short form for headline templates (≤16 chars)
  productDesc: string;      // description-length form (≤28 chars)
  cityLocRu: string | null;      // "в Ташкенте"
  cityNameRu: string | null;     // "Ташкент"
  cityNameEn: string | null;     // "Tashkent"
  countryCode: string;           // "AM", "RU", etc.
  countryNameRu: string | null;  // "Армения"
  countryNameEn: string | null;  // "Armenia"
  audienceRu: string | null;     // "для детей"
  audienceEn: string | null;     // "for kids"
  sensitive: SensitiveCategory | null;
  niche: NicheCategory | null;
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
interface CountryLocEntry { ru: string; en: string; nominRu: string; nominEn: string; }
const COUNTRY_LOC: Record<string, CountryLocEntry> = {
  RU:  { ru: "в России",           en: "in Russia",           nominRu: "Россия",          nominEn: "Russia" },
  KZ:  { ru: "в Казахстане",       en: "in Kazakhstan",       nominRu: "Казахстан",        nominEn: "Kazakhstan" },
  UA:  { ru: "в Украине",          en: "in Ukraine",          nominRu: "Украина",          nominEn: "Ukraine" },
  BY:  { ru: "в Беларуси",         en: "in Belarus",          nominRu: "Беларусь",         nominEn: "Belarus" },
  UZ:  { ru: "в Узбекистане",      en: "in Uzbekistan",       nominRu: "Узбекистан",       nominEn: "Uzbekistan" },
  AZ:  { ru: "в Азербайджане",     en: "in Azerbaijan",       nominRu: "Азербайджан",      nominEn: "Azerbaijan" },
  AM:  { ru: "в Армении",          en: "in Armenia",          nominRu: "Армения",          nominEn: "Armenia" },
  GE:  { ru: "в Грузии",           en: "in Georgia",          nominRu: "Грузия",           nominEn: "Georgia" },
  MD:  { ru: "в Молдове",          en: "in Moldova",          nominRu: "Молдова",          nominEn: "Moldova" },
  KG:  { ru: "в Кыргызстане",      en: "in Kyrgyzstan",       nominRu: "Кыргызстан",       nominEn: "Kyrgyzstan" },
  TJ:  { ru: "в Таджикистане",     en: "in Tajikistan",       nominRu: "Таджикистан",      nominEn: "Tajikistan" },
  TM:  { ru: "в Туркменистане",    en: "in Turkmenistan",     nominRu: "Туркменистан",     nominEn: "Turkmenistan" },
  US:  { ru: "в США",              en: "in the US",           nominRu: "США",              nominEn: "USA" },
  GB:  { ru: "в Великобритании",   en: "in the UK",           nominRu: "Великобритания",   nominEn: "UK" },
  DE:  { ru: "в Германии",         en: "in Germany",          nominRu: "Германия",         nominEn: "Germany" },
  AU:  { ru: "в Австралии",        en: "in Australia",        nominRu: "Австралия",        nominEn: "Australia" },
  CA:  { ru: "в Канаде",           en: "in Canada",           nominRu: "Канада",           nominEn: "Canada" },
  FR:  { ru: "во Франции",         en: "in France",           nominRu: "Франция",          nominEn: "France" },
  NL:  { ru: "в Нидерландах",      en: "in the Netherlands",  nominRu: "Нидерланды",       nominEn: "Netherlands" },
  CH:  { ru: "в Швейцарии",        en: "in Switzerland",      nominRu: "Швейцария",        nominEn: "Switzerland" },
  AE:  { ru: "в ОАЭ",             en: "in UAE",              nominRu: "ОАЭ",              nominEn: "UAE" },
  SG:  { ru: "в Сингапуре",        en: "in Singapore",        nominRu: "Сингапур",         nominEn: "Singapore" },
  ES:  { ru: "в Испании",          en: "in Spain",            nominRu: "Испания",          nominEn: "Spain" },
  IT:  { ru: "в Италии",           en: "in Italy",            nominRu: "Италия",           nominEn: "Italy" },
  PL:  { ru: "в Польше",           en: "in Poland",           nominRu: "Польша",           nominEn: "Poland" },
  SE:  { ru: "в Швеции",           en: "in Sweden",           nominRu: "Швеция",           nominEn: "Sweden" },
  NO:  { ru: "в Норвегии",         en: "in Norway",           nominRu: "Норвегия",         nominEn: "Norway" },
  DK:  { ru: "в Дании",            en: "in Denmark",          nominRu: "Дания",            nominEn: "Denmark" },
  CIS: { ru: "в СНГ",              en: "in CIS",              nominRu: "СНГ",              nominEn: "CIS" },
  CEE: { ru: "в Восточной Европе", en: "in Eastern Europe",   nominRu: "Восточная Европа", nominEn: "Eastern Europe" },
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

/** Convert first word of a Russian noun phrase to genitive (best-effort) */
function genRu(phrase: string): string {
  if (!hasCyrillic(phrase)) return phrase;
  const parts = phrase.split(" ");
  const orig = parts[0];
  const w = orig.toLowerCase();
  let gen = orig;

  // Likely indeclinable loanwords ending in consonant+и (суши, такси, жюри, etc.)
  const indeclinableEnds = ["ши", "жи", "чи", "щи", "ти", "си", "ни", "ли", "ри", "пи", "ви", "би", "ми", "хи"];
  if (indeclinableEnds.some(e => w.endsWith(e)) && w.length > 3) return phrase;

  if      (w.endsWith("ия"))  gen = orig.slice(0, -2) + "ии";
  else if (w.endsWith("ая"))  gen = orig.slice(0, -2) + "ой";
  else if (w.endsWith("яя"))  gen = orig.slice(0, -2) + "ей";
  else if (w.endsWith("я"))   gen = orig.slice(0, -1) + "и";
  else if (w.endsWith("й"))   gen = orig.slice(0, -1) + "я";
  else if (w.endsWith("сть")) gen = orig.slice(0, -3) + "сти";
  else if (w.endsWith("ь"))   gen = orig.slice(0, -1) + "и";
  // -а with preceding velar/sibilant → -и
  else if (/[кгхжшщчц]а$/.test(w)) gen = orig.slice(0, -1) + "и";
  // -а with other consonant → -ы
  else if (w.endsWith("а") && w.length >= 3) gen = orig.slice(0, -1) + "ы";
  // masculine consonant ending → +а
  else if (/[бвгджзклмнпрстфхцчшщ]$/.test(w)) gen = orig + "а";

  return [gen, ...parts.slice(1)].join(" ");
}

/**
 * Convert Russian genitive plural → nominative plural (best-effort).
 * "подушек" → "подушки", "матрасов" → "матрасы", "автомобилей" → "автомобили"
 */
function nominalizePluralRu(text: string): string {
  const parts = text.split(" ");
  const orig = parts[0];
  const w = orig.toLowerCase();
  let nom = orig;

  // -шек, -жек (подушек → подушки)
  if (/[шжзс]ек$/.test(w) && w.length > 4) nom = orig.slice(0, -2) + "ки";
  // general -ек → -ки (игрушек → игрушки, книжек → книжки)
  else if (w.endsWith("ек") && w.length > 4) nom = orig.slice(0, -2) + "ки";
  // -ков → -ки (носков → носки, ботинков → ботинки)
  else if (w.endsWith("ков") && w.length > 5) nom = orig.slice(0, -3) + "ки";
  // -ов → -ы (матрасов → матрасы, товаров → товары, диванов → диваны)
  else if (w.endsWith("ов") && w.length > 4) nom = orig.slice(0, -2) + "ы";
  // -лей → -ли (автомобилей → автомобили, деталей → детали)
  else if (w.endsWith("лей") && w.length > 5) nom = orig.slice(0, -2) + "и";
  // -ей → -и (батарей → батареи, статей → статьи)
  else if (w.endsWith("ей") && w.length > 4) nom = orig.slice(0, -2) + "и";

  return [nom, ...parts.slice(1)].join(" ");
}

/**
 * Normalize "бизнес по продаже X", "магазин X", "продажа X" → extract core product.
 * Service verbs (ремонт, доставка, аренда) are KEPT as they define the service type.
 */
function normalizeBusinessPhrase(text: string): string {
  let t = text.trim();
  let m: RegExpMatchArray | null;

  // "бизнес по продаже/реализации/торговле X" → nominalize(X)
  m = t.match(/^бизнес\s+(?:по\s+)?(?:продаже|реализации|торговле)\s+(.+)/i);
  if (m) return cap(nominalizePluralRu(m[1].trim()));

  // "бизнес по аренде X" → "аренда X"
  m = t.match(/^бизнес\s+по\s+аренде\s+(.+)/i);
  if (m) return `аренда ${m[1].trim()}`;

  // "бизнес по ремонту X" → "ремонт X"
  m = t.match(/^бизнес\s+по\s+ремонту\s+(.+)/i);
  if (m) return `ремонт ${m[1].trim()}`;

  // "бизнес по доставке X" → "доставка X"
  m = t.match(/^бизнес\s+по\s+доставке\s+(.+)/i);
  if (m) return `доставка ${m[1].trim()}`;

  // "бизнес по [другое] X" → strip prefix, keep X
  t = t.replace(/^бизнес\s+по\s+/i, "");
  // "мой бизнес X" / "бизнес X"
  t = t.replace(/^(?:мой\s+|наш\s+)?бизнес\s*/i, "");

  // "магазин X" → nominalize X
  m = t.match(/^магазин\s+(.+)/i);
  if (m) return cap(nominalizePluralRu(m[1].trim()));

  // "компания по продаже X" → nominalize X
  m = t.match(/^компани[яи]\s+по\s+(?:продаже|реализации)\s+(.+)/i);
  if (m) return cap(nominalizePluralRu(m[1].trim()));

  // "продажа X" → nominalize X (strip — it's the default retail activity)
  m = t.match(/^продажа\s+(.+)/i);
  if (m) return cap(nominalizePluralRu(m[1].trim()));

  // "торговля X" → nominalize X
  m = t.match(/^торговля\s+(.+)/i);
  if (m) return cap(nominalizePluralRu(m[1].trim()));

  // "реализация X" → nominalize X
  m = t.match(/^реализация\s+(.+)/i);
  if (m) return cap(nominalizePluralRu(m[1].trim()));

  return t;
}

/** Remove country name mentions from product text so they don't contaminate the extracted product */
function stripCountryRefsFromText(text: string): string {
  const countryRe = /\b(?:молдов[аеуы]?|молдовы|росси[яи]|украин[аеу]|казахстан[аеу]?|беларус[ьи]|узбекистан[аеу]?|армени[яи]|грузи[яи]|азербайджан[аеу]?|кыргызстан[аеу]?|таджикистан[аеу]?|туркменистан[аеу]?|германи[яи]|франци[яи]|испани[яи]|польш[аеи]|итали[яи]|швеци[яи]|норвеги[яи]|дании|дания|moldova|russia|ukraine|kazakhstan|belarus|georgia|armenia|germany|france|spain|poland|italy|sweden|norway|denmark)\b/gi;
  return text.replace(countryRe, "").replace(/\s{2,}/g, " ").trim();
}

/** Detect broad niche category from raw input */
export function detectNicheCategory(text: string): NicheCategory | null {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of NICHE_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return null;
}

/**
 * Derive a short semantic label for use in headline location templates.
 * E.g. "Агентство по продаже квартир" → "Квартиры"
 *      "Стоматологическая клиника"    → "Стоматология"
 *      "Ремонт холодильников"         → "Холодильники"
 *      "Доставка суши"                → "Суши"
 *      "Обучение криптовалюте"        → "Крипта" (safe alias)
 * Max 16 chars, Title case.
 */
function deriveShortProduct(product: string, sensitive: SensitiveCategory | null, niche: NicheCategory | null, rawInput: string): string {
  const lower = product.toLowerCase();
  const rawLower = rawInput.toLowerCase();

  // ── Real estate ────────────────────────────────────────────────────────────
  if (sensitive === "realestate" || /квартир|жильё|жилье|недвижимост|апартамент/.test(rawLower)) {
    if (/апартамент/.test(rawLower)) return "Апартаменты";
    if (/студи/.test(rawLower)) return "Студии";
    if (/дом|домов|коттедж/.test(rawLower)) return "Дома";
    if (/офис/.test(rawLower)) return "Офисы";
    if (/аренд/.test(rawLower)) return "Аренда жилья";
    return "Квартиры";
  }

  // ── Crypto / blockchain ────────────────────────────────────────────────────
  if (sensitive === "crypto") {
    if (/блокчейн|blockchain/.test(rawLower)) return "Блокчейн";
    if (/web3|defi/.test(rawLower)) return "Web3";
    return "Крипта";
  }

  // ── Medical / dental ───────────────────────────────────────────────────────
  if (sensitive === "medical") {
    if (/стоматол|dentis/.test(rawLower)) return "Стоматология";
    if (/хирург|surgeon/.test(rawLower)) return "Хирургия";
    if (/терапев/.test(rawLower)) return "Терапия";
    if (/диагнос/.test(rawLower)) return "Диагностика";
    if (/педиатр/.test(rawLower)) return "Педиатрия";
    if (/ортопед/.test(rawLower)) return "Ортопедия";
    return "Клиника";
  }

  // ── Niche-derived short names ──────────────────────────────────────────────
  if (niche === "homegoods") {
    if (/матрас/.test(rawLower)) return "Матрасы";
    if (/одеял/.test(rawLower)) return "Одеяла";
    if (/плед/.test(rawLower)) return "Пледы";
    if (/полотенц/.test(rawLower)) return "Полотенца";
    if (/шторы|штор/.test(rawLower)) return "Шторы";
    if (/текстил/.test(rawLower)) return "Текстиль";
    if (/постел/.test(rawLower)) return "Постельное";
    return "Подушки";
  }
  if (niche === "furniture") {
    if (/диван/.test(rawLower)) return "Диваны";
    if (/кровать|кроват/.test(rawLower)) return "Кровати";
    if (/шкаф/.test(rawLower)) return "Шкафы";
    if (/стол /.test(rawLower)) return "Столы";
    if (/кресл/.test(rawLower)) return "Кресла";
    if (/стеллаж/.test(rawLower)) return "Стеллажи";
    return "Мебель";
  }
  if (niche === "food") {
    if (/суши|роллы/.test(rawLower)) return "Суши";
    if (/пицц/.test(rawLower)) return "Пицца";
    if (/бургер/.test(rawLower)) return "Бургеры";
    if (/торт/.test(rawLower)) return "Торты";
    if (/выпечк|кондитер/.test(rawLower)) return "Выпечка";
    if (/шаурм/.test(rawLower)) return "Шаурма";
    return "Еда";
  }
  if (niche === "clothing") {
    if (/обув/.test(rawLower)) return "Обувь";
    if (/куртк/.test(rawLower)) return "Куртки";
    if (/платье/.test(rawLower)) return "Платья";
    if (/джинс/.test(rawLower)) return "Джинсы";
    if (/футболк/.test(rawLower)) return "Футболки";
    return "Одежда";
  }
  if (niche === "electronics") {
    if (/телефон|смартфон/.test(rawLower)) return "Смартфоны";
    if (/ноутбук/.test(rawLower)) return "Ноутбуки";
    if (/планшет/.test(rawLower)) return "Планшеты";
    if (/наушник/.test(rawLower)) return "Наушники";
    return "Электроника";
  }
  if (niche === "fitness") {
    if (/йог/.test(rawLower)) return "Йога";
    if (/бокс/.test(rawLower)) return "Бокс";
    return "Фитнес";
  }
  if (niche === "travel") {
    if (/путёвк|путевк/.test(rawLower)) return "Путёвки";
    if (/отель|гостиниц/.test(rawLower)) return "Отели";
    return "Туры";
  }
  if (niche === "automotive") {
    if (/шиномонтаж/.test(rawLower)) return "Шиномонтаж";
    if (/кузовн/.test(rawLower)) return "Кузовной ремонт";
    if (/аренда авто|car rental/.test(rawLower)) return "Аренда авто";
    if (/подбор авто/.test(rawLower)) return "Подбор авто";
    return "Автомобили";
  }
  if (niche === "beauty") {
    if (/маникюр/.test(rawLower)) return "Маникюр";
    if (/парикмахер|барбер/.test(rawLower)) return "Стрижки";
    if (/косметолог/.test(rawLower)) return "Косметология";
    return "Красота";
  }

  // ── Education / courses ────────────────────────────────────────────────────
  if (/обучени|курс|тренинг/.test(lower)) {
    const m = lower.match(/^обучени[ею]\s+(.+)$/);
    if (m) {
      const subj = cap(m[1].trim());
      if (subj.length <= 16) return subj;
      return truncWords(subj, 16);
    }
  }

  // ── Delivery ───────────────────────────────────────────────────────────────
  if (/доставк/.test(lower)) {
    const core = coreProduct(product);
    if (core !== product && core.length <= 16) return core;
  }

  // ── Agency / агентство ────────────────────────────────────────────────────
  const agencyMatch = lower.match(/агентство\s+(?:по\s+(?:продаже|подбору|аренде|управлению)\s+)?(.+)/);
  if (agencyMatch) {
    const noun = cap(agencyMatch[1].trim());
    if (noun.length <= 16) return noun;
    return truncWords(noun, 16);
  }

  // ── Fallback ───────────────────────────────────────────────────────────────
  const core = coreProduct(product);
  if (core !== product && core.length <= 16) return core;
  if (product.length <= 16) return product;
  return truncWords(product, 16);
}

/** Strip leading service verb (доставка, аренда, …) to get core product noun */
function coreProduct(product: string): string {
  const prefixes = [
    "доставка ", "аренда ", "ремонт ", "установка ", "монтаж ",
    "обслуживание ", "услуги ", "продажа ", "производство ",
    "изготовление ", "покупка ", "строительство ",
    "проектирование ", "разработка ", "создание ",
  ];
  const lower = product.toLowerCase();
  for (const prefix of prefixes) {
    if (lower.startsWith(prefix)) {
      const stripped = product.slice(prefix.length).trim();
      if (stripped.length > 0) return cap(stripped);
    }
  }
  return product;
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
    /^у меня\s+бизнес\s+/i, /^у нас\s+бизнес\s+/i,
    /^у меня\s+/i, /^у нас\s+/i,
    /^я продаю\s+/i, /^мы продаём?\s+/i, /^продаём?\s+/i, /^продаю\s+/i, /^продаем\s+/i,
    /^я занимаюсь\s+/i, /^мы занимаемся\s+/i, /^занимаюсь\s+/i, /^занимаемся\s+/i,
    /^открыл(?:а|и)?\s+/i, /^есть\s+/i, /^имею\s+/i, /^имеем\s+/i,
    /^предоставляю\s+/i, /^предоставляем\s+/i,
    /^оказываю\s+/i, /^оказываем\s+/i,
    /^работаю\s+(?:в\s+сфере\s+)?/i, /^работаем\s+(?:в\s+сфере\s+)?/i,
    /^нужна реклама для\s+/i, /^реклама для\s+/i, /^хочу рекламировать\s+/i,
    /^рекламирую\s+/i, /^запускаю\s+/i,
    /^мой бизнес[:\s]+/i, /^наш бизнес[:\s]+/i,
    /^я предлагаю\s+/i, /^мы предлагаем\s+/i, /^предлагаю\s+/i,
    // Remove "в городе" / "в стране" location helper phrases
    /\bв\s+городе\s+/gi, /\bв\s+стране\s+/gi,
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
  // Remove leading prepositions left behind ("по", "с", "в", "об", "о")
  result = result.replace(/^(?:по|с|в|во|из|для|об|о)\s+/i, "");
  return result.replace(/\s{2,}/g, " ").trim();
}

/**
 * Normalize education/course phrases to extract the real subject.
 *
 * Examples:
 *   "бизнес курсы по обучению криптовалюте" → "обучение криптовалюте"
 *   "курсы по инвестициям"                  → "обучение инвестициям"
 *   "бизнес курсы английского"              → "курс английского"
 *   "обучение по крипте"                    → "обучение крипте"
 *   "тренинг по маркетингу"                 → "обучение маркетингу"
 *
 * Test case:
 *   Input:    "бизнес курсы по обучению криптовалюте в кишинёве"
 *   After city strip: "бизнес курсы по обучению криптовалюте"
 *   After normalization: "обучение криптовалюте"
 *   Expected product: "Обучение криптовалюте"
 *   Expected category: crypto
 *   Expected location: Кишинёв / Moldova (MD)
 */
function normalizeEducationPhrase(text: string): string {
  let t = text.trim();

  // "бизнес курсы по обучению X" → "обучение X"
  t = t.replace(/^бизнес[-\s]+курс[ыа]?\s+по\s+обучению\s+/i, "обучение ");
  // "бизнес курсы по X" → "обучение X"
  t = t.replace(/^бизнес[-\s]+курс[ыа]?\s+по\s+/i, "обучение ");
  // "бизнес курсы X" → "курс X" (drop "бизнес" before "курс")
  t = t.replace(/^бизнес[-\s]+(?=курс)/i, "");

  // "курсы по обучению X" → "обучение X"
  t = t.replace(/^курс[ыа]?\s+по\s+обучению\s+/i, "обучение ");
  // "курсы по X" → "обучение X"
  t = t.replace(/^курс[ыа]?\s+по\s+/i, "обучение ");

  // "обучению X" at start (dative) → "обучение X"
  t = t.replace(/^обучению\s+/i, "обучение ");
  // "обучение по X" → "обучение X"
  t = t.replace(/^обучени[ею]\s+по\s+/i, "обучение ");

  // "тренинг по X" / "вебинар по X" → "обучение X"
  t = t.replace(/^тренинг[иа]?\s+по\s+/i, "обучение ");
  t = t.replace(/^вебинар[ыа]?\s+по\s+/i, "обучение ");

  // Strip any remaining dangling leading prepositions
  t = t.replace(/^(?:по|с|об|о)\s+/i, "");

  return t.replace(/\s{2,}/g, " ").trim();
}

export function extractProductOrService(
  rawInput: string,
  city: CityEntry | null,
  audience: AudienceEntry | null
): { short: string; full: string } {
  let text = rawInput;

  // 1. Remove city references
  if (city) text = stripCityFromText(text, city);

  // 2. Remove country name mentions (so "бизнес по продаже подушек молдова"
  //    doesn't end up with "молдова" in the product name)
  text = stripCountryRefsFromText(text);

  // 3. Remove audience
  if (audience) text = stripAudienceFromText(text, audience);

  // 4. Normalize business intro phrases
  //    "бизнес по продаже подушек" → "подушки"
  //    "магазин игрушек" → "игрушки"
  text = normalizeBusinessPhrase(text);

  // 5. Strip remaining intro/filler phrases
  text = stripIntros(text);

  // 6. Normalize education/course phrases ("курсы по X" → "обучение X")
  text = normalizeEducationPhrase(text);

  // 7. Clean up
  text = text.replace(/[,.:;!?]+$/, "").replace(/^[,.:;!?\s]+/, "").trim();

  if (!text) text = rawInput.trim();

  const full = truncWords(cap(text), 28);
  return { short: full, full };
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

  // Always resolve country nominals (regardless of city)
  const countryEntry = countryCode ? COUNTRY_LOC[countryCode] : undefined;
  const countryNameRu = countryEntry?.nominRu ?? null;
  const countryNameEn = countryEntry?.nominEn ?? null;

  // Fall back to country-level location when no city found
  if (!city && countryEntry) {
    cityLocRu = countryEntry.ru;
    cityNameRu = countryEntry.nominRu;
    cityNameEn = countryEntry.nominEn;
  }

  const nicheCategory = detectNicheCategory(niche);
  const productShort = deriveShortProduct(short, sensitive, nicheCategory, niche);

  return {
    rawInput: niche,
    outputLang,
    product: short,
    productShort,
    productDesc: full,
    cityLocRu,
    cityNameRu,
    cityNameEn,
    countryCode: countryCode ?? "",
    countryNameRu,
    countryNameEn,
    audienceRu: audience?.ruPhrase ?? null,
    audienceEn: audience?.enPhrase ?? null,
    sensitive,
    niche: nicheCategory,
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

/** Add ±2 point jitter to ~40% of candidates for variation between runs */
function jitter(score: number): number {
  if (Math.random() < 0.4) {
    return score + (Math.random() < 0.5 ? 1 : -1) * (Math.random() < 0.5 ? 1 : 2);
  }
  return score;
}

function generateUniversalHeadlines(ctx: BusinessContext): HeadlineCandidate[] {
  const {
    product, productShort, outputLang: lang,
    cityLocRu, cityNameRu, cityNameEn,
    countryCode, countryNameRu, countryNameEn,
    audienceRu, audienceEn,
    sensitive, niche, isOnline, isCourse,
  } = ctx;

  // Short product label for compact location templates (≤16 chars)
  const ps = productShort;

  const aud     = lang === "ru" ? audienceRu   : audienceEn;
  const acc     = lang === "ru" ? accRu(product) : product;
  const gen     = lang === "ru" ? genRu(product) : product;
  const core    = coreProduct(product);
  const coreAcc = core !== product && lang === "ru" ? accRu(core) : core;

  // Suppress "Аренда" prefix for service niches where renting makes no sense
  const noАренда = sensitive === "medical" || sensitive === "legal" ||
                   sensitive === "finance" || sensitive === "crypto";

  // Suppress guaranteed-outcome / profit claims for regulated categories
  const noUnsafeModifiers = sensitive === "crypto" || sensitive === "finance" ||
                             sensitive === "medical" || sensitive === "legal";

  const candidates: HeadlineCandidate[] = [];
  const add = (text: string | null, score: number, tip: string) => {
    if (text && text.length >= 3 && text.length <= 30) candidates.push({ text, score: jitter(score), tip });
  };

  if (lang === "ru") {
    // ── Crypto-specific safe education headlines (highest priority) ───────────
    if (sensitive === "crypto") {
      const cryptoLoc = cityLocRu ?? (countryNameRu ? `в ${countryNameRu}` : null);
      const cryptoCity = cityNameRu ?? countryNameRu ?? null;
      // Static safe crypto education headlines
      add("Обучение криптовалюте",           99, "Прямое название ниши — максимальное совпадение с запросом");
      add("Основы криптовалют",              98, "Основы — безопасный образовательный фрейм");
      add("Крипто курс для новичков",        97, "Курс + аудитория новичков — высокий CTR в EdTech");
      add("Крипто обучение онлайн",          96, "Онлайн + обучение — широкий охват для дистанционного формата");
      add("Разберите риски крипты",          96, "Риски — соответствует требованиям политики Google Ads");
      add("Блокчейн для начинающих",         95, "Блокчейн + аудитория — техническая аудитория с высоким CPC");
      add("Криптовалюта простыми словами",   95, "Простые слова — снижает барьер входа для широкой аудитории");
      add("Вводный урок по крипте",          94, "Вводный урок — мягкий первый шаг, высокий CTR");
      add("Обучение крипте с нуля",          94, "С нуля — самый частый запрос у начинающих");
      add("Криптовалюта без сложных слов",   93, "Простота подачи — ключевой УТП для крипто-EdTech");
      add("Крипто знания для старта",        92, "Для старта — четкий CTA для новичков");
      add("Как работает криптовалюта",       92, "Информационный запрос — высокий объём поиска");
      add("Курс по блокчейну",               91, "Блокчейн-ключевое слово для технически подкованной аудитории");
      add("Основы Web3 и крипты",            90, "Web3 — привлекает технически грамотную аудиторию");
      // Location-aware variants
      if (cryptoLoc) add(fit(`Курс по крипте ${cryptoLoc}`), 97, "Курс + геолокация — точное попадание в гео-запрос");
      if (cryptoCity) add(fit(`Обучение крипте ${cryptoCity}`), 95, "Обучение + город — локальный охват");
      if (cryptoCity) add(fit(`Крипто курс ${cryptoCity}`), 94, "Курс + город — геолокационный сигнал");
    }

    // ── Tier 1: Product + city (score 89–95) ──────────────────────────────────
    if (cityLocRu && cityNameRu) {
      // Use full product name first; fall back to ps when product+loc exceeds 30 chars
      add(fit(`${product} ${cityLocRu}`) ?? fit(`${ps} ${cityLocRu}`),             95, "Геолокация + продукт — точное совпадение с поисковым запросом");
      add(fit(`${product} ${cityNameRu}`) ?? fit(`${ps} ${cityNameRu}`),           93, "Продукт + город (именительный) — широкое совпадение без предлога");
      if (!noАренда) add(fit(`Аренда ${gen} ${cityNameRu}`),                       91, "Аренда + генитив + город — формула для техники и оборудования");
      add(fit(`Услуги ${gen} ${cityNameRu}`) ?? fit(`${ps} — услуги ${cityNameRu}`), 91, "Услуги + генитив + город — универсальная сервисная формула");
      add(fit(`Заказать ${acc} ${cityNameRu}`) ?? fit(`${ps} ${cityNameRu}`),      89, "Заказать + аккузатив + город — прямой CTA с геолокацией");
    } else if (cityLocRu) {
      add(fit(`${product} ${cityLocRu}`) ?? fit(`${ps} ${cityLocRu}`),             95, "Геолокация + продукт — точное совпадение с поисковым запросом");
    }

    // ── Tier 2: Product + country (score 84–90) ───────────────────────────────
    const countryEntry = countryCode ? COUNTRY_LOC[countryCode] : undefined;
    const cntLocRu = countryEntry?.ru ?? null;
    if (cntLocRu && countryNameRu && countryNameRu !== cityNameRu) {
      add(fit(`${product} ${cntLocRu}`) ?? fit(`${ps} ${cntLocRu}`),              90, "Продукт + страна (локатив) — региональный охват");
      add(fit(`${product} ${countryNameRu}`) ?? fit(`${ps} ${countryNameRu}`),    88, "Продукт + страна (именительный) — широкий охват");
      if (countryCode.length <= 3) {
        add(fit(`${ps} ${countryCode}`),              86, "Короткий продукт + код страны — компактный геосигнал");
        add(fit(`Услуги ${gen} ${countryCode}`) ?? fit(`${ps} — ${countryCode}`), 85, "Услуги + генитив + код страны");
        if (!noАренда) add(fit(`Аренда ${gen} ${countryCode}`),                   84, "Аренда + генитив + код страны");
      }
    }

    // ── Tier 3: Service-prefix variants without location (score 80–84) ────────
    if (!noАренда) add(fit(`Аренда ${gen}`),          83, "Аренда + генитив — ключевая формула для техники");
    add(fit(`Услуги ${gen}`),                         82, "Услуги + генитив — универсальная сервисная формула");
    add(fit(`Заказать ${acc}`),                       82, "Заказать + аккузатив — прямой призыв к покупке");
    add(fit(`Профессиональный ${acc}`),               80, "Профессиональный — сигнал качества и экспертизы");

    // ── Tier 4: Product modifiers (score 76–84) ───────────────────────────────
    if (!noUnsafeModifiers) {
      add(fit(`${product} с оператором`),             84, "С оператором — ключевой признак для спецтехники");
      add(fit(`${product} под ключ`),                 83, "Под ключ — сигнал комплексного решения");
      add(fit(`${product} с гарантией`),              82, "Гарантия — снятие возражения по качеству");
    }
    add(fit(`${product} от специалиста`),             81, "От специалиста — сигнал экспертизы и опыта");
    add(fit(`${product} под задачу`),                 80, "Под задачу — акцент на индивидуальном подходе");
    add(fit(`${product} срочно`),                     79, "Срочно — высокий CTR для неотложных запросов");
    if (!noUnsafeModifiers) {
      add(fit(`${product} по выгодной цене`),         78, "Выгодная цена — ценностное предложение");
      add(fit(`${product} без предоплаты`),           77, "Без предоплаты — снятие финансового барьера");
      add(fit(`${product} с выездом`),                76, "Выезд — ключевой признак для выездных услуг");
    }

    // ── Tier 5: Audience ──────────────────────────────────────────────────────
    if (aud) {
      add(fit(`${product} ${aud}`),                   88, "Продукт + аудитория — высокая релевантность для сегмента");
      add(fit(`${acc} ${aud}`),                       82, "Аккузатив + аудитория — акцент на целевой группе");
    }

    // ── Tier 6: Online / course ───────────────────────────────────────────────
    if (isOnline || isCourse) {
      add(fit(`${product} онлайн`),                   86, "Онлайн повышает CTR для дистанционных сервисов");
    }
    if (isCourse) {
      add(fit(`Запишитесь: ${product}`),              90, "«Запишитесь» — самый конверсионный CTA для курсов");
      add(fit(`${product} — начни сейчас`),           88, "Срочность + обучение = высокий CTR в EdTech");
    }

    // ── Tier 7: Core product for compound inputs (e.g. "доставка суши") ──────
    if (core !== product) {
      if (cityNameRu) {
        add(fit(`${core} с доставкой ${cityNameRu}`), 87, "Базовый продукт + доставка + город");
        add(fit(`Заказать ${coreAcc} ${cityNameRu}`), 86, "Заказать базовый продукт + город");
      }
      add(fit(`${core} с доставкой`),                 84, "Базовый продукт с доставкой");
      add(fit(`Заказать ${coreAcc} онлайн`),          82, "Заказать базовый продукт онлайн");
    }

    // ── Tier 8: Sensitive-category specific ───────────────────────────────────
    if (sensitive === "medical") {
      add(fit(`${product}: запись онлайн`),           91, "Запись к специалисту онлайн — безопасный фрейм");
      add(fit(`Запись к специалисту`),                88, "«Специалист» вместо «врач» — нейтральнее для модерации");
      add(fit(`${product}: консультация`),            86, "Консультация — безопасный первый шаг в медтеме");
    }
    if (sensitive === "legal") {
      add(fit(`Задайте вопрос юристу`),               88, "«Вопрос» снимает правовую ответственность за совет");
      add(fit(`${product}: задать вопрос`),           85, "Продукт + первый шаг для юридических услуг");
    }
    if (sensitive === "finance" || sensitive === "crypto") {
      add(fit(`Узнайте условия и риски`),             85, "Риски — соответствует политике Google для финансов");
      add(fit(`${product}: образовательный курс`),    82, "Образовательный фрейм снижает риск отклонения");
    }
    if (sensitive === "realestate") {
      const rCity  = cityNameRu   ?? null;
      const rCCode = countryCode  ?? null;
      const rCName = countryNameRu ?? null;
      // Location combos with short label (always ≤30 chars)
      if (rCity) {
        add(fit(`${ps} в ${rCity}`),                 95, "Короткий продукт + город — прямое попадание в гео-запрос");
        add(fit(`Подбор жилья ${rCity}`),            94, "Подбор жилья + город — сильная сервисная формула");
        add(fit(`Недвижимость ${rCity}`),            93, "Недвижимость + город — широкий охват по категории");
        add(fit(`Новостройки ${rCity}`),             92, "Новостройки — популярный сегмент первичного рынка");
        add(fit(`Купить ${ps.toLowerCase()} ${rCity}`), 91, "Купить + тип жилья + город — транзакционный запрос");
        add(fit(`Риелтор ${rCity}`),                 90, "Риелтор + город — профессиональный сигнал доверия");
        add(fit(`Жильё ${rCity}`),                   89, "Жильё + город — широкое информационное совпадение");
        add(fit(`${ps} рядом с центром`),            87, "Рядом с центром — ключевой локационный фильтр");
      }
      if (rCCode && rCCode.length <= 3) {
        add(fit(`Подбор жилья ${rCCode}`),           93, "Подбор жилья + код страны — компактный геосигнал");
        add(fit(`${ps} ${rCCode}`),                  91, "Тип жилья + код страны — широкий страновой охват");
        add(fit(`Недвижимость ${rCCode}`),           90, "Недвижимость + код — национальный охват");
        add(fit(`Купить ${ps.toLowerCase()} ${rCCode}`), 89, "Купить + тип + код страны — транзакционный запрос");
        add(fit(`Вторичное жильё ${rCCode}`),        88, "Вторичный рынок — отдельный высоковолюмный сегмент");
      }
      if (rCName && rCName !== rCity) {
        add(fit(`Жильё в ${rCName}`),                88, "Жильё + страна — национальный охват");
        add(fit(`Недвижимость ${rCName}`),           87, "Недвижимость + страна — широкий страновой охват");
      }
      // Universal real estate CTAs
      add("Агентство недвижимости",                  88, "Прямое название категории — точное совпадение с запросом");
      add(`${ps} онлайн подбор`,                     87, "Онлайн подбор — снижает барьер для начала поиска");
      add("Помощь в выборе жилья",                   86, "Помощь — мягкий фрейм без давления");
      add(`${ps} для семьи`,                         85, "Для семьи — аудиторный сигнал, повышает релевантность");
      add("Недвижимость под бюджет",                 84, "Под бюджет — снятие ценового возражения");
      add("Подберите квартиру",                      82, "Императив — прямой CTA с низким барьером");
      add(`${ps}: подбор объектов`,                  81, "Подбор объектов — мягкий CTA для недвижимости");
      add(`${ps} без посредников`,                   80, "Без посредников — сильный дифференциатор");
    }

    // ── Cars / auto specific ──────────────────────────────────────────────────
    if (/автомобил|машин|авто[^р]|шиномонтаж|кузовн/.test(ctx.rawInput.toLowerCase())) {
      const aCCity = cityNameRu ?? null;
      const aCCode = countryCode ?? null;
      if (aCCity) {
        add(fit(`${ps} ${aCCity}`),                  94, "Тип авто + город — точное попадание в гео-запрос");
        add(fit(`Авто сервис ${aCCity}`),            91, "Авто сервис + город — поисковая формула для ремонта");
        add(fit(`Покупка авто ${aCCity}`),           89, "Покупка авто + город — транзакционный запрос");
      }
      if (aCCode && aCCode.length <= 3) {
        add(fit(`${ps} ${aCCode}`),                  90, "Тип авто + код страны — региональный охват");
        add(fit(`Подбор авто ${aCCode}`),            88, "Подбор авто + код — сервисная формула");
      }
      add("Авто под ваш запрос",                     86, "Персонализация — сильный сигнал для авторынка");
      add("Проверка авто перед покупкой",            85, "Проверка — снятие риска для покупателя");
      add(`${ps}: тест-драйв онлайн`,                83, "Тест-драйв — мягкий первый шаг");
      add("Авто с гарантией пробега",                82, "Гарантия пробега — снятие возражения о техсостоянии");
      add(`${ps} в наличии`,                         81, "В наличии — сигнал готовности к сделке");
    }

    // ── Beauty / salon specific ───────────────────────────────────────────────
    if (/салон красот|парикмахер|маникюр|педикюр|косметолог|барбер/.test(ctx.rawInput.toLowerCase())) {
      const bCity = cityNameRu ?? null;
      const bCCode = countryCode ?? null;
      if (bCity) {
        add(fit(`${ps} ${bCity}`),                   94, "Услуга красоты + город — точное гео-совпадение");
        add(fit(`Салон красоты ${bCity}`),           91, "Салон красоты + город — категорийный запрос");
      }
      if (bCCode && bCCode.length <= 3) {
        add(fit(`${ps} ${bCCode}`),                  90, "Услуга + код страны — региональный охват");
      }
      add(`${ps} онлайн запись`,                     88, "Онлайн запись — снижает барьер первого контакта");
      add("Запись к мастеру онлайн",                 87, "Запись к мастеру — прямой CTA для бьюти-услуг");
      add(`${ps} без очереди`,                       85, "Без очереди — ключевой УТП для салонов");
      add(`${ps} от профессионала`,                  84, "Профессионал — сигнал экспертизы");
      add("Акция на первый визит",                   83, "Акция на первый визит — снижает барьер конверсии");
    }

    // ── Niche: Home goods (подушки, матрасы, текстиль, …) ───────────────────
    if (niche === "homegoods") {
      const hCity  = cityNameRu  ?? null;
      const hCCode = countryCode ?? null;
      const hCName = countryNameRu ?? null;
      // Location combos
      if (hCity) {
        add(fit(`${ps} в ${hCity}`),               95, "Тип товара + город — точное гео-совпадение");
        add(fit(`Товары для сна ${hCity}`),        93, "Товары для сна + город — семантическое расширение");
        add(fit(`Магазин ${ps.toLowerCase()} ${hCity}`), 91, "Магазин + тип + город — категорийный запрос");
        add(fit(`${ps} с доставкой ${hCity}`),    90, "С доставкой + город — транзакционный сигнал");
      }
      if (hCCode && hCCode.length <= 3) {
        add(fit(`Товары для сна ${hCCode}`),       93, "Семантический кластер + код страны — широкий охват");
        add(fit(`${ps} с доставкой ${hCCode}`),   91, "С доставкой + код страны — страновой охват");
        add(fit(`${ps} ${hCCode}`),               90, "Тип товара + код страны — компактный геосигнал");
        add(fit(`Постельные товары ${hCCode}`),   89, "Постельные товары — широкая категория");
      }
      if (hCName && hCName !== hCity) {
        add(fit(`${ps} ${hCName}`),               92, "Тип товара + страна — страновой охват");
        add(fit(`Товары для дома ${hCName}`),     90, "Товары для дома + страна — семантическое расширение");
      }
      // Semantic / use-case
      add(`Ортопедические ${ps.toLowerCase()}`,   94, "Ортопедический — ключевой квалификатор для сна");
      add(`${ps} для комфортного сна`,            93, "Комфортный сон — главный эмоциональный мотив покупки");
      add(`${ps} для интерьера`,                  90, "Интерьер — второй ключевой сегмент покупателей");
      add("Товары для дома онлайн",               89, "Онлайн магазин — широкий охват e-commerce запросов");
      add(`${ps} для всей семьи`,                 88, "Семья — аудиторный сигнал для домашних товаров");
      add(`${ps} для спальни`,                    87, "Спальня — конкретная локация использования");
      add("Домашний комфорт онлайн",              86, "Домашний комфорт — эмоциональный бренд-фрейм");
      add(`Подберите ${ps.toLowerCase()} онлайн`, 85, "Подбор + онлайн — мягкий призыв к действию");
      add(`${ps} под ваш стиль`,                  84, "Под ваш стиль — персонализация в домашних товарах");
      add("Уют для вашего дома",                  83, "Уют — ключевое слово категории home comfort");
      add(`${ps} в наличии`,                      82, "В наличии — сигнал готовности к отгрузке");
      add("Постельные принадлежности",            81, "Прямое название категории — точное совпадение");
    }

    // ── Niche: Furniture ──────────────────────────────────────────────────────
    if (niche === "furniture") {
      const fCity  = cityNameRu  ?? null;
      const fCCode = countryCode ?? null;
      const fCName = countryNameRu ?? null;
      if (fCity) {
        add(fit(`${ps} ${fCity}`),                 94, "Тип мебели + город — прямое гео-совпадение");
        add(fit(`Мебель в ${fCity}`),              92, "Мебель + город — широкий категорийный запрос");
        add(fit(`${ps} с доставкой ${fCity}`),    90, "С доставкой + город — транзакционный сигнал");
      }
      if (fCCode && fCCode.length <= 3) {
        add(fit(`${ps} ${fCCode}`),               91, "Тип мебели + код страны");
        add(fit(`Мебель ${fCCode}`),              89, "Мебель + код страны — широкий охват");
      }
      if (fCName && fCName !== fCity) {
        add(fit(`${ps} ${fCName}`),               90, "Тип мебели + страна — страновой охват");
        add(fit(`Мебель в ${fCName}`),            88, "Мебель + страна — категорийный страновой запрос");
      }
      add(`${ps} под заказ`,                      93, "Под заказ — высокий CTR для мебельной ниши");
      add(`${ps} на любой вкус`,                  89, "Любой вкус — сигнал широкого ассортимента");
      add("Мебель от производителя",              88, "Производитель — сигнал низкой цены");
      add(`${ps} с установкой`,                   87, "Установка — снятие барьера сборки");
      add("Мебель онлайн с доставкой",            86, "Онлайн + доставка — ключевой e-com паттерн");
      add(`${ps} для вашего дома`,                85, "Для дома — ключевой контекст мебельных покупок");
      add("Качественная мебель онлайн",           83, "Качество — главное возражение при онлайн-покупке мебели");
    }

    // ── Niche: Food & delivery ────────────────────────────────────────────────
    if (niche === "food") {
      const fdCity  = cityNameRu  ?? null;
      const fdCCode = countryCode ?? null;
      if (fdCity) {
        add(fit(`${ps} в ${fdCity}`),              95, "Еда + город — прямое гео-совпадение");
        add(fit(`Доставка ${ps.toLowerCase()} ${fdCity}`), 94, "Доставка + еда + город — транзакционный запрос");
        add(fit(`${ps} с доставкой ${fdCity}`),   93, "С доставкой + город — популярный паттерн поиска");
        add(fit(`Заказать ${ps.toLowerCase()} ${fdCity}`), 91, "Заказать + еда + город — прямой CTA");
      }
      if (fdCCode && fdCCode.length <= 3) {
        add(fit(`${ps} с доставкой ${fdCCode}`),  91, "С доставкой + код страны — страновой охват");
        add(fit(`Доставка еды ${fdCCode}`),       89, "Доставка еды + код — широкая категория");
      }
      add(`${ps} с доставкой на дом`,             93, "С доставкой на дом — ключевой паттерн food delivery");
      add(`${ps} — заказ онлайн`,                 91, "Онлайн заказ — основной путь конверсии в food");
      add("Быстрая доставка еды",                 89, "Быстрая — ключевой дифференциатор в food delivery");
      add(`Свежие ${ps.toLowerCase()} онлайн`,    87, "Свежие — качественный сигнал для продуктов питания");
      add("Еда у вас дома за 30 минут",           85, "Конкретное время — повышает доверие");
      add(`Вкусные ${ps.toLowerCase()} онлайн`,   84, "Вкусные — эмоциональный триггер");
    }

    // ── Niche: Clothing / fashion ─────────────────────────────────────────────
    if (niche === "clothing") {
      const clCity  = cityNameRu  ?? null;
      const clCCode = countryCode ?? null;
      const clCName = countryNameRu ?? null;
      if (clCity) {
        add(fit(`${ps} ${clCity}`),                94, "Тип одежды + город — гео-запрос");
        add(fit(`Магазин ${ps.toLowerCase()} ${clCity}`), 91, "Магазин + тип + город — категорийный запрос");
      }
      if (clCCode && clCCode.length <= 3) {
        add(fit(`${ps} ${clCCode}`),               92, "Тип одежды + код страны");
        add(fit(`Мода и стиль ${clCCode}`),        87, "Мода + код — широкий охват фэшн-категории");
      }
      if (clCName && clCName !== clCity) {
        add(fit(`${ps} ${clCName}`),               90, "Тип одежды + страна");
      }
      add(`${ps} онлайн с доставкой`,             93, "Онлайн + доставка — ключевой e-com паттерн");
      add(`${ps} по выгодным ценам`,              91, "Цена — главный мотив online fashion shopping");
      add(`${ps} для любого сезона`,              89, "Для любого сезона — широта ассортимента");
      add(`Стильные ${ps.toLowerCase()}`,         88, "Стильные — ключевой квалификатор фэшн-ниши");
      add("Большой выбор одежды онлайн",          86, "Большой выбор — снятие возражения ассортимента");
      add(`${ps} с быстрой доставкой`,            85, "Быстрая доставка — ключевой дифференциатор");
      add(`${ps} любого размера`,                 84, "Любой размер — инклюзивный сигнал");
    }

    // ── Niche: Electronics ────────────────────────────────────────────────────
    if (niche === "electronics") {
      const elCity  = cityNameRu  ?? null;
      const elCCode = countryCode ?? null;
      const elCName = countryNameRu ?? null;
      if (elCity) {
        add(fit(`${ps} в ${elCity}`),              94, "Электроника + город — гео-запрос");
        add(fit(`Купить ${ps.toLowerCase()} ${elCity}`), 92, "Купить + товар + город — транзакционный запрос");
        add(fit(`${ps} с доставкой ${elCity}`),   90, "С доставкой + город — e-com паттерн");
      }
      if (elCCode && elCCode.length <= 3) {
        add(fit(`${ps} ${elCCode}`),              91, "Электроника + код страны");
        add(fit(`Купить ${ps.toLowerCase()} ${elCCode}`), 89, "Купить + электроника + код страны");
      }
      if (elCName && elCName !== elCity) {
        add(fit(`${ps} ${elCName}`),              90, "Электроника + страна");
      }
      add(`${ps} с гарантией`,                    92, "Гарантия — ключевой фактор при покупке электроники");
      add(`${ps} по лучшей цене`,                 90, "Цена — главный мотив при выборе электроники");
      add(`Новые ${ps.toLowerCase()} онлайн`,     89, "Новые + онлайн — свежий ассортимент");
      add(`${ps} с быстрой доставкой`,            88, "Быстрая доставка — ключевой дифференциатор");
      add("Выгодная цена на электронику",         86, "Выгодная цена — широкая категория");
      add(`${ps} в наличии`,                      85, "В наличии — сигнал готовности к отгрузке");
      add("Техника с официальной гарантией",      84, "Официальная гарантия — снятие главного возражения");
    }

    // ── Niche: Fitness ────────────────────────────────────────────────────────
    if (niche === "fitness") {
      const ftCity  = cityNameRu  ?? null;
      const ftCCode = countryCode ?? null;
      if (ftCity) {
        add(fit(`${ps} ${ftCity}`),                93, "Фитнес + город — гео-запрос");
        add(fit(`Запись в ${ps.toLowerCase()} ${ftCity}`), 91, "Запись + фитнес + город — прямой CTA");
      }
      if (ftCCode && ftCCode.length <= 3) {
        add(fit(`${ps} ${ftCCode}`),              90, "Фитнес + код страны");
      }
      add(`${ps} для начинающих`,                 92, "Для начинающих — самый высоковолюмный сегмент");
      add(`${ps} онлайн и офлайн`,                89, "Онлайн и офлайн — гибкость формата");
      add(`Записаться в ${ps.toLowerCase()}`,     88, "CTA с именем продукта — прямое действие");
      add("Первая тренировка бесплатно",          87, "Бесплатный первый шаг — снятие барьера входа");
      add(`${ps} с персональным планом`,          85, "Персональный план — дифференциатор");
      add("Тренируйтесь в своём темпе",           83, "Гибкость — ключевая ценность для начинающих");
    }

    // ── Niche: Travel ─────────────────────────────────────────────────────────
    if (niche === "travel") {
      const tvCity  = cityNameRu  ?? null;
      const tvCCode = countryCode ?? null;
      if (tvCity) {
        add(fit(`${ps} из ${tvCity}`),             94, "Туры из города — прямой гео-запрос");
        add(fit(`Отдых из ${tvCity}`),             91, "Отдых из города — семантическое расширение");
      }
      if (tvCCode && tvCCode.length <= 3) {
        add(fit(`${ps} из ${tvCCode}`),           92, "Туры + код страны — страновой охват");
      }
      add(`${ps} онлайн с подбором`,              91, "Онлайн подбор — ключевой паттерн тревел");
      add("Горящие путёвки онлайн",               90, "Горящие — высокочастотный запрос в туризме");
      add(`Найдите ${ps.toLowerCase()} мечты`,    88, "Эмоциональный фрейм — высокий CTR в туризме");
      add(`${ps} по вашему бюджету`,              87, "По бюджету — снятие ценового возражения");
      add("Путешествие с нами",                   83, "Мы — мягкий бренд-фрейм");
    }

    // ── Tier 9: Product-referenced short CTAs ────────────────────────────────
    add(fit(`${ps}: оставьте заявку`) ?? fit(`${product}: оставьте заявку`), 77, "Продукт + CTA — всегда релевантно");
    add(fit(`${ps} в наличии`) ?? fit(`${product} в наличии`),               75, "В наличии — сигнал готовности к поставке");
    add(fit(`Купить ${ps.toLowerCase()} онлайн`),                            74, "Купить + онлайн — транзакционный запрос");

    // ── Tier 10: Fill to 15 with ps-based templates if still short ────────────
    const fillRu: [string, number, string][] = [
      [`${ps} — быстрая доставка`,           73, "Быстрая доставка — универсальный дифференциатор"],
      [`${ps} по доступной цене`,            72, "Доступная цена — снятие ценового барьера"],
      [`${ps} с гарантией качества`,         71, "Гарантия качества — снятие возражения"],
      ["Оставьте заявку онлайн",             70, "Прямой CTA с низким порогом"],
      ["Получите консультацию",              69, "Консультация как первый шаг"],
      ["Подберите вариант онлайн",           68, "Мягкий призыв без давления"],
      ["Сравните варианты сегодня",          67, "Фрейм сравнения"],
      [`${ps} от надёжного продавца`,        66, "Надёжность — сигнал доверия"],
    ];
    // Only add fillers until we reach 15 unique candidates
    for (const [text, score, tip] of fillRu) {
      if (candidates.length >= 20) break; // keep pool to ~20, slice(0,15) later
      add(fit(text), score, tip);
    }

  } else {
    // ── English ───────────────────────────────────────────────────────────────

    // ── Crypto-specific safe education headlines (EN) ─────────────────────────
    if (sensitive === "crypto") {
      const cryptoCityEn = cityNameEn ?? countryNameEn ?? null;
      add("Learn Crypto Basics",              99, "Direct match for beginner crypto education search");
      add("Crypto Course for Beginners",      98, "Beginners framing — highest volume EdTech search term");
      add("Understand How Crypto Works",      97, "How-it-works frame — informational query match");
      add("Blockchain 101 Online",            96, "101 format signals beginner-friendly content");
      add("Crypto Without the Hype",          96, "Without hype — trust signal for risk-aware searchers");
      add("Understand Crypto Risks",          95, "Risk mention satisfies Google financial ad policy");
      add("Intro to Blockchain & Crypto",     95, "Intro framing — low barrier, high CTR for new audiences");
      add("Crypto Explained Simply",          94, "Simply — reduces perceived complexity barrier");
      add("Web3 & Crypto Basics",             93, "Web3 framing attracts tech-forward audiences");
      add("Start With Crypto Fundamentals",   92, "Fundamentals = safe educational framing");
      add("Crypto Knowledge for Beginners",   92, "Knowledge framing is low-risk for moderation");
      add("How Crypto Actually Works",        91, "Actually — conversational hook for organic CTR");
      add("Blockchain for Beginners",         91, "Blockchain keyword for technically minded audiences");
      add("Crypto Course — No Hype",          90, "No hype — differentiator for jaded searchers");
      if (cryptoCityEn) add(fit(`Crypto Course in ${cryptoCityEn}`), 97, "Crypto course + city — local search match");
      if (cryptoCityEn) add(fit(`Learn Crypto in ${cryptoCityEn}`),  95, "Learn + city — geo-targeted education");
    }

    // ── Tier 1: Location variants ──
    if (cityNameEn) {
      add(fit(`${product} in ${cityNameEn}`) ?? fit(`${ps} in ${cityNameEn}`),         95, "City + product — exact local search match");
      add(fit(`${product} ${cityNameEn}`) ?? fit(`${ps} ${cityNameEn}`),               93, "Product + city — broader local match");
      add(fit(`${ps} Services ${cityNameEn}`),                                          89, "Service + city — strong local keyword combo");
      add(fit(`Best ${ps} in ${cityNameEn}`),                                          87, "Best + product + city — quality local signal");
    }
    if (countryNameEn && countryNameEn !== cityNameEn) {
      add(fit(`${product} in ${countryNameEn}`) ?? fit(`${ps} in ${countryNameEn}`),   88, "Country + product — national reach");
      if (countryCode.length <= 3) {
        add(fit(`${ps} ${countryCode}`),                                               84, "Product + country code — compact geo signal");
      }
    }

    // ── Tier 2: Product modifiers ──
    add(fit(`${product} Online`) ?? fit(`${ps} Online`),                               87, "Online modifier boosts CTR for service businesses");
    add(fit(`${ps} Near You`),                                                         85, "Near you — triggers local intent algorithms");
    add(fit(`${ps} Today`),                                                            84, "Today urgency — drives impulse clicks");
    add(fit(`${ps} Specialists`),                                                      83, "Specialists framing = expertise signal");
    if (!noUnsafeModifiers) {
      add(fit(`${ps} With Guarantee`),                                                 82, "Guarantee removes the purchase objection");
    }
    add(fit(`Trusted ${ps}`),                                                          81, "Trusted = social proof framing");
    add(fit(`Fast ${ps}`),                                                             80, "Fast = urgency + quality signal");
    add(fit(`Professional ${ps}`),                                                     79, "Professional framing boosts perceived quality");

    // ── Tier 3: Action + product ──
    add(fit(`Buy ${ps} Online`),                                                       84, "Buy + Online — transactional keyword combo");
    add(fit(`Shop ${ps} Online`),                                                      83, "Shop Online — e-commerce CTA");
    add(fit(`Book ${ps} Online`),                                                      83, "Book CTA is low-friction for service businesses");
    add(fit(`Get ${ps} Quote`),                                                        82, "Quote CTA — matches high-purchase-intent search");
    add(fit(`Find ${ps} Now`),                                                         81, "Find + now = local intent + urgency");
    add(fit(`Compare ${ps} Options`),                                                  80, "Comparison frame for consideration-phase buyers");

    if (aud) add(fit(`${ps} ${aud}`),                                                  88, "Product + audience — high ad relevance score");

    if (isCourse) {
      add(fit(`Enroll: ${product}`) ?? fit(`Enroll: ${ps}`),                          90, "Enroll CTA is #1 for online education ads");
      add(fit(`${ps} — Start Today`),                                                  88, "Immediacy in EdTech = strong conversion hook");
    }
    if (sensitive === "medical") {
      add("Book a Specialist Online",                                                   88, "Specialist framing is safer than medical promises");
      add(fit(`${ps}: Book Online`),                                                   86, "Direct booking CTA for medical services");
    }
    if (sensitive === "legal") {
      add("Ask a Legal Question",                                                       88, "Question framing avoids unauthorized legal advice");
    }
    if (sensitive === "finance" || sensitive === "crypto") {
      add("Understand the Risks First",                                                 85, "Risk mention satisfies Google's financial policy");
      add(fit(`${ps}: Learn the Basics`),                                              83, "Educational framing reduces moderation risk");
    }

    // ── EN niche blocks ───────────────────────────────────────────────────────
    if (niche === "homegoods") {
      const hEn = cityNameEn ?? countryNameEn ?? null;
      const hCode = countryCode.length <= 3 ? countryCode : null;
      if (hEn) add(fit(`${ps} in ${hEn}`),                                             94, "Home goods + location — exact geo match");
      if (hCode) add(fit(`${ps} ${hCode}`),                                            91, "Product + country code — compact geo signal");
      add(`Orthopedic ${ps} Online`,                                                    93, "Orthopedic — key qualifier for sleep category");
      add(`${ps} for Better Sleep`,                                                     92, "Better sleep — primary purchase motivation");
      add(`${ps} for Your Home`,                                                        90, "For your home — universal home goods frame");
      add(`Premium ${ps} Online`,                                                       88, "Premium framing — quality signal");
      add(`${ps} with Fast Delivery`,                                                   87, "Fast delivery — key e-com differentiator");
      add(`Shop ${ps} Online`,                                                          85, "Shop + category — transactional search match");
      add("Home Comfort Essentials",                                                    83, "Comfort essentials — semantic cluster keyword");
    }
    if (niche === "food") {
      const fEn = cityNameEn ?? null;
      if (fEn) add(fit(`${ps} in ${fEn}`),                                             94, "Food + city — exact local search");
      if (fEn) add(fit(`${ps} Delivery ${fEn}`),                                       92, "Delivery + food + city — transactional");
      add(`${ps} Home Delivery`,                                                        91, "Home delivery — top food search intent");
      add(`Order ${ps} Online`,                                                         89, "Order + online — direct CTA");
      add(`Fresh ${ps} Delivered`,                                                      88, "Fresh + delivered — quality + convenience");
      add("Fast Food Delivery Online",                                                  85, "Fast delivery — key food delivery signal");
    }
    if (niche === "clothing") {
      const clEn = cityNameEn ?? countryNameEn ?? null;
      if (clEn) add(fit(`${ps} in ${clEn}`),                                           93, "Clothing + location — geo match");
      add(`${ps} Online Store`,                                                         91, "Online store — e-com keyword");
      add(`Stylish ${ps} Online`,                                                       89, "Stylish — key fashion qualifier");
      add(`${ps} with Free Delivery`,                                                   87, "Free delivery — purchase barrier removal");
      add(`Shop ${ps} Online`,                                                          86, "Shop + category — transactional");
      add(`${ps} for Every Season`,                                                     84, "Every season — broad assortment signal");
    }
    if (niche === "electronics") {
      const elEn = cityNameEn ?? countryNameEn ?? null;
      if (elEn) add(fit(`${ps} in ${elEn}`),                                           93, "Electronics + location — geo match");
      add(`Buy ${ps} With Warranty`,                                                    92, "Warranty — top purchase concern for electronics");
      add(`${ps} at Best Price`,                                                        91, "Best price — primary electronics search driver");
      add(`New ${ps} In Stock`,                                                         89, "In stock — availability signal");
      add(`Official ${ps} Store`,                                                       88, "Official — authenticity signal");
    }
    if (niche === "furniture") {
      const fuEn = cityNameEn ?? countryNameEn ?? null;
      if (fuEn) add(fit(`${ps} in ${fuEn}`),                                           93, "Furniture + location — geo match");
      add(`Custom ${ps} Online`,                                                        91, "Custom — key differentiator for furniture");
      add(`${ps} with Delivery & Setup`,                                               90, "Setup included — barrier removal");
      add(`Quality ${ps} Online`,                                                       88, "Quality — main objection for online furniture");
      add(`${ps} for Every Budget`,                                                     86, "Every budget — affordability signal");
    }

    // ── EN fill to 15 ─────────────────────────────────────────────────────────
    const fillEn: [string, number, string][] = [
      [`${ps} — Best Deals Online`,      75, "Best deals — value proposition"],
      [`${ps} With Free Shipping`,       74, "Free shipping — removes friction"],
      ["Get a Free Consultation",        73, "Free consultation reduces friction"],
      ["Compare Options Before Buying",  72, "Comparison frame for research intent"],
      ["Request Information Today",      71, "Soft CTA with urgency"],
      ["Book a Consultation Online",     70, "Booking CTA — safe and conversion-friendly"],
      ["Find the Right Option",          69, "Discovery framing for consideration phase"],
    ];
    for (const [text, score, tip] of fillEn) {
      if (candidates.length >= 20) break;
      add(fit(text), score, tip);
    }
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

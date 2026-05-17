"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";

const POSTS_EN = [
  {
    id: "1",
    category: "Strategy",
    catColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "How AI-Generated RSA Headlines Outperform Manually Written Ads by 34%",
    excerpt: "We analyzed 12,000 RSA ad sets generated through AdPilot AI and compared CTR against human-written control groups across 6 verticals. Here's what we found.",
    date: "Jan 14, 2025",
    readTime: "8 min read",
    featured: true,
    gradient: "from-indigo-500/10 to-violet-500/10",
    border: "border-indigo-500/15",
  },
  {
    id: "2",
    category: "Policy",
    catColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "The 8 Google Ads Policy Violations That Get Accounts Suspended Most Often",
    excerpt: "Financial, crypto, and healthcare niches account for 71% of all Google Ads suspensions. Learn exactly which phrases trigger automated policy flags.",
    date: "Jan 8, 2025",
    readTime: "6 min read",
    featured: false,
    gradient: "from-emerald-500/5 to-cyan-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "3",
    category: "CIS Markets",
    catColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    title: "Russian-Language Google Ads: Why Generic AI Tools Fail and What to Do Instead",
    excerpt: "Morphology, transliteration, and searcher intent in Russian-language PPC are fundamentally different from English. We break down the specific challenges.",
    date: "Dec 28, 2024",
    readTime: "10 min read",
    featured: false,
    gradient: "from-violet-500/5 to-purple-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "4",
    category: "Tutorial",
    catColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    title: "From Zero to Running RSA Campaign in 15 Minutes Using AdPilot AI",
    excerpt: "A practical walkthrough: entering your niche, choosing campaign goals, reviewing generated assets, and importing directly into Google Ads Editor.",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    featured: false,
    gradient: "from-blue-500/5 to-indigo-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "5",
    category: "Product",
    catColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "Introducing CTR Analyzer: Score Your Existing Ad Copy in Seconds",
    excerpt: "We've launched a new tool that scores any ad copy across 5 CTR-driving dimensions and gives you specific rewrites — not vague suggestions.",
    date: "Dec 12, 2024",
    readTime: "4 min read",
    featured: false,
    gradient: "from-amber-500/5 to-orange-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "6",
    category: "Strategy",
    catColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "Headline Pinning in RSA: When to Pin and When to Let Google Optimize",
    excerpt: "Pinning reduces your ad's flexibility score, but sometimes it's the right call. Here's a data-backed framework for deciding which headlines to pin.",
    date: "Dec 5, 2024",
    readTime: "7 min read",
    featured: false,
    gradient: "from-indigo-500/5 to-violet-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "7",
    category: "AI & PPC",
    catColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    title: "GPT-4o vs GPT-4.1 for Ad Copywriting: A Practical Benchmark",
    excerpt: "We ran 500 identical ad briefs through both models and scored outputs on compliance, character accuracy, and CTR potential. The results surprised us.",
    date: "Nov 29, 2024",
    readTime: "9 min read",
    featured: false,
    gradient: "from-cyan-500/5 to-blue-500/5",
    border: "border-white/[0.07]",
  },
];

const POSTS_RU = [
  {
    id: "1",
    category: "Стратегия",
    catColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "Как AI-сгенерированные RSA-заголовки превосходят написанные вручную на 34%",
    excerpt: "Мы проанализировали 12 000 наборов RSA-объявлений через AdPilot AI и сравнили CTR с контрольными группами, написанными вручную, в 6 вертикалях.",
    date: "14 янв. 2025",
    readTime: "8 мин чтения",
    featured: true,
    gradient: "from-indigo-500/10 to-violet-500/10",
    border: "border-indigo-500/15",
  },
  {
    id: "2",
    category: "Политика",
    catColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "8 нарушений политики Google Ads, чаще всего приводящих к блокировке аккаунтов",
    excerpt: "Финансовые, крипто- и медицинские ниши составляют 71% всех блокировок в Google Ads. Узнайте, какие именно фразы запускают автоматические флаги.",
    date: "8 янв. 2025",
    readTime: "6 мин чтения",
    featured: false,
    gradient: "from-emerald-500/5 to-cyan-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "3",
    category: "Рынок СНГ",
    catColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    title: "Русскоязычный Google Ads: почему обычные AI-инструменты не справляются",
    excerpt: "Морфология, транслитерация и поисковый интент в русскоязычном PPC принципиально отличаются от английского. Разбираем конкретные проблемы.",
    date: "28 дек. 2024",
    readTime: "10 мин чтения",
    featured: false,
    gradient: "from-violet-500/5 to-purple-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "4",
    category: "Руководство",
    catColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    title: "От нуля до запущенной RSA-кампании за 15 минут с AdPilot AI",
    excerpt: "Практическое руководство: ввод ниши, выбор целей кампании, проверка сгенерированных элементов и импорт в Google Ads Editor.",
    date: "20 дек. 2024",
    readTime: "5 мин чтения",
    featured: false,
    gradient: "from-blue-500/5 to-indigo-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "5",
    category: "Продукт",
    catColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "Представляем анализатор CTR: оцените рекламные тексты за секунды",
    excerpt: "Мы запустили новый инструмент для оценки любого объявления по 5 измерениям CTR с конкретными переработками вместо размытых советов.",
    date: "12 дек. 2024",
    readTime: "4 мин чтения",
    featured: false,
    gradient: "from-amber-500/5 to-orange-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "6",
    category: "Стратегия",
    catColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "Закрепление заголовков в RSA: когда закреплять и когда оставлять Google оптимизировать",
    excerpt: "Закрепление снижает показатель гибкости, но иногда это правильное решение. Данные-ориентированный фреймворк для принятия решений.",
    date: "5 дек. 2024",
    readTime: "7 мин чтения",
    featured: false,
    gradient: "from-indigo-500/5 to-violet-500/5",
    border: "border-white/[0.07]",
  },
  {
    id: "7",
    category: "AI и PPC",
    catColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    title: "GPT-4o против GPT-4.1 для копирайтинга объявлений: практический бенчмарк",
    excerpt: "Мы провели 500 идентичных брифов через обе модели и оценили результаты по соответствию, точности символов и потенциалу CTR.",
    date: "29 нояб. 2024",
    readTime: "9 мин чтения",
    featured: false,
    gradient: "from-cyan-500/5 to-blue-500/5",
    border: "border-white/[0.07]",
  },
];

const LABELS = {
  en: { badge: "Blog", headline: "Insights on", headlineGradient: "AI-powered PPC", subtitle: "Strategies, product updates, and deep dives from the AdPilot AI team.", featured: "Featured", allPosts: "All articles", newsletter: "Stay updated", newsletterDesc: "New articles every week on Google Ads, AI copywriting, and PPC strategy.", emailPlaceholder: "you@company.com", subscribeBtn: "Subscribe" },
  ru: { badge: "Блог", headline: "Всё об", headlineGradient: "AI-рекламе в PPC", subtitle: "Стратегии, обновления продукта и глубокие разборы от команды AdPilot AI.", featured: "Рекомендуем", allPosts: "Все статьи", newsletter: "Будьте в курсе", newsletterDesc: "Новые статьи каждую неделю о Google Ads, AI-копирайтинге и PPC-стратегии.", emailPlaceholder: "вы@компания.ру", subscribeBtn: "Подписаться" },
};

export default function BlogPage() {
  const { locale } = useLocale();
  const lbl = LABELS[locale] ?? LABELS.en;
  const posts = locale === "ru" ? POSTS_RU : POSTS_EN;
  const featured = posts.find((p) => p.featured)!;
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6">
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">{lbl.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {lbl.headline}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">{lbl.headlineGradient}</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">{lbl.subtitle}</p>
          </motion.div>

          {/* Featured */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4">{lbl.featured}</p>
            <Link href={`/blog/${featured.id}`}>
              <motion.div whileHover={{ scale: 1.01, y: -3 }} className={`rounded-2xl border ${featured.border} bg-gradient-to-br ${featured.gradient} p-8 cursor-pointer group`}>
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border mb-4 ${featured.catColor}`}>
                      <Tag className="w-2.5 h-2.5" />{featured.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug group-hover:text-indigo-200 transition-colors">{featured.title}</h2>
                    <p className="text-white/45 leading-relaxed mb-5 max-w-2xl">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{featured.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{featured.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm flex-shrink-0 group-hover:gap-3 transition-all">
                    Read <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="mb-14">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{lbl.allPosts}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.02, y: -4 }}>
                  <Link href={`/blog/${post.id}`}>
                    <div className={`h-full rounded-2xl border ${post.border} bg-gradient-to-br ${post.gradient} p-5 cursor-pointer group`}>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-3 ${post.catColor}`}>
                        {post.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-indigo-200 transition-colors line-clamp-3">{post.title}</h3>
                      <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-[10px] text-white/25 mt-auto">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.07] to-violet-500/[0.05] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <h2 className="text-2xl font-black text-white mb-2">{lbl.newsletter}</h2>
            <p className="text-white/40 mb-6">{lbl.newsletterDesc}</p>
            <div className="flex items-center gap-3 max-w-md mx-auto">
              <input type="email" placeholder={lbl.emailPlaceholder} className="flex-1 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 transition-all" />
              <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm whitespace-nowrap transition-all">
                {lbl.subscribeBtn}
              </button>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

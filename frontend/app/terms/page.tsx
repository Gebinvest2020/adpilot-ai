"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    backLabel: "Back to home",
    pageTitle: "Terms of Service",
    lastUpdated: "Last updated: January 15, 2025",
    intro: "Please read these Terms of Service carefully before using AdPilot AI. By accessing or using our platform, you agree to be bound by these terms.",
    contentsLabel: "Contents",
    sections: [
      { id: "acceptance",     title: "1. Acceptance of Terms" },
      { id: "description",    title: "2. Description of Service" },
      { id: "accounts",       title: "3. User Accounts" },
      { id: "acceptable-use", title: "4. Acceptable Use" },
      { id: "ip",             title: "5. Intellectual Property" },
      { id: "payment",        title: "6. Payment Terms" },
      { id: "liability",      title: "7. Limitation of Liability" },
      { id: "termination",    title: "8. Termination" },
      { id: "governing-law",  title: "9. Governing Law" },
    ],
    s1Title: "1. Acceptance of Terms",
    s1p1: "By accessing or using AdPilot AI's services, website, or any related software (collectively, the \"Service\"), you agree to be bound by these Terms of Service (\"Terms\") and our Privacy Policy. If you do not agree to these Terms, you may not use the Service.",
    s1p2: "These Terms apply to all users, including visitors, registered users, and paying subscribers. AdPilot AI, Inc. reserves the right to modify these Terms at any time. We will notify you of material changes via email or prominent notice on the platform. Your continued use of the Service after such notification constitutes acceptance of the modified Terms.",
    s2Title: "2. Description of Service",
    s2p1: "AdPilot AI provides an AI-powered platform for generating, analyzing, and optimizing Google Ads content, including but not limited to:",
    s2items: [
      "Responsive Search Ad (RSA) generation with AI-crafted headlines and descriptions",
      "Ad moderation pre-screening to identify potential policy violations",
      "Click-through rate (CTR) analysis and optimization recommendations",
      "Keyword intelligence and A/B testing capabilities",
      "API access for programmatic integration (paid plans)",
    ],
    s2p2: "The Service uses third-party AI models including OpenAI GPT-5 and Anthropic Claude. Ad generation results are AI-generated suggestions and do not constitute professional advertising advice. You are solely responsible for reviewing, approving, and submitting ads to Google Ads.",
    s3Title: "3. User Accounts",
    s3p1: "To access the Service, you must create an account. You agree to:",
    s3items: [
      "Provide accurate, current, and complete registration information",
      "Maintain the security of your password and accept responsibility for all activities under your account",
      "Notify us immediately of any unauthorized use of your account at security@adpilot.ai",
      "Not share account credentials or allow others to access your account",
      "Not create multiple accounts to circumvent usage limits or suspension",
    ],
    s3p2: "You must be at least 18 years old to create an account. By creating an account, you represent that you meet this requirement. We reserve the right to suspend or terminate accounts that violate these Terms.",
    s4Title: "4. Acceptable Use",
    s4p1: "You may not use the Service to:",
    s4items: [
      "Generate advertising content that violates Google Ads policies, applicable laws, or regulations",
      "Create ads for prohibited products or services including counterfeit goods, dangerous substances, or illegal activities",
      "Attempt to reverse engineer, scrape, or extract our AI models, training data, or proprietary algorithms",
      "Use the Service to generate spam, phishing content, or deceptive advertising",
      "Circumvent rate limits, usage quotas, or access controls",
      "Resell API access or generated content without written authorization from AdPilot AI",
      "Engage in any activity that disrupts or interferes with the Service's infrastructure",
    ],
    s4p2: "Violation of acceptable use policies may result in immediate account suspension without refund.",
    s5Title: "5. Intellectual Property",
    s5p1Bold: "Your content:",
    s5p1: " You retain ownership of the business descriptions, briefs, and inputs you provide. By using the Service, you grant AdPilot AI a limited license to process your inputs through our AI pipeline to generate the requested outputs.",
    s5p2Bold: "Generated content:",
    s5p2: " AI-generated ad copy produced by the Service is owned by you, subject to any third-party AI provider licenses. You are responsible for ensuring generated content does not infringe third-party intellectual property rights.",
    s5p3Bold: "Our platform:",
    s5p3: " The AdPilot AI name, logo, software, UI, and proprietary technology are owned by AdPilot AI, Inc. and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our platform without express written permission.",
    s6Title: "6. Payment Terms",
    s6p1: "Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you authorize us to charge your payment method on a recurring basis until you cancel.",
    s6items: [
      ["Free trial:", " New accounts receive a 14-day free trial with full Growth plan features. No credit card is required to start a trial."],
      ["Upgrades:", " Plan upgrades take effect immediately and are prorated for the remainder of the billing period."],
      ["Downgrades:", " Plan downgrades take effect at the end of the current billing period."],
      ["Refunds:", " We offer a 7-day money-back guarantee on first-time paid subscriptions. After 7 days, subscriptions are non-refundable except where required by law."],
      ["Taxes:", " Prices are exclusive of taxes. Applicable VAT, GST, or other taxes will be added based on your billing address."],
    ],
    s6p2: "Failed payments may result in service interruption. We will attempt to retry failed charges up to 3 times over 7 days before suspending your account.",
    s7Title: "7. Limitation of Liability",
    s7warn: "Important — please read carefully",
    s7p1: "THE SERVICE IS PROVIDED \"AS IS\" WITHOUT WARRANTIES OF ANY KIND. ADPILOT AI DOES NOT WARRANT THAT GENERATED AD COPY WILL BE APPROVED BY GOOGLE ADS, ACHIEVE ANY PARTICULAR PERFORMANCE METRICS, OR BE FREE FROM ERRORS.",
    s7p2: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, ADPILOT AI'S TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO ADPILOT AI IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
    s7p3: "IN NO EVENT SHALL ADPILOT AI BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, OR LOSS OF BUSINESS OPPORTUNITIES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
    s8Title: "8. Termination",
    s8p1: "You may cancel your account at any time from your account settings or by emailing support@adpilot.ai. Cancellation takes effect at the end of the current billing period.",
    s8p2: "We may suspend or terminate your account immediately, without notice, if you violate these Terms, engage in fraudulent activity, or if we are required to do so by law. Upon termination, your right to use the Service ceases immediately.",
    s8p3: "Following account deletion, we will delete your personal data within 90 days, except where retention is required by law (e.g., billing records). Ad generation history may be retained in anonymized form for service improvement.",
    s9Title: "9. Governing Law",
    s9p1: "These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law provisions.",
    s9p2: "Any disputes arising from these Terms shall be resolved through binding arbitration administered by JAMS under its Streamlined Arbitration Rules, except that either party may seek injunctive relief in a court of competent jurisdiction. The arbitration shall take place in Delaware.",
    s9p3: "For users in the European Union or EEA, nothing in these Terms limits your rights under applicable consumer protection laws.",
    s9boxTitle: "Questions about these Terms?",
    s9boxText: "Contact us at",
    s9support: "support page",
  },
  ru: {
    backLabel: "На главную",
    pageTitle: "Условия использования",
    lastUpdated: "Последнее обновление: 15 января 2025 г.",
    intro: "Пожалуйста, внимательно прочитайте настоящие Условия использования перед началом работы с AdPilot AI. Получая доступ к платформе или используя её, вы соглашаетесь соблюдать настоящие условия.",
    contentsLabel: "Содержание",
    sections: [
      { id: "acceptance",     title: "1. Принятие условий" },
      { id: "description",    title: "2. Описание сервиса" },
      { id: "accounts",       title: "3. Аккаунты пользователей" },
      { id: "acceptable-use", title: "4. Допустимое использование" },
      { id: "ip",             title: "5. Интеллектуальная собственность" },
      { id: "payment",        title: "6. Условия оплаты" },
      { id: "liability",      title: "7. Ограничение ответственности" },
      { id: "termination",    title: "8. Прекращение действия" },
      { id: "governing-law",  title: "9. Применимое право" },
    ],
    s1Title: "1. Принятие условий",
    s1p1: "Получая доступ к сервисам AdPilot AI, сайту или любому связанному программному обеспечению (далее — «Сервис»), вы соглашаетесь соблюдать настоящие Условия использования («Условия») и нашу Политику конфиденциальности. Если вы не согласны с настоящими Условиями, вы не вправе использовать Сервис.",
    s1p2: "Настоящие Условия распространяются на всех пользователей, включая посетителей, зарегистрированных пользователей и платных подписчиков. AdPilot AI, Inc. оставляет за собой право в любое время вносить изменения в Условия. Мы уведомим вас о существенных изменениях по электронной почте или через заметное сообщение на платформе. Дальнейшее использование Сервиса после такого уведомления означает принятие изменённых Условий.",
    s2Title: "2. Описание сервиса",
    s2p1: "AdPilot AI предоставляет AI-платформу для генерации, анализа и оптимизации контента Google Ads, включая, но не ограничиваясь:",
    s2items: [
      "Генерацией адаптивных поисковых объявлений (RSA) с AI-созданными заголовками и описаниями",
      "Предварительной проверкой объявлений на нарушения политики",
      "Анализом кликабельности (CTR) и рекомендациями по оптимизации",
      "Подбором ключевых слов и A/B-тестированием",
      "Доступом к API для программной интеграции (платные тарифы)",
    ],
    s2p2: "Сервис использует сторонние AI-модели, включая OpenAI GPT-5 и Anthropic Claude. Результаты генерации объявлений являются AI-предложениями и не составляют профессиональной рекламной консультации. Вы несёте полную ответственность за проверку, одобрение и отправку объявлений в Google Ads.",
    s3Title: "3. Аккаунты пользователей",
    s3p1: "Для доступа к Сервису необходимо создать аккаунт. Вы обязуетесь:",
    s3items: [
      "Предоставлять точную, актуальную и полную регистрационную информацию",
      "Обеспечивать безопасность пароля и принимать ответственность за все действия в вашем аккаунте",
      "Незамедлительно уведомлять нас о любом несанкционированном использовании аккаунта по адресу security@adpilot.ai",
      "Не передавать учётные данные и не предоставлять другим лицам доступ к вашему аккаунту",
      "Не создавать несколько аккаунтов для обхода лимитов использования или блокировки",
    ],
    s3p2: "Для создания аккаунта необходимо быть не моложе 18 лет. Создавая аккаунт, вы подтверждаете соответствие этому требованию. Мы оставляем за собой право приостановить или закрыть аккаунты, нарушающие настоящие Условия.",
    s4Title: "4. Допустимое использование",
    s4p1: "Вам запрещено использовать Сервис для:",
    s4items: [
      "Создания рекламного контента, нарушающего политику Google Ads, применимые законы или нормативные акты",
      "Создания объявлений для запрещённых товаров или услуг, включая контрафактную продукцию, опасные вещества или незаконную деятельность",
      "Попыток обратной разработки, скрейпинга или извлечения наших AI-моделей, обучающих данных или алгоритмов",
      "Создания спама, фишинговых материалов или мошеннической рекламы",
      "Обхода лимитов запросов, квот использования или средств контроля доступа",
      "Перепродажи доступа к API или сгенерированного контента без письменного разрешения AdPilot AI",
      "Любой деятельности, нарушающей или препятствующей работе инфраструктуры Сервиса",
    ],
    s4p2: "Нарушение политики допустимого использования может повлечь немедленную блокировку аккаунта без возврата средств.",
    s5Title: "5. Интеллектуальная собственность",
    s5p1Bold: "Ваш контент:",
    s5p1: " Вы сохраняете право собственности на описания бизнеса, брифы и входные данные, которые предоставляете. Используя Сервис, вы предоставляете AdPilot AI ограниченную лицензию на обработку входных данных через наш AI-конвейер для генерации запрошенных результатов.",
    s5p2Bold: "Сгенерированный контент:",
    s5p2: " AI-сгенерированные тексты объявлений, созданные Сервисом, принадлежат вам с учётом лицензий сторонних AI-провайдеров. Вы несёте ответственность за то, чтобы сгенерированный контент не нарушал права интеллектуальной собственности третьих лиц.",
    s5p3Bold: "Наша платформа:",
    s5p3: " Название AdPilot AI, логотип, программное обеспечение, интерфейс и проприетарные технологии принадлежат AdPilot AI, Inc. и защищены законодательством об авторском праве, товарных знаках и иными законами об интеллектуальной собственности. Копирование, изменение или распространение нашей платформы без явного письменного разрешения запрещено.",
    s6Title: "6. Условия оплаты",
    s6p1: "Платные подписки тарифицируются авансом ежемесячно или ежегодно. Подписываясь, вы разрешаете нам регулярно списывать средства с вашего платёжного инструмента до отмены подписки.",
    s6items: [
      ["Бесплатный пробный период:", " Новые аккаунты получают 14-дневный бесплатный доступ с полным набором функций тарифа «Рост». Привязка карты для начала пробного периода не требуется."],
      ["Повышение тарифа:", " Переход на более высокий тариф вступает в силу немедленно и пересчитывается пропорционально оставшемуся периоду."],
      ["Понижение тарифа:", " Переход на более низкий тариф вступает в силу по окончании текущего расчётного периода."],
      ["Возвраты:", " Мы предоставляем гарантию возврата в течение 7 дней для первой платной подписки. По истечении 7 дней подписки не возвращаются, за исключением случаев, предусмотренных законом."],
      ["Налоги:", " Цены указаны без учёта налогов. Применимый НДС, GST или иные налоги будут добавлены в зависимости от вашего платёжного адреса."],
    ],
    s6p2: "Неудачные платежи могут привести к прерыванию обслуживания. Мы предпримем до 3 попыток повторного списания в течение 7 дней, прежде чем заблокировать аккаунт.",
    s7Title: "7. Ограничение ответственности",
    s7warn: "Важно — пожалуйста, прочитайте внимательно",
    s7p1: "СЕРВИС ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ» БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ. ADPILOT AI НЕ ГАРАНТИРУЕТ, ЧТО СГЕНЕРИРОВАННЫЕ ТЕКСТЫ ОБЪЯВЛЕНИЙ БУДУТ ОДОБРЕНЫ GOOGLE ADS, ДОСТИГНУТ КАКИХ-ЛИБО КОНКРЕТНЫХ ПОКАЗАТЕЛЕЙ ЭФФЕКТИВНОСТИ ИЛИ БУДУТ СВОБОДНЫ ОТ ОШИБОК.",
    s7p2: "В МАКСИМАЛЬНОЙ СТЕПЕНИ, ДОПУСТИМОЙ ПРИМЕНИМЫМ ЗАКОНОДАТЕЛЬСТВОМ, СОВОКУПНАЯ ОТВЕТСТВЕННОСТЬ ADPILOT AI ПО ЛЮБЫМ ПРЕТЕНЗИЯМ, ВЫТЕКАЮЩИМ ИЗ НАСТОЯЩИХ УСЛОВИЙ ИЛИ ИСПОЛЬЗОВАНИЯ СЕРВИСА, НЕ ПРЕВЫШАЕТ СУММУ, УПЛАЧЕННУЮ ВАМИ ADPILOT AI ЗА ДВЕНАДЦАТЬ (12) МЕСЯЦЕВ, ПРЕДШЕСТВУЮЩИХ ПРЕТЕНЗИИ.",
    s7p3: "НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ ADPILOT AI НЕ НЕСЁТ ОТВЕТСТВЕННОСТИ ЗА КОСВЕННЫЕ, СЛУЧАЙНЫЕ, ОСОБЫЕ, ПОСЛЕДУЮЩИЕ ИЛИ ШТРАФНЫЕ УБЫТКИ, ВКЛЮЧАЯ УПУЩЕННУЮ ВЫГОДУ, ПОТЕРЮ ДАННЫХ ИЛИ ПОТЕРЮ БИЗНЕС-ВОЗМОЖНОСТЕЙ, ДАЖЕ ЕСЛИ БЫЛА ОСВЕДОМЛЕНА О ВОЗМОЖНОСТИ ТАКИХ УБЫТКОВ.",
    s8Title: "8. Прекращение действия",
    s8p1: "Вы можете закрыть аккаунт в любое время через настройки аккаунта или написав на support@adpilot.ai. Закрытие вступает в силу по окончании текущего расчётного периода.",
    s8p2: "Мы можем немедленно, без предварительного уведомления, приостановить или закрыть ваш аккаунт при нарушении настоящих Условий, мошеннической деятельности или по требованию закона. После закрытия право на использование Сервиса прекращается немедленно.",
    s8p3: "После удаления аккаунта мы удалим ваши персональные данные в течение 90 дней, кроме случаев, когда хранение требуется по закону (напр., финансовая отчётность). История генерации объявлений может сохраняться в анонимизированной форме для улучшения сервиса.",
    s9Title: "9. Применимое право",
    s9p1: "Настоящие Условия регулируются и толкуются в соответствии с законодательством штата Делавэр, США, без учёта коллизионных норм.",
    s9p2: "Споры, возникающие из настоящих Условий, разрешаются путём обязательного арбитража под управлением JAMS в соответствии с Упрощёнными правилами арбитража, за исключением случаев, когда любая из сторон может обратиться за судебной защитой в суд компетентной юрисдикции. Арбитраж проводится в штате Делавэр.",
    s9p3: "Для пользователей в Европейском Союзе или ЕЭЗ ничто в настоящих Условиях не ограничивает ваши права в соответствии с применимым законодательством о защите прав потребителей.",
    s9boxTitle: "Вопросы об Условиях?",
    s9boxText: "Напишите нам на",
    s9support: "странице поддержки",
  },
};

export default function TermsPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {c.backLabel}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{c.pageTitle}</h1>
                <p className="text-sm text-white/35">{c.lastUpdated}</p>
              </div>
            </div>
            <p className="text-white/50 max-w-2xl leading-relaxed">{c.intro}</p>
          </motion.div>

          <div className="flex gap-12 items-start">
            {/* Sticky TOC */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:block w-56 flex-shrink-0 sticky top-24"
            >
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">{c.contentsLabel}</p>
              <nav className="space-y-1">
                {c.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-white/40 hover:text-white/80 py-1 transition-colors leading-snug"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </motion.aside>

            {/* Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 min-w-0"
            >
              <div className="space-y-12 text-white/60 text-sm leading-relaxed">

                <section id="acceptance">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s1Title}</h2>
                  <p className="mb-3">{c.s1p1}</p>
                  <p>{c.s1p2}</p>
                </section>

                <section id="description">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s2Title}</h2>
                  <p className="mb-3">{c.s2p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20 mb-3">
                    {c.s2items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p>{c.s2p2}</p>
                </section>

                <section id="accounts">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s3Title}</h2>
                  <p className="mb-3">{c.s3p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20 mb-3">
                    {c.s3items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p>{c.s3p2}</p>
                </section>

                <section id="acceptable-use">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s4Title}</h2>
                  <p className="mb-3">{c.s4p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20 mb-3">
                    {c.s4items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p>{c.s4p2}</p>
                </section>

                <section id="ip">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s5Title}</h2>
                  <p className="mb-3"><strong className="text-white/75">{c.s5p1Bold}</strong>{c.s5p1}</p>
                  <p className="mb-3"><strong className="text-white/75">{c.s5p2Bold}</strong>{c.s5p2}</p>
                  <p><strong className="text-white/75">{c.s5p3Bold}</strong>{c.s5p3}</p>
                </section>

                <section id="payment">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s6Title}</h2>
                  <p className="mb-3">{c.s6p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20 mb-3">
                    {c.s6items.map(([bold, text]) => (
                      <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                    ))}
                  </ul>
                  <p>{c.s6p2}</p>
                </section>

                <section id="liability">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s7Title}</h2>
                  <p className="mb-3 uppercase text-xs font-bold text-white/40 tracking-widest">{c.s7warn}</p>
                  <p className="mb-3">{c.s7p1}</p>
                  <p className="mb-3">{c.s7p2}</p>
                  <p>{c.s7p3}</p>
                </section>

                <section id="termination">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s8Title}</h2>
                  <p className="mb-3">{c.s8p1}</p>
                  <p className="mb-3">{c.s8p2}</p>
                  <p>{c.s8p3}</p>
                </section>

                <section id="governing-law">
                  <h2 className="text-xl font-bold text-white mb-4">{c.s9Title}</h2>
                  <p className="mb-3">{c.s9p1}</p>
                  <p className="mb-3">{c.s9p2}</p>
                  <p>{c.s9p3}</p>
                  <div className="mt-6 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                    <p className="font-semibold text-white/70 mb-2">{c.s9boxTitle}</p>
                    <p>
                      {c.s9boxText} <a href="mailto:legal@adpilot.ai" className="text-indigo-400 hover:text-indigo-300">legal@adpilot.ai</a>
                      {locale === "ru" ? " или через нашу " : " or through our "}
                      <Link href="/support" className="text-indigo-400 hover:text-indigo-300">{c.s9support}</Link>.
                    </p>
                  </div>
                </section>

              </div>
            </motion.article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

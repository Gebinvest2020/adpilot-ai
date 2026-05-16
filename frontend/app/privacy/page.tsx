"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    backLabel: "Back to home",
    pageTitle: "Privacy Policy",
    lastUpdated: "Last updated: January 15, 2025",
    intro: `AdPilot AI, Inc. ("AdPilot AI", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.`,
    contentsLabel: "Contents",
    sections: [
      { id: "information-we-collect", title: "1. Information We Collect" },
      { id: "how-we-use",             title: "2. How We Use Information" },
      { id: "sharing",                title: "3. Information Sharing" },
      { id: "retention",              title: "4. Data Retention" },
      { id: "security",               title: "5. Security" },
      { id: "cookies",                title: "6. Cookies" },
      { id: "your-rights",            title: "7. Your Rights" },
      { id: "contact",                title: "8. Contact Us" },
    ],
    content: {
      s1Title: "1. Information We Collect",
      s1Sub1: "Information You Provide",
      s1p1: "When you create an account or use our services, we collect:",
      s1items: [
        ["Account information", "— name, email address, password, and company name"],
        ["Payment information", "— billing address and payment details processed by our payment processor (Stripe). We do not store full card numbers."],
        ["Content you create", "— business descriptions, campaign goals, and ad copy you generate using our platform"],
        ["Support communications", "— messages, feedback, and bug reports you send to us"],
      ],
      s1Sub2: "Information We Collect Automatically",
      s1p2: "When you use AdPilot AI, we automatically collect:",
      s1items2: [
        ["Usage data", "— pages visited, features used, clicks, and time spent on the platform"],
        ["Device information", "— browser type, operating system, IP address, and device identifiers"],
        ["Log data", "— server logs including access times, error reports, and API call metadata"],
        ["Cookies and tracking technologies", "— see Section 6 for details"],
      ],
      s2Title: "2. How We Use Information",
      s2p1: "We use the information we collect to:",
      s2items: [
        "Provide, maintain, and improve our services, including AI-powered ad generation features",
        "Process your prompts through large language model APIs (OpenAI GPT-5, Anthropic Claude) to generate advertising copy — your prompts are transmitted to these providers under their respective privacy policies",
        "Process transactions and send related information, including purchase confirmations and invoices",
        "Send you technical notices, updates, security alerts, and support messages",
        "Respond to your comments, questions, and customer service requests",
        "Monitor and analyze usage patterns and trends to improve user experience",
        "Detect, prevent, and address technical issues, fraud, and security incidents",
        "Comply with legal obligations and enforce our Terms of Service",
      ],
      s2notice: "AI Processing Notice: Content you submit for ad generation is processed by third-party AI providers. We do not use your ad content to train our proprietary models without your explicit consent.",
      s3Title: "3. Information Sharing",
      s3p1: "We do not sell your personal information. We may share your information in the following circumstances:",
      s3items: [
        ["Service providers", "— We share data with trusted third-party vendors who assist in operating our platform: Stripe (payments), OpenAI and Anthropic (AI processing), AWS (infrastructure), Vercel (hosting), and PostHog (analytics). Each provider is bound by data processing agreements."],
        ["Business transfers", "— In connection with a merger, acquisition, or sale of assets, your information may be transferred as a business asset."],
        ["Legal compliance", "— We may disclose your information if required by law, subpoena, or if we believe disclosure is necessary to protect our rights, protect your safety, or investigate fraud."],
        ["With your consent", "— We may share information for other purposes with your explicit consent."],
      ],
      s4Title: "4. Data Retention",
      s4p1: "We retain your personal information for as long as your account is active or as needed to provide services. Specifically:",
      s4items: [
        ["Account data", "— retained for the duration of your account plus 90 days after deletion request"],
        ["Ad generation history", "— retained for 12 months; you may delete individual campaigns at any time"],
        ["Billing records", "— retained for 7 years as required by financial regulations"],
        ["Server logs", "— retained for 90 days for security and debugging purposes"],
      ],
      s4p2: "You may request deletion of your data at any time by contacting privacy@adpilot.ai. We will process deletion requests within 30 days.",
      s5Title: "5. Security",
      s5p1: "We implement industry-standard security measures to protect your information:",
      s5items: [
        "All data in transit is encrypted using TLS 1.3",
        "Data at rest is encrypted using AES-256",
        "We are SOC 2 Type II certified",
        "Access to production systems is restricted to authorized personnel via SSO and MFA",
        "We conduct regular penetration testing and security audits",
        "Passwords are hashed using bcrypt with a cost factor of 12",
      ],
      s5p2: "Despite these measures, no security system is impenetrable. In the event of a data breach affecting your rights, we will notify you within 72 hours as required by GDPR.",
      s6Title: "6. Cookies",
      s6p1: "We use cookies and similar tracking technologies. See our",
      s6CookieLink: "Cookie Policy",
      s6p1b: "for full details. In summary:",
      s6items: [
        ["Essential cookies", "— required for authentication and platform functionality"],
        ["Analytics cookies", "— PostHog and similar tools to understand usage (can be opted out)"],
        ["Preference cookies", "— store your language and display preferences"],
      ],
      s7Title: "7. Your Rights",
      s7p1: "Depending on your location, you may have the following rights regarding your personal data:",
      s7rights: [
        ["Right of Access", "Request a copy of the personal data we hold about you"],
        ["Right to Rectification", "Request correction of inaccurate or incomplete data"],
        ["Right to Erasure", "Request deletion of your personal data ('right to be forgotten')"],
        ["Right to Portability", "Receive your data in a machine-readable format"],
        ["Right to Restrict Processing", "Request that we limit how we use your data"],
        ["Right to Object", "Object to processing based on legitimate interests or for direct marketing"],
      ],
      s7p2: "To exercise any of these rights, contact us at",
      s7email: "privacy@adpilot.ai",
      s7p2b: ". We will respond within 30 days. If you are in the EU/EEA, you also have the right to lodge a complaint with your local data protection authority.",
      s8Title: "8. Contact Us",
      s8p1: "If you have questions about this Privacy Policy or our data practices, please contact us:",
      s8company: "AdPilot AI, Inc.",
      s8email: "Email:",
      s8dpo: "Data Protection Officer:",
      s8note: "Response time: within 30 days for data requests, within 72 hours for breach notifications.",
      s8support: "support page",
    },
  },
  ru: {
    backLabel: "На главную",
    pageTitle: "Политика конфиденциальности",
    lastUpdated: "Последнее обновление: 15 января 2025 г.",
    intro: `AdPilot AI, Inc. («AdPilot AI», «мы», «наш» или «нас») стремится защищать вашу конфиденциальность. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и защищаем вашу информацию при использовании нашей платформы.`,
    contentsLabel: "Содержание",
    sections: [
      { id: "information-we-collect", title: "1. Данные, которые мы собираем" },
      { id: "how-we-use",             title: "2. Как мы используем данные" },
      { id: "sharing",                title: "3. Передача данных третьим лицам" },
      { id: "retention",              title: "4. Хранение данных" },
      { id: "security",               title: "5. Безопасность" },
      { id: "cookies",                title: "6. Файлы cookie" },
      { id: "your-rights",            title: "7. Ваши права" },
      { id: "contact",                title: "8. Контакты" },
    ],
    content: {
      s1Title: "1. Данные, которые мы собираем",
      s1Sub1: "Данные, которые вы предоставляете",
      s1p1: "При создании аккаунта или использовании наших сервисов мы собираем:",
      s1items: [
        ["Данные аккаунта", "— имя, адрес электронной почты, пароль и название компании"],
        ["Платёжные данные", "— платёжный адрес и реквизиты, обрабатываемые через наш платёжный сервис (Stripe). Мы не храним полные номера карт."],
        ["Создаваемый вами контент", "— описания бизнеса, цели кампании и тексты объявлений, генерируемые на платформе"],
        ["Обращения в поддержку", "— сообщения, отзывы и отчёты об ошибках, которые вы нам направляете"],
      ],
      s1Sub2: "Данные, собираемые автоматически",
      s1p2: "При использовании AdPilot AI мы автоматически собираем:",
      s1items2: [
        ["Данные об использовании", "— посещённые страницы, задействованные функции, клики и время на платформе"],
        ["Информация об устройстве", "— тип браузера, операционная система, IP-адрес и идентификаторы устройства"],
        ["Журналы сервера", "— логи доступа, отчёты об ошибках и метаданные API-запросов"],
        ["Файлы cookie и технологии отслеживания", "— подробности в разделе 6"],
      ],
      s2Title: "2. Как мы используем данные",
      s2p1: "Мы используем собранные данные для:",
      s2items: [
        "Предоставления, поддержания и улучшения наших сервисов, включая функции AI-генерации объявлений",
        "Обработки ваших запросов через API языковых моделей (OpenAI GPT-5, Anthropic Claude) для генерации рекламных текстов — запросы передаются этим провайдерам в соответствии с их политиками конфиденциальности",
        "Обработки транзакций и отправки связанной информации — подтверждений покупок и счетов",
        "Отправки технических уведомлений, обновлений, оповещений безопасности и сообщений поддержки",
        "Ответа на ваши комментарии, вопросы и обращения в службу поддержки",
        "Мониторинга и анализа паттернов использования для улучшения пользовательского опыта",
        "Выявления, предотвращения и устранения технических проблем, мошенничества и инцидентов безопасности",
        "Соблюдения законодательных обязательств и исполнения Условий использования",
      ],
      s2notice: "Уведомление об AI-обработке: контент, отправляемый для генерации объявлений, обрабатывается сторонними провайдерами AI. Мы не используем ваш контент для обучения собственных моделей без вашего явного согласия.",
      s3Title: "3. Передача данных третьим лицам",
      s3p1: "Мы не продаём вашу персональную информацию. Мы можем передавать данные в следующих случаях:",
      s3items: [
        ["Поставщики услуг", "— мы передаём данные доверенным сторонним подрядчикам: Stripe (платежи), OpenAI и Anthropic (AI-обработка), AWS (инфраструктура), Vercel (хостинг), PostHog (аналитика). Каждый провайдер связан соглашениями об обработке данных."],
        ["Реструктуризация бизнеса", "— в случае слияния, поглощения или продажи активов ваши данные могут быть переданы как бизнес-актив."],
        ["Соблюдение законодательства", "— мы можем раскрывать информацию по требованию закона, судебного предписания или при необходимости защиты наших прав, вашей безопасности или расследования мошенничества."],
        ["С вашего согласия", "— мы можем передавать информацию в иных целях с вашего явного согласия."],
      ],
      s4Title: "4. Хранение данных",
      s4p1: "Мы храним персональные данные в течение всего срока действия вашего аккаунта или периода, необходимого для предоставления услуг. Конкретно:",
      s4items: [
        ["Данные аккаунта", "— хранятся в течение срока действия аккаунта плюс 90 дней после запроса на удаление"],
        ["История генерации объявлений", "— хранится 12 месяцев; вы можете удалить отдельные кампании в любое время"],
        ["Финансовые записи", "— хранятся 7 лет в соответствии с требованиями финансового законодательства"],
        ["Журналы сервера", "— хранятся 90 дней в целях безопасности и отладки"],
      ],
      s4p2: "Вы можете запросить удаление данных в любое время, написав на privacy@adpilot.ai. Мы обработаем запрос в течение 30 дней.",
      s5Title: "5. Безопасность",
      s5p1: "Мы применяем отраслевые стандарты безопасности для защиты вашей информации:",
      s5items: [
        "Все данные в транзите шифруются по протоколу TLS 1.3",
        "Данные в состоянии покоя шифруются с использованием AES-256",
        "Мы имеем сертификацию SOC 2 Type II",
        "Доступ к производственным системам ограничен авторизованным персоналом через SSO и MFA",
        "Мы проводим регулярные тесты на проникновение и аудиты безопасности",
        "Пароли хешируются с использованием bcrypt с коэффициентом сложности 12",
      ],
      s5p2: "Несмотря на эти меры, ни одна система безопасности не является неуязвимой. В случае утечки данных, затрагивающей ваши права, мы уведомим вас в течение 72 часов, как того требует GDPR.",
      s6Title: "6. Файлы cookie",
      s6p1: "Мы используем файлы cookie и аналогичные технологии отслеживания. Подробности в нашей",
      s6CookieLink: "Политике cookie",
      s6p1b: ". Краткое описание:",
      s6items: [
        ["Необходимые cookie", "— требуются для аутентификации и работы платформы"],
        ["Аналитические cookie", "— инструменты PostHog и подобные для понимания использования (можно отказаться)"],
        ["Пользовательские cookie", "— хранят ваши языковые и интерфейсные предпочтения"],
      ],
      s7Title: "7. Ваши права",
      s7p1: "В зависимости от вашего местонахождения вы можете иметь следующие права в отношении персональных данных:",
      s7rights: [
        ["Право на доступ", "Запросить копию персональных данных, которые мы храним о вас"],
        ["Право на исправление", "Запросить исправление неточных или неполных данных"],
        ["Право на удаление", "Запросить удаление персональных данных («право на забвение»)"],
        ["Право на переносимость", "Получить данные в машиночитаемом формате"],
        ["Право на ограничение обработки", "Запросить ограничение использования ваших данных"],
        ["Право на возражение", "Возразить против обработки на основе законных интересов или для прямого маркетинга"],
      ],
      s7p2: "Для реализации любого из этих прав свяжитесь с нами по адресу",
      s7email: "privacy@adpilot.ai",
      s7p2b: ". Мы ответим в течение 30 дней. Если вы находитесь в ЕС/ЕЭЗ, вы также вправе подать жалобу в местный орган по защите данных.",
      s8Title: "8. Контакты",
      s8p1: "Если у вас есть вопросы о настоящей Политике конфиденциальности или нашей работе с данными, пожалуйста, свяжитесь с нами:",
      s8company: "AdPilot AI, Inc.",
      s8email: "Email:",
      s8dpo: "Сотрудник по защите данных:",
      s8note: "Срок ответа: до 30 дней для запросов о данных, до 72 часов для уведомлений об инцидентах.",
      s8support: "страницу поддержки",
    },
  },
};

export default function PrivacyPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;
  const ct = c.content;

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
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

                <section id="information-we-collect">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s1Title}</h2>
                  <h3 className="text-base font-semibold text-white/80 mb-2">{ct.s1Sub1}</h3>
                  <p className="mb-3">{ct.s1p1}</p>
                  <ul className="space-y-1.5 mb-4 ml-4 list-disc marker:text-white/20">
                    {ct.s1items.map(([bold, text]) => (
                      <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                    ))}
                  </ul>
                  <h3 className="text-base font-semibold text-white/80 mb-2">{ct.s1Sub2}</h3>
                  <p className="mb-3">{ct.s1p2}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20">
                    {ct.s1items2.map(([bold, text]) => (
                      <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                    ))}
                  </ul>
                </section>

                <section id="how-we-use">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s2Title}</h2>
                  <p className="mb-3">{ct.s2p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20">
                    {ct.s2items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p className="mt-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-indigo-300/70 text-xs">
                    {ct.s2notice}
                  </p>
                </section>

                <section id="sharing">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s3Title}</h2>
                  <p className="mb-3">{ct.s3p1}</p>
                  <ul className="space-y-2 ml-4 list-disc marker:text-white/20">
                    {ct.s3items.map(([bold, text]) => (
                      <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                    ))}
                  </ul>
                </section>

                <section id="retention">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s4Title}</h2>
                  <p className="mb-3">{ct.s4p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20">
                    {ct.s4items.map(([bold, text]) => (
                      <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                    ))}
                  </ul>
                  <p className="mt-3">{ct.s4p2}</p>
                </section>

                <section id="security">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s5Title}</h2>
                  <p className="mb-3">{ct.s5p1}</p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20">
                    {ct.s5items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p className="mt-3">{ct.s5p2}</p>
                </section>

                <section id="cookies">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s6Title}</h2>
                  <p className="mb-3">
                    {ct.s6p1} <Link href="/cookies" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">{ct.s6CookieLink}</Link> {ct.s6p1b}
                  </p>
                  <ul className="space-y-1.5 ml-4 list-disc marker:text-white/20">
                    {ct.s6items.map(([bold, text]) => (
                      <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                    ))}
                  </ul>
                </section>

                <section id="your-rights">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s7Title}</h2>
                  <p className="mb-3">{ct.s7p1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {ct.s7rights.map(([right, desc]) => (
                      <div key={right} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                        <p className="text-xs font-bold text-white/70 mb-1">{right}</p>
                        <p className="text-xs text-white/40">{desc}</p>
                      </div>
                    ))}
                  </div>
                  <p>
                    {ct.s7p2} <strong className="text-white/75">{ct.s7email}</strong>{ct.s7p2b}
                  </p>
                </section>

                <section id="contact">
                  <h2 className="text-xl font-bold text-white mb-4">{ct.s8Title}</h2>
                  <p className="mb-4">{ct.s8p1}</p>
                  <div className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2 text-sm">
                    <p><strong className="text-white/70">{ct.s8company}</strong></p>
                    <p>{ct.s8email} <a href="mailto:privacy@adpilot.ai" className="text-indigo-400 hover:text-indigo-300">privacy@adpilot.ai</a></p>
                    <p>{ct.s8dpo} <a href="mailto:dpo@adpilot.ai" className="text-indigo-400 hover:text-indigo-300">dpo@adpilot.ai</a></p>
                    <p className="text-white/35 text-xs pt-2">{ct.s8note}</p>
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

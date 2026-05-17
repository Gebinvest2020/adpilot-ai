"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Key, Bell, CreditCard, Globe, Shield,
  Copy, Check, Eye, EyeOff, Save, RefreshCw,
  Download, Zap, BarChart2, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT, useLocale } from "@/lib/i18n";
import { getUsageStats, getHistory, type UsageStats } from "@/lib/history";
import { useToast } from "@/lib/toast";

type Section = "profile" | "api" | "notifications" | "billing" | "privacy";

const LABELS = {
  en: {
    pageTitle: "Settings",
    pageSubtitle: "Manage your account, API keys, and preferences.",
    tabs: {
      profile:       "Profile",
      api:           "API Keys",
      notifications: "Notifications",
      billing:       "Billing",
      privacy:       "Privacy",
    },
    profile: {
      title: "Profile",
      nameLabel: "Full name",
      emailLabel: "Email address",
      companyLabel: "Company",
      roleLabel: "Role",
      roleOptions: ["PPC Manager", "Marketing Director", "Agency Owner", "Freelancer", "Developer", "Other"],
      langLabel: "Dashboard language",
      saveBtn: "Save changes",
      savedMsg: "Changes saved",
    },
    api: {
      title: "API Keys",
      desc: "Use these keys to call the AdPilot AI REST API directly from your applications. Keep them secret.",
      liveKeyLabel: "Live API Key",
      testKeyLabel: "Test API Key",
      openAILabel: "OpenAI API Key",
      openAIDesc: "Used server-side for AI generation. Add your key in .env.local — never expose it client-side.",
      openAIPlaceholder: "sk-proj-...",
      regenerateBtn: "Regenerate",
      docsLink: "View API docs",
      copiedMsg: "Copied!",
    },
    notifications: {
      title: "Notifications",
      items: [
        { key: "api_limit",   label: "API rate limit warnings",        desc: "Notify when you reach 80% of monthly API quota" },
        { key: "incidents",   label: "System incidents",               desc: "Email when a service outage or degradation is detected" },
        { key: "weekly",      label: "Weekly usage digest",            desc: "Summary of generations, token usage, and CTR scores" },
        { key: "product",     label: "Product updates",                desc: "New features, changelog entries, and release notes" },
        { key: "tips",        label: "PPC tips & best practices",       desc: "Occasional actionable advice on Google Ads optimization" },
      ],
    },
    billing: {
      title: "Billing",
      currentPlan: "Current plan",
      planName: "Pro",
      planDesc: "Up to 500 generations / month · Full API access · Priority support",
      nextBilling: "Next billing",
      nextDate: "February 1, 2025",
      amount: "$49 / month",
      paymentMethod: "Payment method",
      card: "Visa •••• 4242",
      invoicesLabel: "Recent invoices",
      invoices: [
        { date: "Jan 1, 2025",  amount: "$49.00", status: "Paid" },
        { date: "Dec 1, 2024",  amount: "$49.00", status: "Paid" },
        { date: "Nov 1, 2024",  amount: "$49.00", status: "Paid" },
      ],
      upgradeBtn: "Upgrade plan",
      manageBtn: "Manage billing",
    },
    privacy: {
      title: "Privacy & Security",
      twoFALabel: "Two-factor authentication",
      twoFADesc: "Add a second layer of security to your account.",
      twoFAEnabled: "Enabled",
      twoFADisabled: "Not enabled",
      enableBtn: "Enable 2FA",
      sessionsLabel: "Active sessions",
      sessions: [
        { device: "Chrome on Windows",    location: "Moscow, RU",   time: "Active now",    current: true },
        { device: "Safari on iPhone 15",  location: "Moscow, RU",   time: "2 hours ago",   current: false },
        { device: "Firefox on macOS",     location: "Berlin, DE",   time: "3 days ago",    current: false },
      ],
      revokeBtn: "Revoke",
      dangerLabel: "Danger zone",
      deleteAccount: "Delete account",
      deleteDesc: "Permanently delete your account and all associated data. This cannot be undone.",
      deleteBtn: "Delete my account",
    },
  },
  ru: {
    pageTitle: "Настройки",
    pageSubtitle: "Управляйте аккаунтом, API-ключами и предпочтениями.",
    tabs: {
      profile:       "Профиль",
      api:           "API-ключи",
      notifications: "Уведомления",
      billing:       "Оплата",
      privacy:       "Безопасность",
    },
    profile: {
      title: "Профиль",
      nameLabel: "Полное имя",
      emailLabel: "Email",
      companyLabel: "Компания",
      roleLabel: "Роль",
      roleOptions: ["PPC-менеджер", "Директор по маркетингу", "Владелец агентства", "Фрилансер", "Разработчик", "Другое"],
      langLabel: "Язык дашборда",
      saveBtn: "Сохранить",
      savedMsg: "Сохранено",
    },
    api: {
      title: "API-ключи",
      desc: "Используйте эти ключи для прямых вызовов REST API AdPilot AI. Держите их в секрете.",
      liveKeyLabel: "Рабочий API-ключ",
      testKeyLabel: "Тестовый API-ключ",
      openAILabel: "API-ключ OpenAI",
      openAIDesc: "Используется на сервере для AI-генерации. Добавьте ключ в .env.local — никогда не открывайте его клиенту.",
      openAIPlaceholder: "sk-proj-...",
      regenerateBtn: "Перевыпустить",
      docsLink: "Документация API",
      copiedMsg: "Скопировано!",
    },
    notifications: {
      title: "Уведомления",
      items: [
        { key: "api_limit",   label: "Предупреждения о лимите API",    desc: "Уведомлять при достижении 80% месячной квоты" },
        { key: "incidents",   label: "Системные инциденты",            desc: "Email при обнаружении сбоя или деградации сервиса" },
        { key: "weekly",      label: "Еженедельный дайджест",          desc: "Сводка генераций, токенов и оценок CTR" },
        { key: "product",     label: "Обновления продукта",            desc: "Новые функции, записи в changelog и примечания к версиям" },
        { key: "tips",        label: "PPC-советы и лучшие практики",   desc: "Периодические советы по оптимизации Google Ads" },
      ],
    },
    billing: {
      title: "Оплата",
      currentPlan: "Текущий план",
      planName: "Pro",
      planDesc: "До 500 генераций в месяц · Полный доступ к API · Приоритетная поддержка",
      nextBilling: "Следующее списание",
      nextDate: "1 февраля 2025",
      amount: "$49 / месяц",
      paymentMethod: "Способ оплаты",
      card: "Visa •••• 4242",
      invoicesLabel: "Последние счета",
      invoices: [
        { date: "1 янв. 2025",  amount: "$49.00", status: "Оплачен" },
        { date: "1 дек. 2024",  amount: "$49.00", status: "Оплачен" },
        { date: "1 ноя. 2024",  amount: "$49.00", status: "Оплачен" },
      ],
      upgradeBtn: "Обновить план",
      manageBtn: "Управление оплатой",
    },
    privacy: {
      title: "Конфиденциальность и безопасность",
      twoFALabel: "Двухфакторная аутентификация",
      twoFADesc: "Добавьте второй уровень защиты аккаунта.",
      twoFAEnabled: "Включена",
      twoFADisabled: "Не включена",
      enableBtn: "Включить 2FA",
      sessionsLabel: "Активные сессии",
      sessions: [
        { device: "Chrome на Windows",  location: "Москва, RU",  time: "Активна сейчас", current: true },
        { device: "Safari на iPhone 15", location: "Москва, RU", time: "2 часа назад",    current: false },
        { device: "Firefox на macOS",   location: "Берлин, DE",  time: "3 дня назад",     current: false },
      ],
      revokeBtn: "Отозвать",
      dangerLabel: "Опасная зона",
      deleteAccount: "Удалить аккаунт",
      deleteDesc: "Навсегда удалить ваш аккаунт и все связанные данные. Это действие необратимо.",
      deleteBtn: "Удалить мой аккаунт",
    },
  },
};

const SECTION_ICONS: Record<Section, React.ComponentType<{ className?: string }>> = {
  profile:       User,
  api:           Key,
  notifications: Bell,
  billing:       CreditCard,
  privacy:       Shield,
};

function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all"
      />
    </div>
  );
}

function MaskedKeyField({ label, value, onCopy, onRegenerate, copied, copyMsg }: {
  label: string; value: string; onCopy: () => void; onRegenerate?: () => void; copied: boolean; copyMsg: string;
}) {
  const [show, setShow] = useState(false);
  const masked = value.slice(0, 8) + "•".repeat(24) + value.slice(-4);
  return (
    <div>
      <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04]">
          <code className="text-xs text-white/60 font-mono flex-1 truncate">{show ? value : masked}</code>
          <button onClick={() => setShow(!show)} className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0">
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        <button onClick={onCopy} className={cn("p-2.5 rounded-xl border transition-all", copied ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/[0.08] bg-white/[0.04] text-white/30 hover:text-white/60")}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        {onRegenerate && (
          <button onClick={onRegenerate} className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/30 hover:text-white/60 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {copied && <p className="text-[10px] text-emerald-400 mt-1.5">{copyMsg}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const { toast } = useToast();
  const lbl = LABELS[locale] ?? LABELS.en;

  const [section, setSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    api_limit: true, incidents: true, weekly: false, product: true, tips: false,
  });
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalGenerations: 0, rsaCount: 0, ctrCount: 0, moderationCount: 0,
    avgCtrScore: 0, avgSafetyScore: 0, thisWeek: 0,
  });

  const [profile, setProfile] = useState({ name: "Alex Johnson", email: "alex@company.com", company: "Acme Marketing", role: "" });

  useEffect(() => {
    setUsageStats(getUsageStats());
  }, []);

  const handleSave = () => {
    setSaved(true);
    toast("success", "Profile saved");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      profile,
      history: getHistory(),
      settings: { locale, notifs },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adpilot-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("success", "Account data exported");
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    toast("copy", "Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const sections: { key: Section; label: string }[] = (Object.keys(lbl.tabs) as Section[]).map((k) => ({
    key: k,
    label: lbl.tabs[k],
  }));

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[22px] font-black text-white tracking-tight">{lbl.pageTitle}</h1>
        <p className="text-sm text-white/30 mt-0.5">{lbl.pageSubtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">

        {/* Sidebar nav */}
        <motion.nav initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2">
          {sections.map(({ key, label }) => {
            const Icon = SECTION_ICONS[key];
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  section === key
                    ? "bg-indigo-500/[0.12] border border-indigo-500/20 text-white"
                    : "text-white/45 hover:text-white/75 hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", section === key ? "text-indigo-400" : "text-white/30")} />
                {label}
              </button>
            );
          })}
        </motion.nav>

        {/* Content */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <AnimatePresence mode="wait">

            {/* ── PROFILE ── */}
            {section === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{lbl.profile.title}</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-white/[0.06]">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-black text-white flex-shrink-0">
                      AJ
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{profile.name}</p>
                      <p className="text-xs text-white/35">{profile.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={lbl.profile.nameLabel}    value={profile.name}    onChange={(v) => setProfile({ ...profile, name: v })} />
                    <InputField label={lbl.profile.emailLabel}   value={profile.email}   onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
                    <InputField label={lbl.profile.companyLabel} value={profile.company} onChange={(v) => setProfile({ ...profile, company: v })} />
                    <div>
                      <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{lbl.profile.roleLabel}</label>
                      <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:border-indigo-500/40 transition-all appearance-none">
                        <option value="" className="bg-[#0d0d14] text-white/40">—</option>
                        {lbl.profile.roleOptions.map((o) => <option key={o} value={o} className="bg-[#0d0d14] text-white">{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">
                      <Globe className="w-3 h-3 inline mr-1" />
                      {lbl.profile.langLabel}
                    </label>
                    <div className="flex gap-2">
                      {([["en", "English"], ["ru", "Русский"]] as const).map(([code, label]) => (
                        <button key={code} onClick={() => setLocale(code)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", locale === code ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300" : "border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white/70")}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSave} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all", saved ? "bg-emerald-600 text-white" : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20")}>
                    {saved ? <><Check className="w-4 h-4" />{lbl.profile.savedMsg}</> : <><Save className="w-4 h-4" />{lbl.profile.saveBtn}</>}
                  </button>
                </div>

                {/* AI Usage stats */}
                <div className="px-6 py-5 border-t border-white/[0.06] bg-white/[0.01]">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> AI Usage This Session
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: Zap,       label: "RSA",    value: usageStats.rsaCount,        color: "text-indigo-400" },
                      { icon: BarChart2, label: "CTR",    value: usageStats.ctrCount,        color: "text-blue-400" },
                      { icon: Activity,  label: "Checks", value: usageStats.moderationCount, color: "text-emerald-400" },
                      { icon: Activity,  label: "Total",  value: usageStats.totalGenerations, color: "text-violet-400" },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <Icon className={cn("w-4 h-4 mx-auto mb-1.5", color)} />
                        <p className="text-lg font-black text-white">{value}</p>
                        <p className="text-[10px] text-white/30">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/20 mt-3 text-center">
                    Stored in localStorage · resets when browser data is cleared
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── API KEYS ── */}
            {section === "api" && (
              <motion.div key="api" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{lbl.api.title}</p>
                </div>
                <div className="p-6 space-y-5">
                  <p className="text-sm text-white/40 leading-relaxed">{lbl.api.desc}</p>
                  <MaskedKeyField label={lbl.api.liveKeyLabel} value="sk-apilot-live-a9f3b2e1c4d5f6a7b8c9d0e1f2a3b4c5" onCopy={() => handleCopy("live", "sk-apilot-live-a9f3b2e1c4d5f6a7b8c9d0e1f2a3b4c5")} onRegenerate={() => {}} copied={copied === "live"} copyMsg={lbl.api.copiedMsg} />
                  <MaskedKeyField label={lbl.api.testKeyLabel} value="sk-apilot-test-f1e2d3c4b5a6978869706150413223140" onCopy={() => handleCopy("test", "sk-apilot-test-f1e2d3c4b5a6978869706150413223140")} onRegenerate={() => {}} copied={copied === "test"} copyMsg={lbl.api.copiedMsg} />
                  <div className="pt-2 border-t border-white/[0.06]">
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">{lbl.api.openAILabel}</p>
                    <p className="text-xs text-white/35 mb-3">{lbl.api.openAIDesc}</p>
                    <code className="block text-xs font-mono text-indigo-300/70 bg-indigo-500/[0.06] border border-indigo-500/15 px-4 py-3 rounded-xl">
                      {"# .env.local\nOPENAI_API_KEY=sk-proj-...\nOPENAI_MODEL=gpt-4o-mini"}
                    </code>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {section === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{lbl.notifications.title}</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {lbl.notifications.items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white/80">{item.label}</p>
                        <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key] })}
                        className={cn("relative w-10 h-6 rounded-full border transition-all flex-shrink-0", notifs[item.key] ? "bg-indigo-600 border-indigo-500/50" : "bg-white/[0.06] border-white/[0.1]")}
                      >
                        <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", notifs[item.key] ? "left-4.5 translate-x-0" : "left-0.5")} style={{ left: notifs[item.key] ? "calc(100% - 22px)" : "2px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── BILLING ── */}
            {section === "billing" && (
              <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.05] p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{lbl.billing.currentPlan}</p>
                      <p className="text-2xl font-black text-white">{lbl.billing.planName}</p>
                      <p className="text-sm text-white/45 mt-1">{lbl.billing.planDesc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{lbl.billing.amount}</p>
                      <p className="text-xs text-white/35 mt-1">{lbl.billing.nextBilling}: {lbl.billing.nextDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5 pt-5 border-t border-white/[0.08]">
                    <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">{lbl.billing.upgradeBtn}</button>
                    <button className="px-4 py-2 rounded-xl border border-white/[0.1] text-white/50 hover:text-white hover:border-white/20 font-medium text-sm transition-all">{lbl.billing.manageBtn}</button>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{lbl.billing.invoicesLabel}</p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <CreditCard className="w-3.5 h-3.5" />
                      {lbl.billing.paymentMethod}: {lbl.billing.card}
                    </div>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {lbl.billing.invoices.map((inv) => (
                      <div key={inv.date} className="flex items-center justify-between px-6 py-3.5">
                        <span className="text-sm text-white/55">{inv.date}</span>
                        <span className="text-sm font-mono text-white/70">{inv.amount}</span>
                        <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">{inv.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PRIVACY ── */}
            {section === "privacy" && (
              <motion.div key="privacy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{lbl.privacy.twoFALabel}</p>
                      <p className="text-xs text-white/35 mt-0.5">{lbl.privacy.twoFADesc}</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all flex-shrink-0">{lbl.privacy.enableBtn}</button>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06]">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{lbl.privacy.sessionsLabel}</p>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {lbl.privacy.sessions.map((sess, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 px-6 py-3.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/80">{sess.device}</p>
                          <p className="text-xs text-white/30 mt-0.5">{sess.location} · {sess.time}</p>
                        </div>
                        {sess.current ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">Current</span>
                        ) : (
                          <button className="text-xs text-red-400/70 hover:text-red-400 font-semibold transition-colors">{lbl.privacy.revokeBtn}</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Export data */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">Data Export</p>
                  <p className="text-sm font-bold text-white mb-1">Export your account data</p>
                  <p className="text-xs text-white/35 mb-4">Download a JSON file containing your profile, history, and settings. No server calls — everything comes from your browser.</p>
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.1] text-white/55 hover:text-white hover:border-white/20 font-semibold text-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export data (JSON)
                  </button>
                </div>

                <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-6">
                  <p className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest mb-3">{lbl.privacy.dangerLabel}</p>
                  <p className="text-sm font-bold text-white mb-1">{lbl.privacy.deleteAccount}</p>
                  <p className="text-xs text-white/35 mb-4">{lbl.privacy.deleteDesc}</p>
                  <button className="px-4 py-2 rounded-xl border border-red-500/25 text-red-400 hover:bg-red-500/10 font-semibold text-sm transition-all">{lbl.privacy.deleteBtn}</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

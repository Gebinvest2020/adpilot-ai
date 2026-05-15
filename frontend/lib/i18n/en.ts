import type { Translations } from "./types";

export const en: Translations = {
  locale: "en",

  nav: {
    features: "Features",
    pricing: "Pricing",
    docs: "Docs",
    signIn: "Sign In",
    getStarted: "Get Started",
    getStartedFree: "Get Started Free",
  },

  sidebar: {
    dashboard: "Dashboard",
    rsaGenerator: "RSA Generator",
    moderationChecker: "Moderation Checker",
    ctrAnalyzer: "CTR Analyzer",
    settings: "Settings",
    plan: "Growth Plan",
  },

  hero: {
    badge: "Powered by GPT-4 + Claude",
    headline1: "Generate Google Ads",
    headline2: "That Convert",
    subtitle:
      "AI-powered RSA ad generation, moderation screening, and CTR analysis. Stop guessing — start converting with ads your audience can't ignore.",
    cta1: "Start Free Trial",
    cta2: "Watch Demo",
    trustBadge: "No credit card required · Free 14-day trial · Cancel anytime",
    stats: {
      adsLabel: "Ads Generated",
      ctrLabel: "Avg CTR Improvement",
      countriesLabel: "Countries",
      marketersLabel: "Active Marketers",
    },
  },

  features: {
    badge: "Features",
    headline: "Everything you need to",
    headlineGradient: "dominate Google Ads",
    subtitle:
      "Six powerful AI tools that work together to maximize your ad performance and eliminate wasted spend.",
    mostPopular: "Most Popular",
    comingSoon: "Coming Soon",
    items: [
      {
        title: "RSA Generator",
        description:
          "Generate 15 headline + 4 description combos optimized for maximum CTR using GPT-4 and real Google Ads data.",
      },
      {
        title: "Moderation Shield",
        description:
          "Pre-screen ads before submission to avoid Google disapprovals, account warnings, and costly policy violations.",
      },
      {
        title: "CTR Analyzer",
        description:
          "Deep analysis of your ad performance with AI-powered suggestions to identify weak spots and boost click-through rates.",
      },
      {
        title: "Keyword Intelligence",
        description:
          "AI-powered keyword recommendations tailored to your niche. Discover high-intent, low-competition terms instantly.",
      },
      {
        title: "A/B Testing",
        description:
          "Generate multiple ad variants and test winning combinations. Data-driven iteration at the speed of AI.",
      },
      {
        title: "Conversion Booster",
        description:
          "Turn weak, underperforming ads into high-converting copy with one click. AI rewrites, you approve.",
      },
    ],
  },

  howItWorks: {
    badge: "How It Works",
    headline: "From idea to live ad",
    headlineGradient: "in under 60 seconds",
    subtitle:
      "No ad expertise required. Our AI does the heavy lifting so you can focus on growing your business.",
    steps: [
      {
        title: "Describe Your Campaign",
        description:
          "Paste your product or service details, target keywords, and campaign goals. Our AI understands context and nuance.",
      },
      {
        title: "AI Generates Variations",
        description:
          "GPT-4 and Claude analyze thousands of top-performing ads to craft multiple optimized variants in seconds.",
      },
      {
        title: "Review & Launch",
        description:
          "Approve your favorite variations, check moderation scores, and export directly to Google Ads. Launch with confidence.",
      },
    ],
  },

  testimonials: {
    badge: "Social Proof",
    headline: "Trusted by marketers who",
    headlineGradient: "demand results",
    subtitle:
      "Over 10,000 marketers in 50+ countries use AdPilot AI to write better ads, faster.",
    social: {
      join: "Join {n}+ marketers",
      rating: "{score}/5 from {count}+ reviews",
      g2: "G2 Leader · Spring 2025",
    },
  },

  cta: {
    badge: "No credit card required",
    headline: "Start converting more",
    headlineGradient: "clicks today",
    subtitle:
      "Join 10,000+ marketers already using AdPilot AI to write better ads, faster. Your first 14 days are on us.",
    primary: "Start Free Trial",
    secondary: "View all pricing plans",
    trust:
      "14-day free trial · No credit card required · Cancel anytime · SOC2 Type II compliant",
  },

  dashboard: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    subtitle: "Here's what's happening with your campaigns today.",
    quickActionsTitle: "Quick Actions",
    openTool: "Open tool",
    statLabels: [
      "Total Ads Generated",
      "Avg CTR Improvement",
      "Moderation Pass Rate",
      "Active Campaigns",
    ],
    quickActionDescs: [
      "Create 15-headline + 4-description RSA ads in seconds",
      "Pre-screen your ads for Google policy violations",
      "Get AI-powered CTR scores and improvement suggestions",
    ],
    campaigns: {
      title: "Recent Campaigns",
      viewAll: "View all",
      columns: ["Campaign", "Status", "CTR", "Impressions", "Clicks", "Improvement"],
      status: { active: "active", paused: "paused", completed: "completed" },
    },
  },

  rsa: {
    pageTitle: "RSA Generator",
    pageSubtitle:
      "AI-powered Responsive Search Ad copy — 15 headlines · 4 descriptions · CTA suggestions · moderation risk check",
    panelTitle: "Campaign Setup",

    nicheLabel: "Business / Niche",
    nichePlaceholder:
      "Describe your business in detail. E.g., 'Digital marketing agency specializing in Google Ads for e-commerce brands. We offer PPC management, landing page optimization, and conversion rate improvement.'",
    nicheHint: "More detail produces more targeted ad copy",

    countryLabel: "Target Country",
    countryPlaceholder: "Country...",
    languageLabel: "Language",
    languagePlaceholder: "Language...",
    goalLabel: "Campaign Goal",
    goalPlaceholder: "Goal...",
    toneLabel: "Ad Tone",
    tonePlaceholder: "Tone...",

    goals: [
      "Drive Conversions",
      "Generate Leads",
      "Increase Traffic",
      "Brand Awareness",
      "App Installs",
      "Product Sales",
      "Local Foot Traffic",
    ],
    tones: [
      "Professional",
      "Persuasive",
      "Urgent",
      "Friendly",
      "Authoritative",
      "Casual",
      "Luxury",
      "Technical",
    ],

    generateBtn: "Generate RSA Ads",
    generatingBtn: "Generating...",
    whatYouGet: ["15 Headlines", "4 Descriptions", "CTA Suggestions", "Risk Score"],

    loadingTitle: "Generating your ads...",
    loadingSteps: [
      "Analyzing niche & market context...",
      "Researching top-performing ads...",
      "Generating 15 headlines...",
      "Crafting 4 descriptions...",
      "Optimizing character limits...",
      "Running moderation check...",
      "Finalizing & scoring results...",
    ],

    emptyTitle: "Your RSA ads will appear here",
    emptySubtitle:
      'Fill in your campaign details on the left and click "Generate RSA Ads" to create 15 headlines, 4 descriptions, CTA suggestions, and a moderation risk check.',

    copyAllBtn: "Copy All",
    exportBtn: "Export",
    regenerateBtn: "Regenerate",

    tabHeadlines: "Headlines ({n})",
    tabDescriptions: "Descriptions ({n})",
    tabCta: "CTA Ideas",
    tabModeration: "Risk Check",

    previewTitle: "Google Search Preview",
    headlinesHeader: "15 Headlines · max 30 chars each",
    descriptionsHeader: "4 Descriptions · max 90 chars each",
    ctaTabHeader: "CTA Suggestions · Click any to copy",
    ctaTabDesc:
      "High-converting call-to-action phrases tailored to your campaign goal. Use these directly in headlines, ad extensions, or as landing page CTAs.",

    generatedLabel: "{h} headlines · {d} descriptions generated",

    moderationHeader: "Moderation Risk Score",
    safetyScoreLabel: "Safety score out of 100",
    safetyBarHint: "Higher score = safer for Google approval",
    safeHeadlinesLabel: "Safe headlines",
    flaggedIssuesLabel: "Flagged issues",
    aiFixesLabel: "AI fixes ready",
    allClearTitle: "All Clear — No Issues Found",
    allClearSub: "No Google Ads policy violations detected",
    issuesFoundLabel: "{n} Issues Found — AI Fixes Included",
    saferAltLabel: "Safer Alternative",

    strengthLabels: {
      excellent: "excellent",
      good: "good",
      average: "average",
      weak: "weak",
    },
    riskLabels: { low: "LOW RISK", medium: "MEDIUM RISK", high: "HIGH RISK" },
    severityLabels: { low: "low", medium: "medium", high: "high" },
  },
};

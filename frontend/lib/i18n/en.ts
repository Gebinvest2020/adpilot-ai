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
    history: "History",
    settings: "Settings",
    plan: "Growth Plan",
  },

  hero: {
    badge: "Powered by GPT-5 + Claude",
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
          "Generate 15 headline + 4 description combos optimized for maximum CTR using GPT-5 and real Google Ads data.",
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
          "GPT-5 and Claude analyze thousands of top-performing ads to craft multiple optimized variants in seconds.",
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
    loadingSubtitle: "Powered by AdPilot AI",
    loadingSteps: [
      "Analyzing business niche",
      "Extracting product and location",
      "Checking sensitive category risks",
      "Generating RSA headlines",
      "Building descriptions and CTAs",
      "Final moderation scan",
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
    aiModeOpenAI: "AI Mode: OpenAI",
    aiModeFallback: "AI Mode: Fallback",
  },

  pricing: {
    badge: "Pricing",
    headline: "Simple, transparent",
    headlineGradient: "pricing",
    subtitle: "Start free, scale as you grow. No hidden fees, no surprises.",
    monthly: "Monthly",
    annual: "Annual",
    mostPopular: "Most Popular",
    perMonth: "/month",
    saveYear: "Save ${amount}/year",
    compareTitle: "Compare all features",
    tableFeatureCol: "Feature",
    faqText: "Have questions?",
    faqLink: "Read our FAQ",
    faqOr: "or",
    salesLink: "contact sales",
    unlimited: "Unlimited",
    basic: "Basic",
    advanced: "Advanced",
    callsPerMonth: "{n} calls/mo",
    plans: {
      starter: {
        name: "Starter",
        description: "Perfect for solopreneurs and small businesses just getting started with Google Ads.",
        cta: "Start Free Trial",
        features: [
          "100 AI-generated ads per month",
          "RSA Generator (15 headlines + 4 descriptions)",
          "Basic moderation checker",
          "CTR score analyzer",
          "Email support (48h response)",
          "Export to CSV/JSON",
          "1 user seat",
        ],
      },
      growth: {
        name: "Growth",
        description: "For growing agencies and marketing teams scaling their Google Ads performance.",
        cta: "Start Free Trial",
        features: [
          "500 AI-generated ads per month",
          "Everything in Starter",
          "Advanced moderation shield",
          "Deep CTR analysis with AI fixes",
          "Keyword intelligence engine",
          "A/B testing variant generator",
          "API access (1,000 calls/mo)",
          "Priority support (4h response)",
          "5 user seats",
          "White-label exports",
        ],
      },
      enterprise: {
        name: "Enterprise",
        description: "Unlimited power for agencies managing large portfolios and enterprise accounts.",
        cta: "Contact Sales",
        features: [
          "Unlimited AI-generated ads",
          "Everything in Growth",
          "Dedicated success manager",
          "Custom AI model fine-tuning",
          "Full white-label solution",
          "Custom integrations (Google Ads API, HubSpot, etc.)",
          "SSO & team management",
          "Unlimited API access",
          "Unlimited user seats",
          "SLA: 1h response, 99.9% uptime",
        ],
      },
    },
    table: {
      adsPerMonth: "AI-generated ads/month",
      rsaGenerator: "RSA Generator",
      moderationChecker: "Moderation Checker",
      ctrAnalyzer: "CTR Analyzer",
      keywordIntelligence: "Keyword Intelligence",
      abTesting: "A/B Testing",
      apiAccess: "API Access",
      userSeats: "User seats",
      whiteLabelExports: "White-label exports",
      customAiFineTuning: "Custom AI fine-tuning",
      dedicatedSupport: "Dedicated support",
      ssoManagement: "SSO & team management",
    },
  },

  faq: {
    badge: "FAQ",
    headline: "Frequently Asked",
    headlineGradient: "Questions",
    subtitle: "Everything you need to know about AdPilot AI. Can't find the answer? Contact our support team.",
    allCategory: "All",
    categories: { general: "General", billing: "Billing", technical: "Technical", account: "Account" },
    noResults: "No questions found for this category.",
    contactTitle: "Still have questions?",
    contactSubtitle: "Our support team is available Monday–Friday, 9 AM–6 PM CET. We typically respond within 4 hours.",
    contactBtn: "Contact Support",
  },

  moderation: {
    pageTitle: "Moderation Checker",
    pageSubtitle: "AI-powered Google Ads policy risk analyzer — catch violations before they suspend your account",

    presetsLabel: "Quick examples:",
    presets: ["Crypto Trading", "Investments", "Medical", "Supplements", "Finance", "Make Money Online"],

    adCopyLabel: "Ad Copy",
    adCopyPlaceholder: "Paste your headlines, descriptions, and CTAs here — one per line…",
    adCopyHint: "Headlines ≤ 30 chars · Descriptions ≤ 90 chars · All text types accepted",
    industryLabel: "Industry (optional)",
    industryPlaceholder: "Select for better context...",
    industries: [
      "Technology & SaaS", "E-commerce & Retail", "Finance & Insurance",
      "Healthcare & Medical", "Legal Services", "Real Estate",
      "Education & Courses", "Travel & Hospitality", "Automotive",
      "Crypto & Web3", "Supplements & Nutraceuticals",
      "Employment & HR", "Other",
    ],

    checkBtn: "Analyze with AI",
    checkingBtn: "Analyzing...",
    recheckBtn: "Re-analyze",

    emptyTitle: "Ready to analyze",
    emptySubtitle: "Paste your ad copy on the left and click Analyze",
    emptyHints: [
      "Detects 8 policy risk categories",
      "Provides safer rewrites for every violation",
      "Works for all Google Ads sensitive categories",
    ],

    loadingTitle: "Scanning for policy risks...",
    loadingSteps: [
      "Parsing ad copy structure",
      "Scanning policy categories",
      "Checking financial & medical claims",
      "Generating safer alternatives",
    ],

    overallScoreLabel: "Safety Score",
    riskLow: "LOW RISK",
    riskMedium: "MEDIUM RISK",
    riskHigh: "HIGH RISK",
    summaryLabel: "Assessment",

    flagsLabel: "Policy Violations",
    flagsEmpty: "No violations detected",
    triggerLabel: "Flagged text",
    explanationLabel: "Why it's risky",
    saferVersionLabel: "Safer version",

    safeItemsLabel: "Compliant Elements",
    noIssuesTitle: "All clear",
    noIssuesSub: "No policy violations detected in your ad copy.",

    suspensionRiskLabel: "High suspension risk",
    policyViolationLabel: "Potential policy violation",

    aiAnalysisLabel: "AI Strategy Analysis",

    severityHigh: "High",
    severityMedium: "Medium",
    severityLow: "Low",

    categoryMisleading: "Misleading Claims",
    categoryUnrealistic: "Unrealistic Promises",
    categoryFinancial: "Financial Risk",
    categoryCrypto: "Crypto Risk",
    categoryHealthcare: "Healthcare Claims",
    categorySensational: "Sensational Language",
    categoryEmployment: "Employment Claims",
    categoryOther: "Other Violation",
    aiModeOpenAI: "AI Mode: OpenAI",
    aiModeFallback: "AI Mode: Fallback",
  },

  ctr: {
    pageTitle: "CTR Analyzer",
    pageSubtitle: "Get AI-powered CTR scores and actionable improvement suggestions",
    inputTitle: "Ad Copy to Analyze",
    adCopyLabel: "Paste Your Ad Copy",
    adCopyPlaceholder: "Headline 1: Generate High-CTR Google Ads\nHeadline 2: AI-Powered Ad Copy Tool\nHeadline 3: Start Free Trial Today\n\nDescription 1: Write Google Ads that convert with AI...",
    keywordsLabel: "Target Keywords",
    keywordsPlaceholder: "Google Ads tool, AI ad generator, CTR optimizer...",
    industryLabel: "Industry / Niche",
    industryPlaceholder: "Select industry...",
    industries: [
      "Technology & SaaS", "E-commerce & Retail", "Finance & Insurance",
      "Healthcare", "Legal Services", "Real Estate", "Education", "Other",
    ],
    competitorTitle: "Competitor Analysis",
    competitorDesc: "Compare against top ads in your niche",
    analyzeBtn: "Analyze CTR",
    analyzingBtn: "Analyzing...",
    reanalyzingBtn: "Re-analyze",
    emptyMsg: "Paste your ad copy and click analyze",
    overallScoreLabel: "Overall CTR Score",
    breakdownLabel: "Score Breakdown",
    breakdownNames: {
      headlineStrength: "Headline Strength",
      callToAction: "Call to Action",
      keywordRelevance: "Keyword Relevance",
      emotionalAppeal: "Emotional Appeal",
      uniqueness: "Uniqueness",
    },
    recommendationsLabel: "AI Recommendations",
    improveBtn: "Improve with AI",
    hideBtn: "Hide",
    improvedVersionLabel: "AI-Improved Version",
    scoreExcellent: "Excellent",
    scoreAverage: "Average",
    scoreNeedsWork: "Needs Work",
    aiModeOpenAI: "AI Mode: OpenAI",
    aiModeFallback: "AI Mode: Fallback",
  },

  support: {
    badge: "Support",
    headline: "How can we",
    headlineGradient: "help you?",
    subtitle: "Our team is here to help. Choose a topic below or send us a message directly.",
    formTitle: "Send a message",
    nameLabel: "Your name",
    namePlaceholder: "John Smith",
    emailLabel: "Email address",
    emailPlaceholder: "john@company.com",
    subjectLabel: "Subject",
    subjectOptions: ["General question", "Billing & subscription", "Technical issue", "Feature request"],
    messageLabel: "Message",
    messagePlaceholder: "Describe your issue or question in detail...",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    successTitle: "Message sent!",
    successMsg: "We received your message and will respond within 4 business hours.",
    statusTitle: "System Status",
    statusAllOperational: "All systems operational",
    serviceNames: ["RSA Generator", "Moderation API", "CTR Analyzer", "AI Processing"],
    resourcesTitle: "Quick Resources",
    resources: [
      { title: "Documentation", desc: "Guides, tutorials and API reference", href: "/docs" },
      { title: "API Reference",  desc: "Full REST API documentation",          href: "/docs/api" },
      { title: "FAQ",            desc: "Answers to common questions",           href: "/faq" },
    ],
  },

  login: {
    headline: "Welcome back",
    subtitle: "Sign in to your AdPilot AI account",
    leftHeadline: "Write better ads.",
    leftHeadlineGradient: "Convert more clicks.",
    leftSubtitle: "Join 10,000+ marketers who trust AdPilot AI to generate high-CTR Google Ads, avoid moderation bans, and scale their campaigns.",
    stats: [
      { value: "340%", label: "Avg CTR boost" },
      { value: "98.2%", label: "Approval rate" },
      { value: "10K+", label: "Ads generated" },
    ],
    testimonialQuote: "AdPilot AI is the secret weapon behind our 340% CTR improvement. I can't imagine running Google Ads without it now.",
    testimonialName: "Sarah Chen",
    testimonialRole: "Head of Marketing, TechFlow",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signInBtn: "Sign In",
    orDivider: "or",
    noAccount: "Don't have an account?",
    signUpFree: "Sign up free",
  },

  register: {
    headline: "Create your account",
    subtitle: "Start your 14-day free trial today",
    leftHeadline: "Everything you need to",
    leftHeadlineGradient: "win at Google Ads.",
    leftSubtitle: "Start for free. No credit card required. Upgrade whenever you're ready to scale.",
    perks: [
      "14-day free trial, no credit card needed",
      "Generate 15-headline RSA ads in seconds",
      "Pre-screen ads for Google policy violations",
      "Join 10,000+ performance marketers",
    ],
    nameLabel: "Full name",
    namePlaceholder: "Jane Smith",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    createBtn: "Create Account — Free",
    orDivider: "or",
    legalText: "By signing up, you agree to our",
    legalTerms: "Terms",
    legalAnd: "and",
    legalPrivacy: "Privacy Policy",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
  },

  footer: {
    brandDesc: "The AI-powered Google Ads platform trusted by 10,000+ marketers to generate high-CTR ads and boost conversions.",
    copyright: "© 2025 AdPilot AI, Inc. All rights reserved.",
    poweredBy: "Powered by",
    columns: {
      product: "Product",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
    },
    links: {
      rsaGenerator: "RSA Generator",
      moderationChecker: "Moderation Checker",
      ctrAnalyzer: "CTR Analyzer",
      pricing: "Pricing",
      about: "About",
      blog: "Blog",
      careers: "Careers",
      pressKit: "Press Kit",
      documentation: "Documentation",
      apiReference: "API Reference",
      statusPage: "Status Page",
      support: "Support",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      cookiePolicy: "Cookie Policy",
    },
  },
};

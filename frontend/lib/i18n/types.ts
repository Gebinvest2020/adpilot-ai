export type Locale = "en" | "ru";

export interface Translations {
  locale: Locale;

  nav: {
    features: string;
    pricing: string;
    docs: string;
    signIn: string;
    getStarted: string;
    getStartedFree: string;
  };

  sidebar: {
    dashboard: string;
    rsaGenerator: string;
    moderationChecker: string;
    ctrAnalyzer: string;
    settings: string;
    plan: string;
  };

  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    trustBadge: string;
    stats: {
      adsLabel: string;
      ctrLabel: string;
      countriesLabel: string;
      marketersLabel: string;
    };
  };

  features: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    mostPopular: string;
    comingSoon: string;
    items: { title: string; description: string }[];
  };

  howItWorks: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };

  testimonials: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    social: {
      join: string;
      rating: string;
      g2: string;
    };
  };

  cta: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    primary: string;
    secondary: string;
    trust: string;
  };

  dashboard: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    subtitle: string;
    quickActionsTitle: string;
    openTool: string;
    statLabels: [string, string, string, string];
    quickActionDescs: [string, string, string];
    campaigns: {
      title: string;
      viewAll: string;
      columns: [string, string, string, string, string, string];
      status: { active: string; paused: string; completed: string };
    };
  };

  rsa: {
    pageTitle: string;
    pageSubtitle: string;
    panelTitle: string;
    nicheLabel: string;
    nichePlaceholder: string;
    nicheHint: string;
    countryLabel: string;
    countryPlaceholder: string;
    languageLabel: string;
    languagePlaceholder: string;
    goalLabel: string;
    goalPlaceholder: string;
    goals: string[];
    toneLabel: string;
    tonePlaceholder: string;
    tones: string[];
    generateBtn: string;
    generatingBtn: string;
    whatYouGet: [string, string, string, string];
    loadingTitle: string;
    loadingSubtitle: string;
    loadingSteps: [string, string, string, string, string, string];
    emptyTitle: string;
    emptySubtitle: string;
    copyAllBtn: string;
    exportBtn: string;
    regenerateBtn: string;
    tabHeadlines: string;
    tabDescriptions: string;
    tabCta: string;
    tabModeration: string;
    previewTitle: string;
    headlinesHeader: string;
    descriptionsHeader: string;
    ctaTabHeader: string;
    ctaTabDesc: string;
    generatedLabel: string;
    moderationHeader: string;
    safetyScoreLabel: string;
    safetyBarHint: string;
    safeHeadlinesLabel: string;
    flaggedIssuesLabel: string;
    aiFixesLabel: string;
    allClearTitle: string;
    allClearSub: string;
    issuesFoundLabel: string;
    saferAltLabel: string;
    strengthLabels: { excellent: string; good: string; average: string; weak: string };
    riskLabels: { low: string; medium: string; high: string };
    severityLabels: { low: string; medium: string; high: string };
  };

  pricing: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    monthly: string;
    annual: string;
    mostPopular: string;
    perMonth: string;
    saveYear: string;
    compareTitle: string;
    tableFeatureCol: string;
    faqText: string;
    faqLink: string;
    faqOr: string;
    salesLink: string;
    unlimited: string;
    basic: string;
    advanced: string;
    callsPerMonth: string;
    plans: {
      starter:    { name: string; description: string; cta: string; features: string[] };
      growth:     { name: string; description: string; cta: string; features: string[] };
      enterprise: { name: string; description: string; cta: string; features: string[] };
    };
    table: {
      adsPerMonth: string;
      rsaGenerator: string;
      moderationChecker: string;
      ctrAnalyzer: string;
      keywordIntelligence: string;
      abTesting: string;
      apiAccess: string;
      userSeats: string;
      whiteLabelExports: string;
      customAiFineTuning: string;
      dedicatedSupport: string;
      ssoManagement: string;
    };
  };

  faq: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    allCategory: string;
    categories: { general: string; billing: string; technical: string; account: string };
    noResults: string;
    contactTitle: string;
    contactSubtitle: string;
    contactBtn: string;
  };

  moderation: {
    pageTitle: string;
    pageSubtitle: string;
    headlinesLabel: string;
    descriptionsLabel: string;
    addBtn: string;
    industryLabel: string;
    industryPlaceholder: string;
    industries: string[];
    checkBtn: string;
    checkingBtn: string;
    emptyMsg: string;
    riskLow: string;
    riskMedium: string;
    riskHigh: string;
    complianceTitle: string;
    issuesFoundDesc: string;
    issuesLabel: string;
    compliantLabel: string;
    fixBtn: string;
    highLabel: string;
    mediumLabel: string;
    lowLabel: string;
  };

  ctr: {
    pageTitle: string;
    pageSubtitle: string;
    inputTitle: string;
    adCopyLabel: string;
    adCopyPlaceholder: string;
    keywordsLabel: string;
    keywordsPlaceholder: string;
    industryLabel: string;
    industryPlaceholder: string;
    industries: string[];
    competitorTitle: string;
    competitorDesc: string;
    analyzeBtn: string;
    analyzingBtn: string;
    emptyMsg: string;
    overallScoreLabel: string;
    breakdownLabel: string;
    recommendationsLabel: string;
    improveBtn: string;
    hideBtn: string;
    improvedVersionLabel: string;
    scoreExcellent: string;
    scoreAverage: string;
    scoreNeedsWork: string;
  };

  support: {
    badge: string;
    headline: string;
    headlineGradient: string;
    subtitle: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectOptions: [string, string, string, string];
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    successTitle: string;
    successMsg: string;
    statusTitle: string;
    statusAllOperational: string;
    serviceNames: [string, string, string, string];
    resourcesTitle: string;
    resources: [
      { title: string; desc: string; href: string },
      { title: string; desc: string; href: string },
      { title: string; desc: string; href: string },
    ];
  };

  login: {
    headline: string;
    subtitle: string;
    leftHeadline: string;
    leftHeadlineGradient: string;
    leftSubtitle: string;
    stats: [
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
    ];
    testimonialQuote: string;
    testimonialName: string;
    testimonialRole: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    signInBtn: string;
    orDivider: string;
    noAccount: string;
    signUpFree: string;
  };

  register: {
    headline: string;
    subtitle: string;
    leftHeadline: string;
    leftHeadlineGradient: string;
    leftSubtitle: string;
    perks: [string, string, string, string];
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    createBtn: string;
    orDivider: string;
    legalText: string;
    legalTerms: string;
    legalAnd: string;
    legalPrivacy: string;
    haveAccount: string;
    signIn: string;
  };

  footer: {
    brandDesc: string;
    copyright: string;
    poweredBy: string;
    columns: {
      product: string;
      company: string;
      resources: string;
      legal: string;
    };
    links: {
      rsaGenerator: string;
      moderationChecker: string;
      ctrAnalyzer: string;
      pricing: string;
      about: string;
      blog: string;
      careers: string;
      pressKit: string;
      documentation: string;
      apiReference: string;
      statusPage: string;
      support: string;
      privacyPolicy: string;
      termsOfService: string;
      cookiePolicy: string;
    };
  };
}

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
    loadingSteps: [string, string, string, string, string, string, string];
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
}

export const dashboardStats = [
  { label: "Total Ads Generated", value: "1,247", change: "+18%", trend: "up" },
  { label: "Avg CTR Improvement", value: "+340%", change: "+12%", trend: "up" },
  { label: "Moderation Pass Rate", value: "98.2%", change: "+2.1%", trend: "up" },
  { label: "Active Campaigns", value: "23", change: "+4", trend: "up" },
];

export const recentCampaigns = [
  {
    id: "1",
    name: "SaaS Product Launch Q2",
    status: "active",
    ctr: "8.4%",
    impressions: "142,300",
    clicks: "11,953",
    budget: "$2,400",
    improvement: "+340%",
  },
  {
    id: "2",
    name: "E-commerce Summer Sale",
    status: "active",
    ctr: "6.2%",
    impressions: "89,100",
    clicks: "5,524",
    budget: "$1,800",
    improvement: "+210%",
  },
  {
    id: "3",
    name: "B2B Lead Generation",
    status: "paused",
    ctr: "4.8%",
    impressions: "34,500",
    clicks: "1,656",
    budget: "$950",
    improvement: "+145%",
  },
  {
    id: "4",
    name: "Local Services Ads",
    status: "active",
    ctr: "9.1%",
    impressions: "22,800",
    clicks: "2,075",
    budget: "$600",
    improvement: "+412%",
  },
  {
    id: "5",
    name: "App Install Campaign",
    status: "completed",
    ctr: "5.7%",
    impressions: "310,000",
    clicks: "17,670",
    budget: "$5,200",
    improvement: "+280%",
  },
];

export const rsaExampleResults = [
  {
    id: "1",
    ctrScore: 94,
    headlines: [
      "AI-Powered Google Ads Platform",
      "Generate High-CTR Ads in Seconds",
      "Stop Wasting Ad Budget Today",
      "10x Your Google Ads ROI",
      "Trusted by 10,000+ Marketers",
      "Free Trial — No Credit Card",
    ],
    descriptions: [
      "AdPilot AI generates RSA ads that convert. Avoid moderation bans, boost CTR by 340%, and launch winning campaigns in minutes.",
      "Join 10,000+ marketers using AI to write Google Ads. Start your free trial and see results in 24 hours. No expertise required.",
    ],
  },
  {
    id: "2",
    ctrScore: 88,
    headlines: [
      "Write Google Ads 10x Faster",
      "AI Ad Copy That Actually Converts",
      "Eliminate Disapproved Ads Forever",
      "Smart Ads for Smart Marketers",
      "From Idea to Live Ad in 60 Sec",
      "Beat Your Competitors With AI",
    ],
    descriptions: [
      "Generate 15 headlines and 4 descriptions optimized for maximum CTR. Pre-screen for moderation issues before you submit.",
      "Our AI analyzes thousands of top-performing ads to craft your perfect copy. Improve conversions and reduce wasted spend.",
    ],
  },
  {
    id: "3",
    ctrScore: 91,
    headlines: [
      "Google Ads Made Simple With AI",
      "Higher CTR. Lower CPC. Real Results.",
      "Your AI-Powered Ad Copywriter",
      "Launch Perfect Ads Every Time",
      "Ad Copy That Passes Google Review",
      "Maximize Every Click You Pay For",
    ],
    descriptions: [
      "Stop guessing what works. AdPilot AI uses GPT-4 and Claude to write ads your audience can't ignore. Start free today.",
      "Built for performance marketers who demand results. CTR analyzer, moderation shield, and RSA generator in one platform.",
    ],
  },
];

export const moderationResults = {
  overallRisk: 72,
  riskLevel: "MEDIUM" as const,
  flaggedItems: [
    {
      type: "Superlative Language",
      severity: "medium" as const,
      item: "Best Google Ads Tool in the World",
      explanation: "Google restricts absolute claims like 'best', 'top', '#1' without substantiation.",
      suggestion: "Try: 'Award-Winning Google Ads Tool' or 'Top-Rated by 10K+ Marketers'",
    },
    {
      type: "Excessive Punctuation",
      severity: "low" as const,
      item: "Get Results NOW!!!",
      explanation: "Multiple exclamation marks violate Google's editorial policies.",
      suggestion: "Try: 'Get Results Now' or 'See Immediate Results'",
    },
    {
      type: "Trademark Terms",
      severity: "high" as const,
      item: "Google-Certified Ad Platform",
      explanation: "Using Google's trademark without authorization can cause disapproval.",
      suggestion: "Remove trademark reference or obtain proper authorization.",
    },
  ],
  safeItems: [
    "Generate High-Converting Ads",
    "Start Your Free Trial Today",
    "AI-Powered Ad Optimization",
    "No Credit Card Required",
  ],
};

export const ctrAnalysisResults = {
  overallScore: 67,
  breakdown: [
    { name: "Headline Strength", score: 72, status: "good" as const },
    { name: "Call to Action", score: 45, status: "needs-work" as const },
    { name: "Keyword Relevance", score: 88, status: "excellent" as const },
    { name: "Emotional Appeal", score: 60, status: "average" as const },
    { name: "Uniqueness", score: 55, status: "average" as const },
  ],
  recommendations: [
    "Add a stronger urgency trigger in at least 2 headlines (e.g., 'Today Only', 'Limited Time')",
    "Your CTA 'Click Here' is too generic — try 'Start Free Trial', 'Get Instant Access', or 'See Pricing'",
    "Include a specific number or stat — ads with numbers get 36% higher CTR (e.g., '10x ROI', 'Save 3 Hours/Day')",
    "Add social proof to one description — '10,000+ marketers trust AdPilot' builds credibility instantly",
    "Test a question-based headline — 'Tired of Wasted Ad Spend?' resonates with pain points",
    "Your descriptions are passive — use active voice and direct benefits ('You get', 'You'll see')",
    "Consider adding your brand name in headline 3 for recognition and trust",
  ],
};

export const testimonials = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Head of Marketing",
    company: "TechFlow",
    initials: "SC",
    color: "from-purple-500 to-indigo-600",
    rating: 5,
    quote: "AdPilot AI increased our CTR by 340% in the first month. I was skeptical at first, but the RSA generator produces ad copy that genuinely converts. Our CPC dropped by 40% simultaneously.",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "PPC Specialist",
    company: "GrowthLabs",
    initials: "MR",
    color: "from-blue-500 to-cyan-600",
    rating: 5,
    quote: "Finally stopped getting ads disapproved. The moderation checker has saved us from 3 potential account suspensions. Worth every penny just for the peace of mind.",
  },
  {
    id: "3",
    name: "Aisha Patel",
    role: "Founder & CEO",
    company: "LaunchPad Studios",
    initials: "AP",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    quote: "I used to spend 4 hours writing ad copy. Now it takes 15 minutes. The AI understands context and tone incredibly well — our B2B ads sound professional and technical, exactly what our clients need.",
  },
  {
    id: "4",
    name: "James O'Brien",
    role: "Digital Marketing Director",
    company: "Apex Commerce",
    initials: "JO",
    color: "from-cyan-500 to-blue-600",
    rating: 5,
    quote: "The CTR analyzer is insanely detailed. It told us exactly why our ads were underperforming and gave actionable fixes. First week after applying suggestions, conversions up 180%.",
  },
  {
    id: "5",
    name: "Priya Sharma",
    role: "Performance Marketing Lead",
    company: "Nexus Media",
    initials: "PS",
    color: "from-indigo-500 to-violet-600",
    rating: 5,
    quote: "We manage over 50 client accounts. AdPilot AI is now our secret weapon. The speed and quality of output is unmatched by anything else we've tried — and we've tried everything.",
  },
  {
    id: "6",
    name: "David Kim",
    role: "E-commerce Manager",
    company: "SkyBrand Co.",
    initials: "DK",
    color: "from-emerald-500 to-cyan-600",
    rating: 5,
    quote: "Our ROAS jumped from 2.1x to 6.8x after 60 days using AdPilot. The keyword intelligence tool found search terms we never would have discovered manually. Game-changing platform.",
  },
];

// ─── RSA Full Result (used by the new RSA Generator page) ───────────────────

export interface RSAHeadline {
  id: string;
  text: string;
  strength: "excellent" | "good" | "average" | "weak";
  strengthScore: number;
  tip: string;
}

export interface RSADescription {
  id: string;
  text: string;
  strength: "excellent" | "good" | "average" | "weak";
  strengthScore: number;
  tip: string;
}

export interface ModerationFlag {
  field: string;
  issue: string;
  severity: "low" | "medium" | "high";
  safer: string;
}

export interface RSAFullResult {
  headlines: RSAHeadline[];
  descriptions: RSADescription[];
  ctaSuggestions: string[];
  moderation: {
    score: number;
    level: "LOW" | "MEDIUM" | "HIGH";
    flags: ModerationFlag[];
  };
  generatedAt: string;
}

export const rsaFullResults: RSAFullResult = {
  generatedAt: "Just now · 2.4s",
  headlines: [
    { id: "h1",  text: "Award-Winning PPC Agency",         strength: "excellent", strengthScore: 94, tip: "Strong authority signal" },
    { id: "h2",  text: "Scale Your ROI by 300%",            strength: "excellent", strengthScore: 92, tip: "Specific number = higher CTR" },
    { id: "h3",  text: "Free Google Ads Audit Today",       strength: "excellent", strengthScore: 91, tip: "Free + urgency trigger" },
    { id: "h4",  text: "Certified Google Ads Experts",      strength: "good",      strengthScore: 86, tip: "Credibility builder" },
    { id: "h5",  text: "Stop Wasting Your Ad Budget",       strength: "excellent", strengthScore: 90, tip: "Pain-point headline" },
    { id: "h6",  text: "More Leads. Lower CPC. Done.",      strength: "good",      strengthScore: 87, tip: "Triple benefit, punchy" },
    { id: "h7",  text: "Data-Driven Ad Campaigns",          strength: "good",      strengthScore: 83, tip: "Appeals to analytical buyers" },
    { id: "h8",  text: "500+ Brands — Real Results",        strength: "good",      strengthScore: 82, tip: "Social proof" },
    { id: "h9",  text: "No Long-Term Contracts",            strength: "average",   strengthScore: 72, tip: "Removes objection, but weak standalone" },
    { id: "h10", text: "Results in 30 Days or Less",        strength: "excellent", strengthScore: 93, tip: "Urgency + specific timeframe" },
    { id: "h11", text: "Custom Campaigns for Growth",       strength: "good",      strengthScore: 85, tip: "Personalization angle" },
    { id: "h12", text: "Full Transparency. No Fluff.",      strength: "good",      strengthScore: 84, tip: "Honesty differentiator" },
    { id: "h13", text: "Get a Free Strategy Session",       strength: "excellent", strengthScore: 90, tip: "Low-friction CTA" },
    { id: "h14", text: "Google Partner Since 2012",         strength: "average",   strengthScore: 71, tip: "Trust signal, but dated" },
    { id: "h15", text: "Your Growth Is Our Business",       strength: "good",      strengthScore: 81, tip: "Partnership framing" },
  ],
  descriptions: [
    {
      id: "d1",
      text: "We manage Google Ads for 500+ brands. Average 340% ROI improvement. Get your free audit.",
      strength: "excellent",
      strengthScore: 93,
      tip: "Social proof + stat + CTA in one",
    },
    {
      id: "d2",
      text: "Tired of wasted ad spend? We turn underperforming campaigns into profit machines fast.",
      strength: "excellent",
      strengthScore: 91,
      tip: "Opens with pain point — high emotional hook",
    },
    {
      id: "d3",
      text: "Certified Google Partner. 12+ years of PPC experience. No long-term contracts required.",
      strength: "good",
      strengthScore: 85,
      tip: "Credibility stack — reassures risk-averse buyers",
    },
    {
      id: "d4",
      text: "From onboarding to results in 7 days. Weekly reports. Dedicated account manager included.",
      strength: "good",
      strengthScore: 83,
      tip: "Concrete timeline removes hesitation",
    },
  ],
  ctaSuggestions: [
    "Start Your Free Trial",
    "Get a Free Audit Today",
    "Book a Strategy Call",
    "Claim Your Free Consultation",
    "See Our Case Studies",
    "Request a Free Quote",
    "Get Results in 30 Days",
    "Join 500+ Happy Clients",
    "Start Scaling Today",
    "View Our Pricing Plans",
  ],
  moderation: {
    score: 81,
    level: "LOW",
    flags: [
      {
        field: "Award-Winning PPC Agency",
        issue: "Unverified award claim — Google may require proof of the award to avoid disapproval.",
        severity: "medium",
        safer: "Top-Rated PPC Agency",
      },
      {
        field: "Scale Your ROI by 300%",
        issue: "Specific performance claim — must be substantiated with real data or a disclaimer.",
        severity: "low",
        safer: "Significantly Boost Your ROI",
      },
    ],
  },
};

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfect for solopreneurs and small businesses just getting started with Google Ads.",
    popular: false,
    features: [
      "100 AI-generated ads per month",
      "RSA Generator (15 headlines + 4 descriptions)",
      "Basic moderation checker",
      "CTR score analyzer",
      "Email support (48h response)",
      "Export to CSV/JSON",
      "1 user seat",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    description: "For growing agencies and marketing teams scaling their Google Ads performance.",
    popular: true,
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
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    description: "Unlimited power for agencies managing large portfolios and enterprise accounts.",
    popular: false,
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
    cta: "Contact Sales",
  },
];

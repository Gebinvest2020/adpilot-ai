"use client";

import Link from "next/link";
import { Zap, X, Globe, Link2 } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const t = useT();
  const f = t.footer;

  const footerLinks = [
    {
      heading: f.columns.product,
      links: [
        { label: f.links.rsaGenerator, href: "/dashboard/rsa-generator" },
        { label: f.links.moderationChecker, href: "/dashboard/moderation-checker" },
        { label: f.links.ctrAnalyzer, href: "/dashboard/ctr-analyzer" },
        { label: f.links.pricing, href: "/pricing" },
      ],
    },
    {
      heading: f.columns.company,
      links: [
        { label: f.links.about, href: "#" },
        { label: f.links.blog, href: "#" },
        { label: f.links.careers, href: "#" },
        { label: f.links.pressKit, href: "#" },
      ],
    },
    {
      heading: f.columns.resources,
      links: [
        { label: f.links.documentation, href: "#" },
        { label: f.links.apiReference, href: "#" },
        { label: f.links.statusPage, href: "#" },
        { label: f.links.support, href: "#" },
      ],
    },
    {
      heading: f.columns.legal,
      links: [
        { label: f.links.privacyPolicy, href: "#" },
        { label: f.links.termsOfService, href: "#" },
        { label: f.links.cookiePolicy, href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/[0.06]" style={{ background: '#050508' }}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AdPilot</span>
                <span className="text-white/50 text-sm font-normal ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              {f.brandDesc}
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all duration-200">
                <X className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all duration-200">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all duration-200">
                <Link2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            {f.copyright}
          </p>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span>{f.poweredBy}</span>
            <span className="text-indigo-400 font-medium">GPT-5</span>
            <span>+</span>
            <span className="text-violet-400 font-medium">Claude</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

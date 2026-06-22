"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Search,
  Database,
  Target,
  FileText,
  ArrowRight,
  Check,
  Clock,
  TrendingUp,
  Sun,
  Moon,
  Phone,
  Mail,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("iie-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("iie-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#solution" },
    { label: "Industries", href: "#verticals" },
    { label: "Pricing", href: "#pricing" },
  ];

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const href = this.getAttribute("href");
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            setMobileMenuOpen(false);
          }
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-gray-200 dark:border-gray-800"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-bold text-lg tracking-tight">IIE</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <a
              href="#demo"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
            >
              Book Demo
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-medium text-gray-600 dark:text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sign In
              </Link>
              <a href="#demo" className="block text-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                Book Demo
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Index Intelligence Engine v1.0
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Turn Waste Into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                  Revenue
                </span>{" "}
                with AI-Powered Market Intelligence
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Index Intelligence Engine helps slurry recyclers, concrete operators, and industrial service providers identify high-value opportunities, enrich contacts, and close more contracts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/30"
                >
                  Book Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#solution"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-semibold rounded-xl transition-all border border-gray-200 dark:border-gray-800"
                >
                  See How It Works
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Trusted by <span className="font-semibold text-gray-900 dark:text-white">50+ operators</span> across the US
                </p>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d0d0d]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-400 font-mono">IIE Dashboard — Market Index</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Opportunities</div>
                      <div className="text-2xl font-bold">1,247</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                      +12% this week
                    </div>
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-lg flex items-end justify-around p-4 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="w-full bg-red-600/80 rounded-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-xs font-bold">
                          {String.fromCharCode(64 + i)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">Concrete Solutions Inc.</div>
                          <div className="text-xs text-gray-500">Slurry Recycling • 2.4 mi</div>
                        </div>
                        <div className="text-xs font-semibold text-red-600">High Priority</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50/50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">The Problem</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Most Operators Are Flying Blind
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Without real-time market intelligence, industrial service providers leave revenue on the table every single day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Manual Lead Research", desc: "Sales teams waste hours digging through outdated directories and spreadsheets instead of selling." },
              { icon: Database, title: "Stale Contact Data", desc: "Phone numbers bounce. Decision makers change roles. Your CRM is decaying by the minute." },
              { icon: Target, title: "Poor Market Visibility", desc: "You don't know which competitors are active in your territory or where the high-value jobs are." },
              { icon: TrendingUp, title: "Lost Revenue", desc: "Valuable loads go to competitors because you found out about the opportunity too late." },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">The Solution</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">One Engine. Complete Market Visibility.</h2>
            <p className="text-gray-600 dark:text-gray-400">From discovery to conversion, IIE automates the entire intelligence workflow.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Discover", desc: "Find local opportunities instantly by industry, geography, and business signals.", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600" },
              { icon: Database, title: "Enrich", desc: "Auto-populate company data, websites, emails, and decision-maker contacts.", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600" },
              { icon: Target, title: "Score", desc: "Priority rankings based on proprietary signals: fleet size, revenue estimates, intent.", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600" },
              { icon: FileText, title: "Convert", desc: "Generate outreach campaigns, call sheets, and track every touchpoint to close.", color: "bg-red-50 dark:bg-red-900/20 text-red-600" },
            ].map((item, i) => (
              <div key={i} className="relative group p-8 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{item.desc}</p>
                <div className="flex items-center text-sm font-semibold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50/50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">How It Works</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">From Market to Contract in Three Steps</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0" />
            {[
              { step: "01", title: "Define Your Market", desc: "Choose your vertical and set your target radius. IIE maps the entire addressable market in seconds." },
              { step: "02", title: "Discover & Enrich", desc: "Our engine pulls from Google Places, Apollo, and proprietary datasets to build complete company profiles." },
              { step: "03", title: "Launch Campaigns", desc: "Turn enriched targets into outreach campaigns. Generate call sheets, track status, and move leads from New to Won." },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-600 text-white flex items-center justify-center text-xl font-black mb-6 shadow-lg shadow-red-600/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verticals */}
      <section id="verticals" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">Industries</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Built for High-Volume Local Services</h2>
            <p className="text-gray-600 dark:text-gray-400">Deep vertical intelligence, not generic lists.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Slurry Recycling", desc: "Identify concrete slurry generators, disposal sites, and recyclers in your hauling radius.", status: "Live Now", active: true },
              { title: "Concrete Disposal", desc: "Map commercial concrete producers, demolition contractors, and aggregate buyers.", status: "Beta", active: false },
              { title: "Grease Trap", desc: "Target restaurants, commercial kitchens, and food processors needing regular service.", status: "Coming Q3", active: false },
              { title: "Commercial Roofing", desc: "Find property managers, industrial facilities, and contractors with upcoming reroof needs.", status: "Coming Q4", active: false },
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl border transition-all ${item.active ? "border-red-600 bg-red-50/10 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${item.active ? "bg-red-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-red-500 mb-4">Impact</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Built for Revenue Impact</h2>
            <p className="text-gray-400">Operators using IIE see measurable improvements across the entire sales funnel.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "10x", label: "Faster Lead Discovery", desc: "From hours of manual research to instant market maps" },
              { metric: "70%", label: "Less Manual Work", desc: "Automated enrichment eliminates data entry" },
              { metric: "3x", label: "Higher Close Rates", desc: "Prioritized targets with enriched contact data" },
              { metric: "40%", label: "Better Route Density", desc: "Geographic intelligence reduces deadhead miles" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-4xl font-black text-red-500 mb-2">{item.metric}</div>
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-400">Start with a pilot. Scale when you're ready.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Pilot", price: "$2,000", period: "one-time setup", desc: "Perfect for proving ROI with a single vertical and market.", features: ["1 vertical (Slurry)", "1 market area", "Up to 500 enriched records", "2 team seats", "Call sheet generation", "Email support"], cta: "Start Pilot", primary: false },
              { name: "Pro", price: "$999", period: "/month", desc: "For operators ready to own their entire market.", features: ["All verticals", "Unlimited markets", "Unlimited enriched records", "10 team seats", "Campaign management", "Priority support", "API access"], cta: "Get Started", primary: true },
              { name: "Enterprise", price: "Custom", period: "", desc: "Multi-location operators and private equity portfolios.", features: ["Everything in Pro", "Unlimited seats", "Custom integrations", "Dedicated success manager", "SLA guarantee", "On-premise option"], cta: "Contact Sales", primary: false },
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-2xl border ${plan.primary ? "border-red-600 bg-red-50/5 dark:bg-red-900/5 shadow-xl shadow-red-600/10" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]"}`}>
                {plan.primary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#demo" className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${plan.primary ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-24 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to Build Your Market Index?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Book a 20-minute demo. We'll map your market live and show you exactly where the revenue is hiding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:demo@indexintelligence.io" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20">
              <Mail className="w-4 h-4" /> Book Demo
            </a>
            <a href="tel:+18005551234" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#111] text-gray-900 dark:text-white font-semibold rounded-xl transition-all border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
              <Phone className="w-4 h-4" /> Call Sales
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">No commitment required. Pilot programs start within 48 hours.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" fill="white" />
              </div>
              <span className="font-bold text-sm tracking-tight">INDEX INTELLIGENCE ENGINE</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600">© 2026 Index Intelligence Engine. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

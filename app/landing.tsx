"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Globe,
  Layers,
  BarChart3,
  Play,
} from "lucide-react";
import Link from "next/link";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

function GradientOrb({ className, color1, color2, delay = 0 }: { className: string; color1: string; color2: string; delay?: number }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 dark:opacity-10 ${className}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2}, transparent)`,
        animation: `orbFloat 8s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { quote: "IIE found us 47 new accounts in our first week. Our sales team couldn't believe the quality of the leads.", author: "Mike Rodriguez", role: "VP Sales, ConcreteMax", avatar: "MR" },
    { quote: "The enrichment is insane. We went from 20% contact rates to 65% just by having the right decision-makers.", author: "Sarah Chen", role: "Director, EnviroClean Services", avatar: "SC" },
    { quote: "We replaced three different tools with IIE. The integrated workflow saves us 15 hours per week.", author: "David Park", role: "Operations Lead, SlurryTech", avatar: "DP" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans selection:bg-red-600/90 selection:text-white overflow-x-hidden">
      {/* Animated Background Orbs */}
      <GradientOrb className="w-[600px] h-[600px] -top-[200px] -right-[200px]" color1="#dc2626" color2="#f97316" delay={0} />
      <GradientOrb className="w-[500px] h-[500px] top-[40%] -left-[250px]" color1="#7c3aed" color2="#dc2626" delay={2} />
      <GradientOrb className="w-[400px] h-[400px] top-[70%] right-[10%]" color1="#dc2626" color2="#fbbf24" delay={4} />

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 dark:bg-[#050505]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 shadow-sm shadow-black/[0.03] dark:shadow-none"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Zap className="w-4 h-4 text-white" fill="white" />
              <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500 to-red-700 rounded-xl opacity-0 hover:opacity-100 blur transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-none">IIE</span>
              <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase">Intelligence Engine</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent transition-all" />
              {theme === "dark" ? <Sun className="w-4 h-4 relative z-10" /> : <Moon className="w-4 h-4 relative z-10" />}
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5"
            >
              Sign In
            </Link>
            <a
              href="#demo"
              className="group relative px-5 py-2.5 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/30 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Book Demo</span>
              <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors" />
            </a>
          </div>

          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-[#050505]/95 backdrop-blur-2xl border-t border-gray-200/50 dark:border-white/5 px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200/50 dark:border-white/5 flex flex-col gap-2">
              <Link href="/dashboard" className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">
                Sign In
              </Link>
              <a href="#demo" className="block text-center px-4 py-3 bg-gradient-to-b from-red-600 to-red-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-600/20">
                Book Demo
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-400 text-xs font-semibold tracking-wide backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                Index Intelligence Engine v1.0
              </div>

              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-tight leading-[1.08]">
                Turn Waste Into{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
                    Revenue
                  </span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-red-600/20 to-orange-500/20 rounded-full blur-sm" />
                </span>
                <br />
                <span className="text-gray-500 dark:text-gray-400">with AI Market Intelligence</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                Discover, enrich, and convert high-value industrial opportunities. IIE automates the entire intelligence workflow so your team can focus on closing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#demo"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-red-600/25 hover:shadow-red-600/35 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Book Demo</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors" />
                </a>
                <a
                  href="#solution"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gray-100 dark:bg-white/[0.03] hover:bg-gray-200/80 dark:hover:bg-white/[0.06] text-gray-900 dark:text-white font-semibold rounded-2xl transition-all border border-gray-200/80 dark:border-white/[0.06]"
                >
                  <Play className="w-4 h-4 text-red-600" />
                  See How It Works
                </a>
              </div>

              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-2 border-white dark:border-[#050505] flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">50+ operators</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">across the United States</p>
                </div>
              </div>
            </div>

            {/* Dashboard Mockup - Modernized */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-red-600/15 via-orange-500/10 to-purple-600/15 rounded-[40px] blur-3xl opacity-60" />
              <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-[#0f0f0f] dark:to-[#0a0a0a] rounded-3xl border border-gray-200/80 dark:border-white/[0.06] shadow-2xl shadow-black/[0.08] dark:shadow-black/50 overflow-hidden">
                {/* Window Chrome */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm shadow-[#ff5f57]/30" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm shadow-[#febc2e]/30" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm shadow-[#28c840]/30" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                      <Globe className="w-3 h-3" />
                      app.indexintelligence.io/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-5">
                  {/* KPI Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Opportunities", value: "1,247", change: "+12%", positive: true },
                      { label: "Enriched", value: "892", change: "71%", positive: true },
                      { label: "Contacted", value: "456", change: "36%", positive: false },
                      { label: "Converted", value: "89", change: "+8%", positive: true },
                    ].map((kpi, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">{kpi.label}</div>
                        <div className="text-lg font-bold tracking-tight">{kpi.value}</div>
                        <div className={`text-[10px] font-semibold ${kpi.positive ? 'text-emerald-500' : 'text-gray-400'}`}>{kpi.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="h-36 rounded-xl bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/20 dark:to-transparent border border-red-100/50 dark:border-red-900/20 p-4 flex items-end justify-around gap-1.5">
                    {[35, 55, 42, 75, 60, 88, 72, 65, 82, 90, 78, 85].map((h, i) => (
                      <div key={i} className="flex-1 relative group">
                        <div
                          className="w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-md transition-all duration-300 group-hover:from-red-500 group-hover:to-red-400 cursor-pointer"
                          style={{ height: `${h}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {h} leads
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Leads */}
                  <div className="space-y-2">
                    {[
                      { name: "Concrete Solutions Inc.", type: "Slurry Recycling", dist: "2.4 mi", priority: "A" },
                      { name: "Metro Demolition LLC", type: "Concrete Disposal", dist: "4.1 mi", priority: "A" },
                      { name: "Pacific Environmental", type: "Hazmat", dist: "5.8 mi", priority: "B" },
                    ].map((lead, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] hover:border-red-200 dark:hover:border-red-800/30 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-bold shrink-0">
                          {lead.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{lead.name}</div>
                          <div className="text-[11px] text-gray-400">{lead.type} • {lead.dist}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          lead.priority === 'A' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          Priority {lead.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Trust Bar */}
      <section className="py-12 border-y border-gray-100 dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">Trusted by leading industrial operators</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["ConcreteMax", "SlurryTech", "EnviroClean", "Pacific Demolition", "Metro Hauling"].map((name) => (
              <div key={name} className="text-lg font-bold text-gray-300 dark:text-gray-700 hover:text-gray-400 dark:hover:text-gray-600 transition-colors">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section - Bento Grid */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-semibold mb-6">
              <AlertTriangle className="w-3 h-3" />
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Most Operators Are{" "}
              <span className="text-gray-400 dark:text-gray-600">Flying Blind</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Without real-time market intelligence, you're leaving revenue on the table every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                icon: Clock, 
                title: "Manual Research", 
                desc: "Sales teams waste hours digging through outdated directories instead of selling.",
                stat: "8+ hrs/week",
                gradient: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/5 dark:to-blue-600/0"
              },
              { 
                icon: Database, 
                title: "Stale Data", 
                desc: "Phone numbers bounce. Decision makers change. Your CRM decays by the minute.",
                stat: "30% decay/month",
                gradient: "from-purple-500/10 to-purple-600/5 dark:from-purple-500/5 dark:to-purple-600/0"
              },
              { 
                icon: Target, 
                title: "No Visibility", 
                desc: "You don't know which competitors are active in your territory or where the jobs are.",
                stat: "60% unknown",
                gradient: "from-amber-500/10 to-amber-600/5 dark:from-amber-500/5 dark:to-amber-600/0"
              },
              { 
                icon: TrendingUp, 
                title: "Lost Revenue", 
                desc: "Valuable loads go to competitors because you found out too late.",
                stat: "$50K+/month",
                gradient: "from-red-500/10 to-red-600/5 dark:from-red-500/5 dark:to-red-600/0"
              },
            ].map((item, i) => (
              <div key={i} className={`group relative p-6 rounded-2xl bg-gradient-to-b ${item.gradient} border border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04] dark:hover:shadow-none`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.06] flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:scale-110 group-hover:border-red-200 dark:group-hover:border-red-800/30 transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-600">{item.stat}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 bg-gray-50/50 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3 h-3" />
              The Solution
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              One Engine. Complete{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Visibility</span>.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">From discovery to conversion, IIE automates the entire intelligence workflow.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Search, title: "Discover", desc: "Find local opportunities instantly by industry, geography, and business signals.", step: "01", color: "text-blue-600 dark:text-blue-400" },
              { icon: Database, title: "Enrich", desc: "Auto-populate company data, websites, emails, and decision-maker contacts.", step: "02", color: "text-purple-600 dark:text-purple-400" },
              { icon: Target, title: "Score", desc: "Priority rankings based on proprietary signals: fleet size, revenue, intent.", step: "03", color: "text-amber-600 dark:text-amber-400" },
              { icon: FileText, title: "Convert", desc: "Generate campaigns, call sheets, and track every touchpoint to close.", step: "04", color: "text-red-600 dark:text-red-400" },
            ].map((item, i) => (
              <div key={i} className="group relative p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04] dark:hover:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-white/[0.05] dark:to-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="text-4xl font-black text-gray-100 dark:text-white/[0.03] group-hover:text-gray-200 dark:group-hover:text-white/[0.06] transition-colors">{item.step}</span>
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{item.desc}</p>
                <div className="flex items-center text-sm font-semibold text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Horizontal Steps */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-6">
              <Layers className="w-3 h-3" />
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Market to Contract in{" "}
              <span className="text-gray-400 dark:text-gray-600">Three Steps</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-20 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-red-300 dark:via-red-800 to-transparent" />
            
            {[
              { step: "01", title: "Define Your Market", desc: "Choose your vertical and set your target radius. IIE maps the entire addressable market in seconds.", icon: Globe },
              { step: "02", title: "Discover & Enrich", desc: "Our engine pulls from Google Places, Apollo, and proprietary datasets to build complete profiles.", icon: Database },
              { step: "03", title: "Launch Campaigns", desc: "Turn enriched targets into outreach campaigns. Track status from New to Won.", icon: BarChart3 },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative z-10 w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-red-600 to-red-700 text-white flex items-center justify-center mb-8 shadow-xl shadow-red-600/25 group-hover:shadow-red-600/35 group-hover:-translate-y-1 transition-all duration-300">
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">Step {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verticals - Modern Cards */}
      <section id="verticals" className="py-24 bg-gray-50/50 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6">
              <Layers className="w-3 h-3" />
              Industries
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Local Services</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Deep vertical intelligence, not generic lists.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Slurry Recycling", desc: "Identify concrete slurry generators, disposal sites, and recyclers in your hauling radius.", status: "Live", active: true, icon: "🔄" },
              { title: "Concrete Disposal", desc: "Map commercial concrete producers, demolition contractors, and aggregate buyers.", status: "Beta", active: false, icon: "🏗️" },
              { title: "Grease Trap", desc: "Target restaurants, commercial kitchens, and food processors needing regular service.", status: "Q3 2026", active: false, icon: "🔧" },
              { title: "Commercial Roofing", desc: "Find property managers, industrial facilities, and contractors with upcoming reroof needs.", status: "Q4 2026", active: false, icon: "🏠" },
            ].map((item, i) => (
              <div key={i} className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                item.active 
                  ? "border-red-200 dark:border-red-800/50 bg-gradient-to-b from-red-50/50 to-white dark:from-red-950/20 dark:to-transparent shadow-lg shadow-red-500/5" 
                  : "border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] hover:shadow-xl hover:shadow-black/[0.04] dark:hover:shadow-none"
              }`}>
                {item.active && (
                  <div className="absolute -top-px left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                )}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    item.active 
                      ? "bg-red-600 text-white shadow-sm shadow-red-600/25" 
                      : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Metrics - Large Numbers */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-semibold mb-6">
              <TrendingUp className="w-3 h-3" />
              Impact
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Built for Revenue Impact
            </h2>
            <p className="text-gray-400 text-lg">Operators using IIE see measurable improvements across the entire funnel.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: 10, suffix: "x", label: "Faster Discovery", desc: "From hours to instant market maps", color: "from-blue-500 to-cyan-500" },
              { metric: 70, suffix: "%", label: "Less Manual Work", desc: "Automated enrichment eliminates entry", color: "from-purple-500 to-violet-500" },
              { metric: 3, suffix: "x", label: "Higher Close Rates", desc: "Prioritized targets with contacts", color: "from-amber-500 to-orange-500" },
              { metric: 40, suffix: "%", label: "Better Density", desc: "Geographic intel reduces deadhead", color: "from-red-500 to-rose-500" },
            ].map((item, i) => (
              <div key={i} className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                <div className={`text-5xl lg:text-6xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3`}>
                  <AnimatedCounter target={item.metric} />{item.suffix}
                </div>
                <div className="font-bold text-white text-lg mb-1">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 text-xs font-semibold mb-6">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              What Operators Say
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative p-10 rounded-3xl bg-gradient-to-b from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.01] border border-gray-200/80 dark:border-white/[0.06]">
              <div className="text-6xl text-gray-200 dark:text-white/[0.05] font-serif absolute top-6 left-8">"</div>
              <div className="relative z-10">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
                  {testimonials[activeTestimonial].quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonials[activeTestimonial].author}</div>
                    <div className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial 
                      ? "w-8 bg-red-600" 
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50/50 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Start with a pilot. Scale when you're ready.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                name: "Pilot", 
                price: "$2,000", 
                period: "one-time", 
                desc: "Prove ROI with a single vertical and market.", 
                features: ["1 vertical (Slurry)", "1 market area", "500 enriched records", "2 team seats", "Call sheet generation", "Email support"], 
                cta: "Start Pilot", 
                primary: false 
              },
              { 
                name: "Pro", 
                price: "$999", 
                period: "/month", 
                desc: "For operators ready to own their market.", 
                features: ["All verticals", "Unlimited markets", "Unlimited records", "10 team seats", "Campaign management", "Priority support", "API access"], 
                cta: "Get Started", 
                primary: true 
              },
              { 
                name: "Enterprise", 
                price: "Custom", 
                period: "", 
                desc: "Multi-location operators and PE portfolios.", 
                features: ["Everything in Pro", "Unlimited seats", "Custom integrations", "Dedicated CSM", "SLA guarantee", "On-premise option"], 
                cta: "Contact Sales", 
                primary: false 
              },
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                plan.primary 
                  ? "border-red-200 dark:border-red-800/50 bg-gradient-to-b from-red-50/80 to-white dark:from-red-950/20 dark:to-transparent shadow-xl shadow-red-500/10" 
                  : "border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] hover:shadow-xl hover:shadow-black/[0.04] dark:hover:shadow-none"
              }`}>
                {plan.primary && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-600/25">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.desc}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#demo" className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  plan.primary 
                    ? "bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/30" 
                    : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200/80 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white border border-gray-200 dark:border-white/[0.06]"
                }`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-32 relative overflow-hidden">
        <GradientOrb className="w-[800px] h-[800px] -left-[400px] top-1/2 -translate-y-1/2" color1="#dc2626" color2="#f97316" delay={0} />
        <GradientOrb className="w-[600px] h-[600px] -right-[300px] top-1/2 -translate-y-1/2" color1="#7c3aed" color2="#dc2626" delay={3} />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200/50 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-semibold mb-8">
            <Zap className="w-3 h-3" />
            Ready to Start?
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Build Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Market Index</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a 20-minute demo. We'll map your market live and show you exactly where the revenue is hiding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:demo@indexintelligence.io" className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-red-600/25 hover:shadow-red-600/35 hover:-translate-y-0.5">
              <span className="relative z-10"><Mail className="w-5 h-5" /> Book Demo</span>
              <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors" />
            </a>
            <a href="tel:+18005551234" className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white font-semibold rounded-2xl transition-all border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/[0.04] dark:hover:shadow-none">
              <Phone className="w-5 h-5" /> Call Sales
            </a>
          </div>
          
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">No commitment required. Pilot programs start within 48 hours.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <Zap className="w-4 h-4 text-white" fill="white" />
                </div>
                <span className="font-bold tracking-tight">IIE</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                AI-powered market intelligence for industrial service providers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-500">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-500">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-500">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">DPA</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 dark:border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 dark:text-gray-600">© 2026 Index Intelligence Engine. All rights reserved.</div>
            <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-600">
              <span>Built with ❤️ for industrial operators</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  );
}

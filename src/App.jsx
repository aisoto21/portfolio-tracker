import React, { useState, useEffect, useCallback, useRef } from "react";

const TICKERS = ["NVDA", "AVGO", "MSFT", "CEG", "VTI", "VXUS", "MCK"];
const NAMES = ["Beautiful", "Money Moves", "Boss Investor", "Dream Team", "Future Millionaire", "Sexy"];

const staticData = {
  NVDA: { company: "Nvidia Corporation", sector: "Technology / Semiconductors", category: "Aggressive Growth", allocation: 20, dollarAmount: "$225.92", approxShares: "~1.19", analystTarget: 253.88, week52High: 153.13, week52Low: 86.00, buySell: "57 Buy, 7 Hold, 1 Sell", consensus: "Strong Buy", convictionScore: 9, conviction: "9/10", recentPerformance: "Volatile post-DeepSeek shock", upcomingCatalyst: "⚡ Earnings Feb 25", timeHorizon: "3–5+ years", bucket: "Aggressive", dividendYield: "~0.03%", expenseRatio: "N/A", rothOverlap: "Indirect via QQQ", aiAngle: "GPU / general AI infrastructure", macroTailwinds: "AI data center demand, CUDA ecosystem moat", whyWeOwnIt: "AI infrastructure still in early innings. CUDA moat competitors cannot replicate in 2–3 years.", whyNotAlternative: "N/A", riskFactors: "High valuation, Taiwan supply chain risk", entryPointNote: "Conviction buy long term", nextAddPriority: "Hold and add on dips", watchlistConnection: "N/A", gradient: "linear-gradient(135deg, #76b900, #a8e063)", light: "#f0ffe0", accent: "#76b900", tag: "🟢 Aggressive Growth", emoji: "⚡", peRatio: "~31x", pegRatio: "~0.9", evEbitda: "~35x", grossMargin: "~75%", operatingMargin: "~55%", roe: "~115%", debtEquity: "~0.4x", fcf: "Growing strongly — $26B+ annually", revenueGrowth: "~122% YoY", rsi: 48, aboveMa50: false, aboveMa200: true, earningsDate: "Feb 26, 2025", earningsEst: "$0.84 EPS", correlation: { AVGO: 0.82, MSFT: 0.78, CEG: 0.45, VTI: 0.72, VXUS: 0.58, MCK: 0.31 } },
  AVGO: { company: "Broadcom Inc.", sector: "Technology / Semiconductors", category: "Aggressive-Moderate Growth", allocation: 16, dollarAmount: "$180.73", approxShares: "~0.52", analystTarget: 475.00, week52High: 251.88, week52Low: 122.76, buySell: "46 Buy, 2 Hold, 0 Sell", consensus: "Strong Buy 9.5/10", convictionScore: 10, conviction: "10/10 ⭐", recentPerformance: "~50% gain in 2025", upcomingCatalyst: "📅 Earnings Mar 4", timeHorizon: "3–5+ years", bucket: "Aggressive-Moderate", dividendYield: "~1.1%", expenseRatio: "N/A", rothOverlap: "Indirect via QQQ", aiAngle: "Custom AI silicon + networking for hyperscalers", macroTailwinds: "Custom AI chip demand, VMware FCF", whyWeOwnIt: "Builds chips hyperscalers use to reduce NVDA dependence — NVDA's biggest threat is AVGO's biggest opportunity.", whyNotAlternative: "Not CAT — ran 32% YTD, cyclical.", riskFactors: "Semiconductor cyclicality, VMware integration risk", entryPointNote: "Conviction buy — strongest analyst consensus", nextAddPriority: "Hold — highest conviction", watchlistConnection: "N/A", gradient: "linear-gradient(135deg, #cc0000, #ff6b6b)", light: "#fff0f0", accent: "#cc0000", tag: "🔴 Aggressive-Moderate", emoji: "🔥", peRatio: "~34x", pegRatio: "~0.85", evEbitda: "~22x", grossMargin: "~64%", operatingMargin: "~37%", roe: "~60%+", debtEquity: "~1.8x", fcf: "Strong — $19B+ annually", revenueGrowth: "~51% YoY", rsi: 55, aboveMa50: true, aboveMa200: true, earningsDate: "Mar 6, 2025", earningsEst: "$1.49 EPS", correlation: { NVDA: 0.82, MSFT: 0.75, CEG: 0.42, VTI: 0.68, VXUS: 0.55, MCK: 0.28 } },
  MSFT: { company: "Microsoft Corporation", sector: "Technology / Enterprise Software", category: "Moderate-Growth", allocation: 15, dollarAmount: "$169.44", approxShares: "~0.43", analystTarget: 628.98, week52High: 468.35, week52Low: 385.58, buySell: "32 Buy, 2 Hold, 0 Sell", consensus: "Strong Buy 8.5/10", convictionScore: 9.5, conviction: "9.5/10", recentPerformance: "+16% YTD — underperformed past year", upcomingCatalyst: "✅ None imminent", timeHorizon: "3–5+ years", bucket: "Moderate-Growth", dividendYield: "~0.7%", expenseRatio: "N/A", rothOverlap: "None", aiAngle: "Enterprise AI via Copilot — 70% of Fortune 500", macroTailwinds: "Azure +39% YoY, Copilot adoption", whyWeOwnIt: "Great business punished irrationally. Azure +39%, 98% analysts say Buy.", whyNotAlternative: "Not GOOGL — already ran 65% YTD.", riskFactors: "Three tech names move together on bad days", entryPointNote: "Conviction buy — buying the lag", nextAddPriority: "Hold and monitor quarterly", watchlistConnection: "GOOGL as future complement", gradient: "linear-gradient(135deg, #00a4ef, #50d9ff)", light: "#e8f8ff", accent: "#00a4ef", tag: "🔵 Moderate-Growth", emoji: "☁️", peRatio: "~28x", pegRatio: "~1.4", evEbitda: "~22x", grossMargin: "~70%", operatingMargin: "~44%", roe: "~38%", debtEquity: "~0.35x", fcf: "Exceptional — $70B+ annually", revenueGrowth: "~17% YoY", rsi: 52, aboveMa50: true, aboveMa200: true, earningsDate: "Apr 30, 2025", earningsEst: "$3.22 EPS", correlation: { NVDA: 0.78, AVGO: 0.75, CEG: 0.40, VTI: 0.80, VXUS: 0.65, MCK: 0.35 } },
  CEG: { company: "Constellation Energy", sector: "Energy / Nuclear Power", category: "Moderate-Growth", allocation: 12, dollarAmount: "$135.55", approxShares: "~0.47", analystTarget: 406.00, week52High: 334.91, week52Low: 144.83, buySell: "14 Buy, 5 Hold, 0 Sell", consensus: "Strong Buy 8.5/10", convictionScore: 9, conviction: "9/10", recentPerformance: "Down 24% YTD — policy selloff, NOT fundamentals", upcomingCatalyst: "🚀 New CyrusOne 380MW deal signed", timeHorizon: "3–5+ years", bucket: "Moderate-Growth", dividendYield: "~0.5%", expenseRatio: "N/A", rothOverlap: "None", aiAngle: "Nuclear power sold directly to AI data centers via PPAs", macroTailwinds: "AI power demand, nuclear renaissance", whyWeOwnIt: "Down 24% from a policy headline — not fundamentals. 53% upside, zero Sells.", whyNotAlternative: "Not GEV — at all time highs, 2 Sell ratings.", riskFactors: "Policy and regulatory risk", entryPointNote: "Conviction buy at genuine discount", nextAddPriority: "Add on further pullback", watchlistConnection: "GEV on watchlist at $700–750", gradient: "linear-gradient(135deg, #f7a800, #ffd166)", light: "#fffae8", accent: "#f7a800", tag: "🟡 Moderate-Growth", emoji: "⚛️", peRatio: "~16x", pegRatio: "~0.7", evEbitda: "~12x", grossMargin: "~28%", operatingMargin: "~18%", roe: "~22%", debtEquity: "~1.2x", fcf: "Strong — $4.5–6B projected", revenueGrowth: "~8% YoY", rsi: 38, aboveMa50: false, aboveMa200: false, earningsDate: "Feb 26, 2025", earningsEst: "$1.65 EPS", correlation: { NVDA: 0.45, AVGO: 0.42, MSFT: 0.40, VTI: 0.38, VXUS: 0.30, MCK: 0.22 } },
  VTI: { company: "Vanguard Total Stock Market ETF", sector: "Broad U.S. Market — ETF", category: "Anchor / Moderate", allocation: 17, dollarAmount: "$192.03", approxShares: "~0.57", analystTarget: null, week52High: 296.00, week52Low: 226.00, buySell: "N/A — ETF", consensus: "N/A — ETF", convictionScore: 10, conviction: "10/10 ⭐", recentPerformance: "Small cap rotation benefiting in 2026", upcomingCatalyst: "✅ No specific catalyst", timeHorizon: "Indefinite", bucket: "Anchor", dividendYield: "~1.3%", expenseRatio: "0.03% 💚", rothOverlap: "Minimal", aiAngle: "Indirect", macroTailwinds: "Broad U.S. economy, small cap rotation", whyWeOwnIt: "Entire U.S. market in one ETF — 4,000+ stocks, 0.03% fee.", whyNotAlternative: "Not RSP — 7x higher fees, underperforms over 10 years.", riskFactors: "Market-wide downturns", entryPointNote: "Always a reasonable entry", nextAddPriority: "First ETF to add consistently", watchlistConnection: "SCHD", gradient: "linear-gradient(135deg, #1a5276, #2e86c1)", light: "#eaf4ff", accent: "#2e86c1", tag: "🛡️ Anchor ETF", emoji: "🇺🇸", peRatio: "~22x", pegRatio: "N/A", evEbitda: "N/A", grossMargin: "N/A", operatingMargin: "N/A", roe: "N/A", debtEquity: "N/A", fcf: "N/A", revenueGrowth: "N/A", rsi: 51, aboveMa50: true, aboveMa200: true, earningsDate: "N/A — ETF", earningsEst: "N/A", correlation: { NVDA: 0.72, AVGO: 0.68, MSFT: 0.80, CEG: 0.38, VXUS: 0.75, MCK: 0.45 } },
  VXUS: { company: "Vanguard Total International ETF", sector: "International Markets — ETF", category: "Anchor / Moderate", allocation: 13, dollarAmount: "$146.85", approxShares: "~1.76", analystTarget: null, week52High: 66.00, week52Low: 52.00, buySell: "N/A — ETF", consensus: "N/A — ETF", convictionScore: 9.5, conviction: "9.5/10", recentPerformance: "Outperforming U.S. equities in 2026 ✅", upcomingCatalyst: "✅ No specific catalyst", timeHorizon: "Indefinite", bucket: "Anchor", dividendYield: "~2.8% 💚", expenseRatio: "0.07%", rothOverlap: "Intentional", aiAngle: "Indirect", macroTailwinds: "International outperforming in 2026, USD weakness", whyWeOwnIt: "International genuinely outperforming U.S. in 2026. Hedges against U.S. concentration risk.", whyNotAlternative: "N/A", riskFactors: "Currency risk, geopolitical risk", entryPointNote: "Always a reasonable entry", nextAddPriority: "Second ETF to add consistently", watchlistConnection: "N/A", gradient: "linear-gradient(135deg, #117a65, #1abc9c)", light: "#e8fff8", accent: "#117a65", tag: "🌍 Anchor ETF", emoji: "🌎", peRatio: "N/A", pegRatio: "N/A", evEbitda: "N/A", grossMargin: "N/A", operatingMargin: "N/A", roe: "N/A", debtEquity: "N/A", fcf: "N/A", revenueGrowth: "N/A", rsi: 54, aboveMa50: true, aboveMa200: true, earningsDate: "N/A — ETF", earningsEst: "N/A", correlation: { NVDA: 0.58, AVGO: 0.55, MSFT: 0.65, CEG: 0.30, VTI: 0.75, MCK: 0.40 } },
  MCK: { company: "McKesson Corporation", sector: "Healthcare / Medical Distribution", category: "Moderate Growth", allocation: 7, dollarAmount: "$79.07", approxShares: "~0.08", analystTarget: 1107, week52High: 772.00, week52Low: 480.00, buySell: "Moderate Buy", consensus: "Moderate Buy", convictionScore: 8.5, conviction: "8.5/10", recentPerformance: "+55.2% past year 🚀", upcomingCatalyst: "✅ None imminent", timeHorizon: "3–5 years", bucket: "Moderate", dividendYield: "~0.6%", expenseRatio: "N/A", rothOverlap: "None", aiAngle: "None — pure healthcare compounder", macroTailwinds: "Aging population, pharma demand", whyWeOwnIt: "Largest pharma distributor in North America. Every drug prescribed likely touches McKesson.", whyNotAlternative: "Not LLY — $800+, high P/E, needs perfect execution.", riskFactors: "Drug pricing regulation, Amazon pharmacy long term", entryPointNote: "Strong 1yr run, 10-15% more runway", nextAddPriority: "Priority add as account grows", watchlistConnection: "LLY as healthcare upgrade", gradient: "linear-gradient(135deg, #6c3483, #a855f7)", light: "#faf0ff", accent: "#6c3483", tag: "💜 Moderate Growth", emoji: "💊", peRatio: "~20x", pegRatio: "~1.1", evEbitda: "~14x", grossMargin: "~5–6%", operatingMargin: "~2.5%", roe: "~80%+", debtEquity: "~1.0x", fcf: "Strong — $4B+ annually", revenueGrowth: "~15% YoY", rsi: 62, aboveMa50: true, aboveMa200: true, earningsDate: "May 7, 2025", earningsEst: "$10.12 EPS", correlation: { NVDA: 0.31, AVGO: 0.28, MSFT: 0.35, CEG: 0.22, VTI: 0.45, VXUS: 0.40 } },
};

const DEFAULT_POSITIONS = { NVDA: { avgCost: "", shares: "" }, AVGO: { avgCost: "", shares: "" }, MSFT: { avgCost: "", shares: "" }, CEG: { avgCost: "", shares: "" }, VTI: { avgCost: "", shares: "" }, VXUS: { avgCost: "", shares: "" }, MCK: { avgCost: "", shares: "" } };

const economicCalendar = [
  { date: "Feb 26", event: "📊 NVDA Earnings", type: "earnings", impact: "HIGH", note: "Expected $0.84 EPS — market watching AI demand commentary closely" },
  { date: "Feb 26", event: "⚛️ CEG Earnings", type: "earnings", impact: "HIGH", note: "Expected $1.65 EPS — watch for new PPA deal announcements" },
  { date: "Feb 28", event: "💵 PCE Inflation Data", type: "macro", impact: "HIGH", note: "Fed's preferred inflation gauge — affects rate cut expectations" },
  { date: "Mar 4", event: "🔥 AVGO Earnings", type: "earnings", impact: "HIGH", note: "Expected $1.49 EPS — AI custom silicon demand is the key metric" },
  { date: "Mar 7", event: "💼 Jobs Report (NFP)", type: "macro", impact: "HIGH", note: "Non-farm payrolls — strong jobs = Fed holds rates higher longer" },
  { date: "Mar 19", event: "🏦 Fed Meeting (FOMC)", type: "macro", impact: "HIGH", note: "Rate decision — current market pricing in 2-3 cuts for 2025" },
  { date: "Apr 10", event: "📈 CPI Inflation", type: "macro", impact: "HIGH", note: "Consumer Price Index — key data point for Fed rate decisions" },
  { date: "Apr 30", event: "☁️ MSFT Earnings", type: "earnings", impact: "HIGH", note: "Expected $3.22 EPS — Azure growth rate and Copilot adoption key" },
  { date: "May 7", event: "💊 MCK Earnings", type: "earnings", impact: "MED", note: "Expected $10.12 EPS — pharma volume and margin trends" },
  { date: "May 7", event: "🏦 Fed Meeting (FOMC)", type: "macro", impact: "HIGH", note: "Second rate decision of the year" },
];

const newsItems = [
  { ticker: "NVDA", headline: "Nvidia CEO Jensen Huang hints at next-gen Blackwell Ultra chips at GTC conference", time: "2h ago", sentiment: "bullish", url: "#" },
  { ticker: "NVDA", headline: "DeepSeek R2 rumors surface — analysts say NVDA demand remains structurally intact", time: "4h ago", sentiment: "neutral", url: "#" },
  { ticker: "AVGO", headline: "Broadcom custom AI chip backlog grows to record levels as hyperscalers accelerate orders", time: "1h ago", sentiment: "bullish", url: "#" },
  { ticker: "AVGO", headline: "VMware revenue synergies ahead of schedule — Broadcom CFO confirms in roadshow", time: "6h ago", sentiment: "bullish", url: "#" },
  { ticker: "MSFT", headline: "Microsoft Azure beats AWS in enterprise AI workload survey for first time", time: "3h ago", sentiment: "bullish", url: "#" },
  { ticker: "MSFT", headline: "Copilot adoption hits 70% of Fortune 500 — Microsoft confirms in investor day", time: "1d ago", sentiment: "bullish", url: "#" },
  { ticker: "CEG", headline: "Constellation Energy signs 380MW nuclear PPA with CyrusOne data center", time: "5h ago", sentiment: "bullish", url: "#" },
  { ticker: "CEG", headline: "Nuclear energy stocks slide on policy uncertainty — analysts call it buying opportunity", time: "8h ago", sentiment: "neutral", url: "#" },
  { ticker: "VTI", headline: "Small cap stocks outperform large caps for third straight week in 2026 rotation", time: "2h ago", sentiment: "bullish", url: "#" },
  { ticker: "VXUS", headline: "International equities post best monthly gain vs US stocks since 2017", time: "1d ago", sentiment: "bullish", url: "#" },
  { ticker: "MCK", headline: "McKesson raises full-year guidance on strong pharmaceutical distribution volumes", time: "3d ago", sentiment: "bullish", url: "#" },
  { ticker: "MARKET", headline: "S&P 500 breadth improves as rotation from mega-cap tech into value accelerates", time: "1h ago", sentiment: "neutral", url: "#" },
  { ticker: "MARKET", headline: "Fed officials signal patience on rate cuts as inflation remains above 2% target", time: "4h ago", sentiment: "bearish", url: "#" },
  { ticker: "MARKET", headline: "Goldman Sachs raises 2026 S&P 500 target to 6,500 on strong earnings growth", time: "6h ago", sentiment: "bullish", url: "#" },
];

const TABS = ["💼 Portfolio", "📊 My P&L", "🔥 Heat Map", "📰 News", "📅 Calendar", "📐 Metrics", "🔍 DD Guide", "📈 Swing", "🌍 Sectors", "📋 Rules", "🗓 Review", "📚 Resources", "⭐ Watchlist"];

const fieldGroups = [
  { groupLabel: "📊 Position Basics", color: "#3b82f6", bg: "#eff6ff", fields: [{ key: "sector", label: "Sector" }, { key: "category", label: "Category" }, { key: "bucket", label: "Bucket" }, { key: "timeHorizon", label: "Time Horizon" }, { key: "upcomingCatalyst", label: "Upcoming Catalyst" }, { key: "recentPerformance", label: "Recent Performance" }] },
  { groupLabel: "💰 Allocation & Pricing", color: "#10b981", bg: "#f0fdf4", fields: [{ key: "allocation", label: "Allocation %" }, { key: "dollarAmount", label: "Target $ Amount" }, { key: "approxShares", label: "Target Shares" }, { key: "dividendYield", label: "Dividend Yield" }, { key: "expenseRatio", label: "Expense Ratio" }, { key: "rothOverlap", label: "Roth IRA Overlap" }] },
  { groupLabel: "📈 Analyst Data", color: "#f59e0b", bg: "#fffbeb", fields: [{ key: "buySell", label: "Buy / Hold / Sell" }, { key: "consensus", label: "Consensus" }, { key: "conviction", label: "Our Conviction" }] },
  { groupLabel: "🌍 Market & AI Context", color: "#8b5cf6", bg: "#f5f3ff", fields: [{ key: "aiAngle", label: "AI Angle" }, { key: "macroTailwinds", label: "Macro Tailwinds" }] },
  { groupLabel: "🧠 Investment Thesis", color: "#ef4444", bg: "#fef2f2", fields: [{ key: "whyWeOwnIt", label: "Why We Own It" }, { key: "whyNotAlternative", label: "Why Not Alternative" }, { key: "entryPointNote", label: "Entry Point Note" }, { key: "nextAddPriority", label: "Next Add Priority" }] },
  { groupLabel: "⚠️ Risk Factors", color: "#dc2626", bg: "#fff5f5", fields: [{ key: "riskFactors", label: "Risk Factors" }] },
  { groupLabel: "📐 Key Metrics", color: "#0891b2", bg: "#f0f9ff", fields: [{ key: "peRatio", label: "Forward P/E" }, { key: "pegRatio", label: "PEG Ratio" }, { key: "evEbitda", label: "EV/EBITDA" }, { key: "grossMargin", label: "Gross Margin" }, { key: "operatingMargin", label: "Operating Margin" }, { key: "roe", label: "ROE" }, { key: "debtEquity", label: "Debt/Equity" }, { key: "fcf", label: "Free Cash Flow" }, { key: "revenueGrowth", label: "Revenue Growth" }] },
];

const watchlistData = [
  { ticker: "SCHD", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "First add — income/defensive layer. 3.86% yield, 0.06% ER.", priority: "🥇 Next Buy", color: "#10b981", why: "Outperforming in 2026 rotation. Covers Consumer Staples, Energy, Healthcare. Dividend growing 10.58% annually for a decade." },
  { ticker: "GEV", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "Buy if pulls back to $700–750. $150B backlog.", priority: "🥈 Watch Price", color: "#f59e0b", why: "One of ~3 companies globally that can fix the power grid. AI data center energy demand thesis." },
  { ticker: "LLY", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "First healthcare upgrade when you can deploy $300–500.", priority: "🥉 Save Capital", color: "#ec4899", why: "GLP-1/Ozempic story still in early innings. Deep drug pipeline. Dominant in one of the biggest pharma breakthroughs in decades." },
  { ticker: "GOOGL", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "Revisit at quarterly review.", priority: "📋 Quarterly Check", color: "#3b82f6", why: "Dominant search, YouTube, Google Cloud, Waymo optionality. PEG under 1.5." },
  { ticker: "ORCL", stars: 4, conviction: "⭐⭐⭐⭐", note: "$523B remaining performance obligation.", priority: "📋 Monitor", color: "#8b5cf6", why: "Cloud infrastructure for OpenAI. Revenue +68% YoY." },
  { ticker: "MELI", stars: 4, conviction: "⭐⭐⭐⭐", note: "Add when account reaches $3–5K.", priority: "📋 Scale Up First", color: "#f97316", why: "The Amazon + PayPal of Latin America. 32% annual earnings growth projected." },
  { ticker: "CRM", stars: 4, conviction: "⭐⭐⭐⭐", note: "75% analyst upside, 15x forward P/E.", priority: "📋 Conditional", color: "#06b6d4", why: "Agentforce growing 114% YoY. Down 34% over past year." },
  { ticker: "ABBV", stars: 4, conviction: "⭐⭐⭐⭐", note: "3% dividend. Pairs beautifully with SCHD.", priority: "📋 Income Add", color: "#dc2626", why: "Dividend King — 54 consecutive years of increases. Rinvoq and Skyrizi entering new growth phase." },
  { ticker: "MRK", stars: 4, conviction: "⭐⭐⭐⭐", note: "10.5x forward P/E. BofA high conviction Q1 2026.", priority: "📋 Value Add", color: "#059669", why: "Keytruda projected at $7.6B in sales by 2030. 3%+ dividend." },
];

const rulesOfEngagement = [
  { rule: "🎯 Always Use Limit Orders", detail: "Never use market orders on Webull. Set the exact price you're willing to pay." },
  { rule: "📅 Review Quarterly — Non-Negotiable", detail: "Mid-Feb, Mid-May, Mid-Aug, Mid-Nov. Put it in both calendars as a recurring event." },
  { rule: "🧠 Know Your Thesis Before You Buy", detail: "You must explain why you own each position in 2 sentences. If you can't, you don't know it well enough." },
  { rule: "📉 Volatility Is Not Your Enemy", detail: "NVDA, AVGO, and MSFT will have 15–25% drawdown days. Your thesis is 3–5 years, not 3–5 weeks." },
  { rule: "📊 Beat Your Benchmark", detail: "Compare each stock vs VTI at every quarterly review. If consistently underperforming for 12+ months, reconsider." },
  { rule: "💵 Add Capital Consistently", detail: "Next additions: SCHD → GEV (if $700–750) → LLY → GOOGL. Don't deviate without a fundamental reason." },
  { rule: "🤝 Both Must Agree Before Executing", detail: "Any buy/sell/hold requires both of you to agree. If you disagree, default is HOLD." },
  { rule: "📓 Keep An Investment Journal", detail: "After every quarterly review, write down what you decided, why, and the macro environment." },
  { rule: "📱 Paper Trade First — No Exceptions", detail: "60 days minimum on Webull paper trading before any real swing trade." },
  { rule: "⚖️ Watch Concentration", detail: "If any single stock grows to 30–35%+ of total portfolio, consider trimming." },
  { rule: "🔍 Do Your Own DD Every Time", detail: "Run the 6-step smell test before adding to any position. No shortcuts." },
  { rule: "🚫 No FOMO Trades Ever", detail: "If you missed a move, you missed it. There will always be another opportunity." },
];

const quarterlyChecklist = [
  { phase: "📋 Before The Review", items: ["Pull up tracker and note current prices vs when you bought", "Read the last quarterly journal entry", "Each person reviews portfolio independently BEFORE discussing", "Write down conviction level (1–10) for each position", "Note any macro news since last quarter"] },
  { phase: "📊 During The Review", items: ["Compare each position vs VTI benchmark", "Has the original thesis changed? Yes/No and why", "Check analyst target updates on Finviz", "Check Stockcharts.com RRG — are your sectors still leading?", "Review Earnings Whispers for upcoming earnings in next 30 days", "Evaluate watchlist names — have entry points improved?"] },
  { phase: "💡 Decisions To Make", items: ["Hold / Add / Trim / Exit for each position — both must agree", "Which watchlist name do you add this quarter?", "How much capital goes to existing vs new positions?", "Does any position exceed 30–35%? If so, trim.", "Are you still comfortable with 70/30 stock/ETF split?"] },
  { phase: "📓 After The Review", items: ["Write in journal: decisions made and WHY", "Document macro environment as of this review", "Set price alerts for watchlist targets", "Schedule next quarterly review on both calendars"] },
];

const sectorRotation = [
  { sector: "⚡ Industrials", status: "🟢 Leading", why: "AI data center construction, manufacturing reshoring, defense spending.", ourExposure: "Indirect via VTI. GEV on watchlist." },
  { sector: "☢️ Energy (Nuclear)", status: "🟢 Leading", why: "AI data center power demand creating multi-decade nuclear renaissance.", ourExposure: "CEG — direct position at 12%" },
  { sector: "💻 Semiconductors", status: "🟡 Rotating", why: "DeepSeek shock created volatility but AI infrastructure thesis intact.", ourExposure: "NVDA (20%) + AVGO (16%)" },
  { sector: "☁️ Enterprise Software", status: "🟢 Leading", why: "Copilot monetization starting to show. Azure +39% YoY.", ourExposure: "MSFT — 15%" },
  { sector: "🏥 Healthcare", status: "🟢 Outperform", why: "Aging population, GLP-1 demand, pharma distribution growth.", ourExposure: "MCK — 7%" },
  { sector: "🌍 International", status: "🟢 Leading", why: "Non-US equities leading in 2026 rotation.", ourExposure: "VXUS — 13%" },
  { sector: "📱 Consumer Discretionary", status: "🔴 Lagging", why: "Consumer stress, Schwab rates Underperform.", ourExposure: "None — intentionally avoided" },
  { sector: "🏠 Real Estate", status: "🔴 Lagging", why: "High rates suppressing valuations.", ourExposure: "None — intentionally avoided" },
];

const resources = [
  { name: "Stockanalysis.com", use: "Free income statements, balance sheets, cash flow", url: "https://stockanalysis.com", color: "#3b82f6" },
  { name: "Macrotrends.net", use: "Historical financials going back decades", url: "https://macrotrends.net", color: "#10b981" },
  { name: "Finviz.com", use: "Stock screener — filter by P/E, growth, sector", url: "https://finviz.com", color: "#f59e0b" },
  { name: "Stockcharts.com", use: "Relative Rotation Graphs (RRG)", url: "https://stockcharts.com", color: "#8b5cf6" },
  { name: "EarningsWhispers.com", use: "Earnings dates and whisper numbers", url: "https://earningswhispers.com", color: "#ef4444" },
  { name: "Simply Wall St", use: "Visual breakdown of valuation, growth, health", url: "https://simplywall.st", color: "#ec4899" },
  { name: "TradingView", use: "Best charting platform for TA and paper trading", url: "https://tradingview.com", color: "#1abc9c" },
  { name: "SEC EDGAR", use: "Official 10-K, 10-Q, insider activity filings", url: "https://sec.gov/edgar", color: "#6366f1" },
];

function ConvictionBar({ score }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700, letterSpacing: 1 }}>CONVICTION</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>{score}/10</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 100, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${(score / 10) * 100}%`, height: "100%", background: "white", borderRadius: 100 }} />
      </div>
    </div>
  );
}

function AllocationBar({ pct }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700, letterSpacing: 1 }}>ALLOCATION</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>{pct}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 100, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct * 4.5, 100)}%`, height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 100 }} />
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState("NVDA");
  const [activeTab, setActiveTab] = useState(0);
  const [openGroups, setOpenGroups] = useState({});
  const [openDD, setOpenDD] = useState({});
  const [openSwing, setOpenSwing] = useState({});
  const [openRule, setOpenRule] = useState(null);
  const [openChecklist, setOpenChecklist] = useState({});
  const [openWatchlist, setOpenWatchlist] = useState({});
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(true);
  const [liveData, setLiveData] = useState({});
  const [flashMap, setFlashMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [positions, setPositions] = useState(DEFAULT_POSITIONS);
  const [editingPositions, setEditingPositions] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [priceAlerts, setPriceAlerts] = useState({ SCHD: "", GEV: "750", LLY: "", GOOGL: "", ORCL: "", MELI: "", CRM: "", ABBV: "", MRK: "" });
  const [confetti, setConfetti] = useState([]);
  const [showDonut, setShowDonut] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [newsFilter, setNewsFilter] = useState("ALL");
  const [dcaTicker, setDcaTicker] = useState("NVDA");
  const [dcaAmount, setDcaAmount] = useState("100");
  const [dcaFreq, setDcaFreq] = useState("monthly");
  const [dcaYears, setDcaYears] = useState("5");
  const [whatIfTicker, setWhatIfTicker] = useState("NVDA");
  const [whatIfPct, setWhatIfPct] = useState("20");

  useEffect(() => {
    const h = new Date().getHours();
    const t = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    setGreeting(`${t}, ${NAMES[Math.floor(Math.random() * NAMES.length)]}! 💖`);
    setTimeout(() => setShowGreeting(false), 4000);
  }, []);

  const fetchLiveData = useCallback(async () => {
    setLoading(true); setApiError(false);
    try {
      const res = await fetch(`/api/quote?symbols=${TICKERS.join(",")}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const mapped = {};
        json.forEach(q => { if (q?.symbol) mapped[q.symbol] = { price: q.price != null ? Number(q.price).toFixed(2) : null, change: q.change != null ? Number(q.change).toFixed(2) : null, changePct: q.changesPercentage != null ? Number(q.changesPercentage).toFixed(2) : null, dayHigh: q.dayHigh != null ? Number(q.dayHigh).toFixed(2) : null, dayLow: q.dayLow != null ? Number(q.dayLow).toFixed(2) : null, marketCap: q.marketCap, volume: q.volume }; });
        setLiveData(prev => {
          const flashes = {};
          Object.keys(mapped).forEach(s => { if (prev[s] && prev[s].price !== mapped[s].price) flashes[s] = true; });
          if (Object.keys(flashes).length > 0) { setFlashMap(flashes); setTimeout(() => setFlashMap({}), 800); }
          return mapped;
        });
        setLastUpdated(new Date().toLocaleTimeString());
      } else setApiError(true);
    } catch { setApiError(true); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);
  useEffect(() => { const i = setInterval(() => { fetchLiveData(); setCountdown(15); }, 15000); return () => clearInterval(i); }, [fetchLiveData]);
  useEffect(() => { const i = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 15), 1000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (!lastUpdated || Object.keys(liveData).length === 0) return;
    const pct = TICKERS.reduce((s, t) => s + (liveData[t] ? parseFloat(liveData[t].changePct) * (staticData[t].allocation / 100) : 0), 0);
    if (pct > 0.1) { const pieces = Array.from({ length: 60 }, (_, i) => ({ id: i, x: Math.random() * 100, color: ["#667eea","#f093fb","#4ade80","#fbbf24","#f87171","#34d399"][i % 6], size: Math.random() * 8 + 4, delay: Math.random() * 1.5, duration: Math.random() * 2 + 2 })); setConfetti(pieces); setTimeout(() => setConfetti([]), 4000); }
  }, [lastUpdated]);

  const calcPnL = (ticker) => {
    const pos = positions[ticker], ld = liveData[ticker];
    if (!pos?.avgCost || !pos?.shares || !ld?.price) return null;
    const cost = parseFloat(pos.avgCost), shares = parseFloat(pos.shares), price = parseFloat(ld.price);
    if (isNaN(cost) || isNaN(shares) || isNaN(price)) return null;
    const cb = cost * shares, cv = price * shares;
    return { costBasis: cb, currentValue: cv, pnl: cv - cb, pnlPct: ((cv - cb) / cb) * 100 };
  };

  const totalStats = () => {
    let tc = 0, tv = 0, n = 0;
    TICKERS.forEach(t => { const p = calcPnL(t); if (p) { tc += p.costBasis; tv += p.currentValue; n++; } });
    return { tc, tv, pnl: tv - tc, pct: tc > 0 ? ((tv - tc) / tc) * 100 : 0, n };
  };

  const livePortfolioValue = () => {
    let total = 0, has = false;
    TICKERS.forEach(t => { const p = positions[t], ld = liveData[t]; if (p?.shares && p?.avgCost && ld?.price) { total += parseFloat(ld.price) * parseFloat(p.shares); has = true; } });
    return has ? total : null;
  };

  const todayPortfolioPct = () => {
    if (!Object.keys(liveData).length) return null;
    return TICKERS.reduce((s, t) => s + (liveData[t] ? parseFloat(liveData[t].changePct) * (staticData[t].allocation / 100) : 0), 0);
  };

  const fmtMktCap = n => { if (!n) return "N/A"; if (n >= 1e12) return `$${(n/1e12).toFixed(2)}T`; if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`; return `$${n}`; };

  const totals = totalStats();
  const portfolioValue = livePortfolioValue();
  const todayPct = todayPortfolioPct();
  const data = staticData[selected];
  const live = liveData[selected];

  // DCA Calculator
  const calcDCA = () => {
    const amt = parseFloat(dcaAmount), yrs = parseFloat(dcaYears);
    const periods = dcaFreq === "weekly" ? yrs * 52 : dcaFreq === "monthly" ? yrs * 12 : yrs * 4;
    const annualReturn = 0.14;
    const periodReturn = dcaFreq === "weekly" ? annualReturn / 52 : dcaFreq === "monthly" ? annualReturn / 12 : annualReturn / 4;
    let value = 0;
    for (let i = 0; i < periods; i++) value = (value + amt) * (1 + periodReturn);
    const totalInvested = amt * periods;
    return { value, totalInvested, gain: value - totalInvested };
  };

  // What-if calculator
  const calcWhatIf = () => {
    const pct = parseFloat(whatIfPct) / 100;
    const ld = liveData[whatIfTicker];
    const currentPrice = ld ? parseFloat(ld.price) : null;
    const pos = positions[whatIfTicker];
    const shares = pos?.shares ? parseFloat(pos.shares) : null;
    if (!currentPrice) return null;
    const newPrice = currentPrice * (1 + pct);
    const priceChange = newPrice - currentPrice;
    const portfolioImpact = shares ? priceChange * shares : null;
    const portfolioImpactPct = staticData[whatIfTicker].allocation * pct;
    return { newPrice, priceChange, portfolioImpact, portfolioImpactPct };
  };

  // Sparkline
  const Sparkline = ({ ticker }) => {
    const ld = liveData[ticker];
    if (!ld) return <div style={{ width: 50, height: 18, background: "rgba(255,255,255,0.1)", borderRadius: 4 }} />;
    const isUp = parseFloat(ld.changePct) >= 0;
    const c = isUp ? "#4ade80" : "#f87171";
    const seed = ticker.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const points = Array.from({ length: 10 }, (_, i) => {
      const v = (Math.sin((seed + i) * 0.8) + Math.cos((seed + i) * 1.3)) / 2;
      return isUp ? 0.5 + v * 0.4 + (i / 9) * 0.3 : 0.8 + v * 0.3 - (i / 9) * 0.3;
    });
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 9) * 50} ${Math.max(1, Math.min(17, p * 18))}`).join(" ");
    return <svg width="50" height="18"><path d={path} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  };

  // Donut
  const DonutChart = () => {
    const cx = 80, cy = 80, r = 58, sw = 24, circ = 2 * Math.PI * r;
    let offset = 0;
    const slices = Object.entries(staticData).map(([ticker, d]) => {
      const dash = (d.allocation / 100) * circ;
      const s = { ticker, dash, gap: circ - dash, offset, accent: d.accent };
      offset += dash; return s;
    });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s, i) => <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.accent} strokeWidth={sw} strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset + circ / 4} style={{ cursor: "pointer", opacity: selected === s.ticker ? 1 : 0.65, transition: "opacity 0.2s" }} onClick={() => { setSelected(s.ticker); setActiveTab(0); }} />)}
          <text x={cx} y={cy - 5} textAnchor="middle" fontSize="10" fill="#666" fontWeight="700">Split</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fill="#666" fontWeight="600">70/30</text>
        </svg>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {Object.entries(staticData).map(([t, d]) => (
            <div key={t} onClick={() => { setSelected(t); setActiveTab(0); }} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "4px 8px", borderRadius: 8, background: selected === t ? `${d.accent}18` : "transparent" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: d.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: d.accent }}>{t}</span>
              <span style={{ fontSize: 11, color: "#888" }}>{d.allocation}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sentiment gauge
  const fearGreedScore = () => {
    if (!Object.keys(liveData).length) return 50;
    const avgPct = TICKERS.reduce((s, t) => s + (liveData[t] ? parseFloat(liveData[t].changePct) : 0), 0) / TICKERS.length;
    return Math.min(100, Math.max(0, 50 + avgPct * 8));
  };
  const fgScore = fearGreedScore();
  const fgLabel = fgScore < 25 ? "Extreme Fear" : fgScore < 40 ? "Fear" : fgScore < 60 ? "Neutral" : fgScore < 75 ? "Greed" : "Extreme Greed";
  const fgColor = fgScore < 25 ? "#ef4444" : fgScore < 40 ? "#f97316" : fgScore < 60 ? "#f59e0b" : fgScore < 75 ? "#84cc16" : "#10b981";

  const dcaResult = calcDCA();
  const whatIfResult = calcWhatIf();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 50%, #fdf0ff 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 48 }}>
      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateX(-50%) translateY(-20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity:1; } 100% { transform: translateY(100vh) rotate(720deg); opacity:0; } }
        @keyframes priceFlash { 0%,100% { background: transparent; } 50% { background: rgba(102,126,234,0.12); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .tabs::-webkit-scrollbar { display: none; }
        .price-animate { animation: slideIn 0.3s ease; }
      `}</style>

      {/* Confetti */}
      {confetti.map(p => <div key={p.id} style={{ position: "fixed", left: `${p.x}%`, top: -20, width: p.size, height: p.size, background: p.color, borderRadius: 2, zIndex: 9999, animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`, pointerEvents: "none" }} />)}

      {/* Greeting */}
      {showGreeting && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "linear-gradient(135deg, #667eea, #f093fb)", color: "white", padding: "14px 28px", borderRadius: 100, fontSize: 15, fontWeight: 700, boxShadow: "0 8px 32px rgba(102,126,234,0.4)", whiteSpace: "nowrap", animation: "fadeInDown 0.5s ease" }}>{greeting}</div>}

      {/* Nickname Modal */}
      {showNicknameModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 360, boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#333", marginBottom: 6 }}>✏️ Name Your Hub</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>Give your portfolio a personal name</div>
            <input value={nicknameInput} onChange={e => setNicknameInput(e.target.value)} placeholder="e.g. Sarah & Mike's Portfolio 💖" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #667eea", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowNicknameModal(false)} style={{ padding: 12, borderRadius: 12, border: "2px solid #f0f0f0", background: "none", color: "#888", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button onClick={() => { setNickname(nicknameInput); setShowNicknameModal(false); }} style={{ padding: 12, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #667eea, #f093fb)", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Save 💖</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", padding: "24px 20px 20px", textAlign: "center", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, opacity: 0.85, textTransform: "uppercase" }}>Joint Brokerage</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowNicknameModal(true)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 100, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✏️</button>
          </div>
        </div>
        <h1 style={{ fontSize: "clamp(20px,5vw,32px)", fontWeight: 900, margin: "0 0 8px" }}>{nickname || "Our Investment Hub"} 💰</h1>

        {todayPct !== null && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: todayPct >= 0 ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>{todayPct >= 0 ? "📈" : "📉"}</span>
            <span style={{ fontSize: 13, fontWeight: 800 }}>Portfolio {todayPct >= 0 ? "+" : ""}{todayPct.toFixed(2)}% today</span>
            {portfolioValue && <span style={{ fontSize: 12, opacity: 0.9 }}>• ${portfolioValue.toFixed(2)} live</span>}
          </div>
        )}

        {/* Live status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          {loading ? <div style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: apiError ? "#fbbf24" : "#4ade80", boxShadow: apiError ? "0 0 6px #fbbf24" : "0 0 6px #4ade80" }} />}
          <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>{loading ? "Fetching..." : apiError ? "Using reference data" : `Live • ${lastUpdated} • ↻ ${countdown}s`}</span>
          <button onClick={fetchLiveData} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 100, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>↻</button>
        </div>

        {/* Summary pills */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 14 }}>
          {[{ label: "Value", value: portfolioValue ? `$${portfolioValue.toFixed(0)}` : "$1,129.59" }, { label: "Positions", value: "7" }, { label: "Stocks", value: "70%" }, { label: "ETFs", value: "30% ✅" }, { label: "Sentiment", value: fgLabel, color: fgColor }].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 100, padding: "5px 12px", fontSize: 11, fontWeight: 600 }}>
              <span style={{ opacity: 0.8 }}>{item.label}: </span>
              <span style={{ fontWeight: 800, color: item.color || "white" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Rainbow allocation bar */}
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 10px" }}>
          <div style={{ display: "flex", borderRadius: 100, overflow: "hidden", height: 14, gap: 2 }}>
            {Object.entries(staticData).map(([ticker, d]) => (
              <div key={ticker} onClick={() => { setSelected(ticker); setActiveTab(0); }} title={`${ticker}: ${d.allocation}%`} style={{ flex: d.allocation, background: d.gradient, cursor: "pointer", opacity: selected === ticker ? 1 : 0.6, transform: selected === ticker ? "scaleY(1.2)" : "none", transition: "all 0.3s ease" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {Object.entries(staticData).map(([ticker]) => (
              <div key={ticker} onClick={() => { setSelected(ticker); setActiveTab(0); }} style={{ fontSize: 9, fontWeight: 800, opacity: selected === ticker ? 1 : 0.55, cursor: "pointer" }}>{ticker}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: "flex", overflowX: "auto", background: "white", borderBottom: "2px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", scrollbarWidth: "none" }}>
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: "14px 4px", border: "none", background: activeTab === i ? "linear-gradient(180deg, #f5f3ff 0%, white 100%)" : "none", color: activeTab === i ? "#667eea" : "#aaa", fontWeight: activeTab === i ? 800 : 500, fontSize: "12.5px", cursor: "pointer", borderBottom: activeTab === i ? "3px solid #667eea" : "3px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s ease", textAlign: "center", letterSpacing: activeTab === i ? "-0.2px" : 0 }}>{tab}</button>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 0" }}>

        {/* ── TAB 0: PORTFOLIO ── */}
        {activeTab === 0 && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" }}>
              {Object.keys(staticData).map(ticker => {
                const isSel = selected === ticker, ld = liveData[ticker];
                const isUp = ld && parseFloat(ld.changePct) >= 0;
                const pct = ld ? Math.abs(parseFloat(ld.changePct)) : 0;
                return (
                  <button key={ticker} onClick={() => setSelected(ticker)} style={{ padding: "8px 12px", borderRadius: 16, border: "none", background: isSel ? staticData[ticker].gradient : "white", color: isSel ? "white" : "#555", fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: flashMap[ticker] ? `0 0 16px ${isUp ? "#4ade80" : "#f87171"}` : isSel ? "0 4px 16px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)", transform: isSel ? "translateY(-2px)" : "none", transition: "all 0.2s ease", minWidth: 70 }}>
                    <div style={{ marginBottom: 3 }}>{staticData[ticker].emoji} {ticker}</div>
                    <Sparkline ticker={ticker} />
                    {ld && <div style={{ fontSize: 10, marginTop: 3, fontWeight: 800, color: isSel ? "white" : (isUp ? "#10b981" : "#ef4444") }}>{isUp ? "▲" : "▼"}{pct.toFixed(2)}%</div>}
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <button onClick={() => setShowDonut(d => !d)} style={{ background: showDonut ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: showDonut ? "white" : "#888", border: "none", borderRadius: 100, padding: "7px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s ease" }}>🥧 {showDonut ? "Hide" : "Show"} Allocation Chart</button>
            </div>
            {showDonut && <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}><div style={{ textAlign: "center", fontWeight: 800, fontSize: 15, color: "#333", marginBottom: 16 }}>📊 Portfolio Allocation</div><DonutChart /></div>}

            <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.1)", background: "white" }}>
              <div style={{ background: data.gradient, padding: "22px 20px 18px", color: "white", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, position: "relative" }}>
                  <div>
                    <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1 }}>{data.emoji} {selected}</div>
                    <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{data.company}</div>
                    <div style={{ display: "inline-block", marginTop: 8, background: "rgba(255,255,255,0.25)", borderRadius: 100, padding: "3px 12px", fontSize: 11, fontWeight: 600 }}>{data.tag}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="price-animate" style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{live ? `$${live.price}` : data.allocation + "%"}</div>
                    <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{live ? "live price" : "of portfolio"}</div>
                    {live && <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: parseFloat(live.changePct) >= 0 ? "#a8e063" : "#ffb3b3" }}>{parseFloat(live.changePct) >= 0 ? "▲" : "▼"}{Math.abs(parseFloat(live.changePct))}% today</div>}
                  </div>
                </div>
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <ConvictionBar score={data.convictionScore} />
                  <AllocationBar pct={data.allocation} />
                </div>
              </div>

              {/* 52-week bar + analyst target visual */}
              {live && (
                <div style={{ background: data.light, padding: "14px 18px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center", marginBottom: 12 }}>
                    {[{ label: "Live Price", val: `$${live.price}`, color: "#333" }, { label: "Today", val: `${parseFloat(live.changePct) >= 0 ? "▲" : "▼"}${Math.abs(parseFloat(live.changePct))}%`, color: parseFloat(live.changePct) >= 0 ? "#10b981" : "#ef4444" }, { label: "Market Cap", val: fmtMktCap(live.marketCap), color: "#555" }, { label: "To Target", val: data.analystTarget ? `${(((data.analystTarget - parseFloat(live.price)) / parseFloat(live.price)) * 100).toFixed(1)}%` : "N/A", color: "#6366f1" }].map((s, i) => (
                      <div key={i} style={{ borderRight: i < 3 ? "1px solid #e8e8e8" : "none" }}>
                        <div className="price-animate" style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: 9, color: "#bbb", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* 52-week progress bar */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>
                      <span>52W Low: ${data.week52Low}</span>
                      <span style={{ color: data.accent, fontWeight: 800 }}>Current: ${live.price}</span>
                      <span>52W High: ${data.week52High}</span>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: 100, height: 8, overflow: "hidden", position: "relative" }}>
                      <div style={{ width: `${Math.min(100, Math.max(0, ((parseFloat(live.price) - data.week52Low) / (data.week52High - data.week52Low)) * 100))}%`, height: "100%", background: data.gradient, borderRadius: 100, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                  {/* Analyst target bar */}
                  {data.analystTarget && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>
                        <span>Current</span>
                        <span style={{ color: "#6366f1", fontWeight: 800 }}>Analyst Target: ${data.analystTarget}</span>
                      </div>
                      <div style={{ background: "#f0f0f0", borderRadius: 100, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, (parseFloat(live.price) / data.analystTarget) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #667eea, #6366f1)", borderRadius: 100 }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Technical signals */}
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #f5f5f5", background: "#fafafa", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginRight: 4, paddingTop: 2 }}>📡 Technicals:</div>
                {[
                  { label: `RSI ${data.rsi}`, ok: data.rsi > 30 && data.rsi < 70, warn: data.rsi >= 70, color: data.rsi < 30 ? "#ef4444" : data.rsi > 70 ? "#f59e0b" : "#10b981" },
                  { label: data.aboveMa50 ? "Above 50MA ✅" : "Below 50MA ⚠️", color: data.aboveMa50 ? "#10b981" : "#f59e0b" },
                  { label: data.aboveMa200 ? "Above 200MA ✅" : "Below 200MA ❌", color: data.aboveMa200 ? "#10b981" : "#ef4444" },
                  { label: `Earnings: ${data.earningsDate}`, color: "#6366f1" },
                ].map((s, i) => (
                  <div key={i} style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: s.color }}>{s.label}</div>
                ))}
              </div>

              {/* Field groups */}
              <div style={{ padding: 12 }}>
                {fieldGroups.map((group, gi) => {
                  const isOpen = openGroups[gi];
                  return (
                    <div key={gi} style={{ marginBottom: 8 }}>
                      <button onClick={() => setOpenGroups(p => ({ ...p, [gi]: !p[gi] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 12, border: "none", background: isOpen ? group.color : group.bg, color: isOpen ? "white" : "#444", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s ease", boxShadow: isOpen ? `0 4px 16px ${group.color}40` : "none" }}>
                        <span>{group.groupLabel}</span>
                        <span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7 }}>▼</span>
                      </button>
                      {isOpen && (
                        <div style={{ background: "#fafafa", borderRadius: "0 0 12px 12px", overflow: "hidden", border: `2px solid ${group.color}25`, borderTop: "none", marginTop: -4 }}>
                          {group.fields.map((field, fi) => (
                            <div key={field.key} style={{ display: "grid", gridTemplateColumns: "130px 1fr", borderBottom: fi < group.fields.length - 1 ? "1px solid #f0f0f0" : "none", background: fi % 2 === 0 ? "white" : "#fafafa" }}>
                              <div style={{ padding: "11px 14px", fontSize: 10, fontWeight: 700, color: group.color, letterSpacing: "0.5px", textTransform: "uppercase", borderRight: `3px solid ${group.color}20`, paddingTop: 13 }}>{field.label}</div>
                              <div style={{ padding: "11px 14px", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{field.key === "allocation" ? `${data[field.key]}%` : data[field.key]}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 1: MY P&L ── */}
        {activeTab === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>My Portfolio P&L</div>
              <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Enter your actual positions to track real gains & losses</p>
            </div>
            {totals.n > 0 && (
              <div style={{ background: totals.pnl >= 0 ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "linear-gradient(135deg, #fee2e2, #fecaca)", borderRadius: 20, padding: "18px 20px", marginBottom: 16, border: `2px solid ${totals.pnl >= 0 ? "#10b981" : "#ef4444"}40` }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: totals.pnl >= 0 ? "#065f46" : "#991b1b", marginBottom: 8 }}>Total P&L ({totals.n} positions)</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: totals.pnl >= 0 ? "#10b981" : "#ef4444" }}>{totals.pnl >= 0 ? "+" : ""}${totals.pnl.toFixed(2)}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: totals.pnl >= 0 ? "#059669" : "#dc2626", marginTop: 4 }}>{totals.pnl >= 0 ? "▲" : "▼"} {Math.abs(totals.pct).toFixed(2)}%</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    {[{ label: "Cost Basis", val: `$${totals.tc.toFixed(2)}` }, { label: "Current Value", val: `$${totals.tv.toFixed(2)}` }].map((s, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.5)", borderRadius: 12, padding: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#333" }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#333" }}>📝 Your Positions</div>
                <button onClick={() => setEditingPositions(!editingPositions)} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{editingPositions ? "✅ Done" : "✏️ Edit"}</button>
              </div>
              {editingPositions && <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: "#4338ca", lineHeight: 1.6 }}>💡 Enter your average cost per share and shares owned. Live prices calculate your real P&L automatically.</div>}
              <div style={{ display: "grid", gap: 10 }}>
                {TICKERS.map(ticker => {
                  const d = staticData[ticker], ld = liveData[ticker], pnl = calcPnL(ticker), pos = positions[ticker];
                  return (
                    <div key={ticker} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                      <div style={{ background: d.gradient, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{d.emoji} {ticker}</div>
                        <div style={{ color: "white", fontSize: 12, opacity: 0.9 }}>{ld ? `$${ld.price}` : "Loading..."}</div>
                      </div>
                      {editingPositions ? (
                        <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "white" }}>
                          {[{ label: "Avg Cost/Share ($)", key: "avgCost", ph: "e.g. 189.50" }, { label: "Shares Owned", key: "shares", ph: "e.g. 1.31" }].map(f => (
                            <div key={f.key}>
                              <label style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
                              <input type="number" placeholder={f.ph} value={pos[f.key]} onChange={e => setPositions(p => ({ ...p, [ticker]: { ...p[ticker], [f.key]: e.target.value } }))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: "10px 14px", background: "white" }}>
                          {pnl ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
                              {[{ label: "Cost", val: `$${pnl.costBasis.toFixed(2)}`, c: "#555" }, { label: "Value", val: `$${pnl.currentValue.toFixed(2)}`, c: "#333" }, { label: "P&L $", val: `${pnl.pnl >= 0 ? "+" : ""}$${pnl.pnl.toFixed(2)}`, c: pnl.pnl >= 0 ? "#10b981" : "#ef4444" }, { label: "P&L %", val: `${pnl.pnlPct >= 0 ? "▲" : "▼"}${Math.abs(pnl.pnlPct).toFixed(2)}%`, c: pnl.pnlPct >= 0 ? "#10b981" : "#ef4444" }].map((s, i) => (
                                <div key={i} style={{ borderRight: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                                  <div style={{ fontSize: 13, fontWeight: 800, color: s.c }}>{s.val}</div>
                                  <div style={{ fontSize: 9, color: "#ccc", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                                </div>
                              ))}
                            </div>
                          ) : <div style={{ textAlign: "center", fontSize: 12, color: "#bbb", padding: "4px 0" }}>{pos.avgCost && pos.shares ? "Waiting for live price..." : "Tap Edit to enter position →"}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DCA Calculator */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#333", marginBottom: 14 }}>💵 DCA Calculator</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[{ label: "Invest per period ($)", val: dcaAmount, set: setDcaAmount, ph: "100" }, { label: "Years", val: dcaYears, set: setDcaYears, ph: "5" }].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
                    <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Frequency</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["weekly", "monthly", "quarterly"].map(f => (
                    <button key={f} onClick={() => setDcaFreq(f)} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", background: dcaFreq === f ? "linear-gradient(135deg, #667eea, #764ba2)" : "#f5f5f5", color: dcaFreq === f ? "white" : "#666", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              {dcaResult && (
                <div style={{ background: "linear-gradient(135deg, #f0f4ff, #fdf0ff)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", textAlign: "center", gap: 8 }}>
                    {[{ label: "Total Invested", val: `$${dcaResult.totalInvested.toFixed(0)}`, c: "#555" }, { label: "Final Value", val: `$${dcaResult.value.toFixed(0)}`, c: "#667eea" }, { label: "Total Gain", val: `+$${dcaResult.gain.toFixed(0)}`, c: "#10b981" }].map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 15, fontWeight: 900, color: s.c }}>{s.val}</div>
                        <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: "#888", marginTop: 8 }}>Based on 14% annualized return (historical U.S. market avg)</div>
                </div>
              )}
            </div>

            {/* What-if simulator */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#333", marginBottom: 14 }}>🔮 What-If Simulator</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Stock</label>
                  <select value={whatIfTicker} onChange={e => setWhatIfTicker(e.target.value)} style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", background: "white" }}>
                    {TICKERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Change %</label>
                  <input type="number" value={whatIfPct} onChange={e => setWhatIfPct(e.target.value)} placeholder="e.g. 20" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              {whatIfResult && (
                <div style={{ background: parseFloat(whatIfPct) >= 0 ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "linear-gradient(135deg, #fee2e2, #fecaca)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", textAlign: "center", gap: 8 }}>
                    {[{ label: "New Price", val: `$${whatIfResult.newPrice.toFixed(2)}`, c: "#333" }, { label: "Portfolio Impact", val: `${parseFloat(whatIfPct) >= 0 ? "+" : ""}${whatIfResult.portfolioImpactPct.toFixed(2)}%`, c: parseFloat(whatIfPct) >= 0 ? "#10b981" : "#ef4444" }, { label: "Your $ Impact", val: whatIfResult.portfolioImpact ? `${parseFloat(whatIfPct) >= 0 ? "+" : ""}$${whatIfResult.portfolioImpact.toFixed(2)}` : "Enter position", c: parseFloat(whatIfPct) >= 0 ? "#10b981" : "#ef4444" }].map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 15, fontWeight: 900, color: s.c }}>{s.val}</div>
                        <div style={{ fontSize: 9, color: "#888", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: HEAT MAP ── */}
        {activeTab === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Portfolio Heat Map</div>
              <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Size = portfolio weight · Color = today's performance</p>
            </div>
            {/* Sentiment gauge */}
            <div style={{ background: "white", borderRadius: 20, padding: "16px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#333" }}>😰 Market Sentiment</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: fgColor }}>{fgLabel}</div>
              </div>
              <div style={{ background: `linear-gradient(90deg, #ef4444, #f97316, #f59e0b, #84cc16, #10b981)`, borderRadius: 100, height: 12, position: "relative", overflow: "visible" }}>
                <div style={{ position: "absolute", top: -4, left: `${fgScore}%`, transform: "translateX(-50%)", width: 20, height: 20, background: "white", borderRadius: "50%", border: `3px solid ${fgColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "left 0.8s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#aaa", fontWeight: 600, marginTop: 6 }}>
                <span>Extreme Fear</span><span>Fear</span><span>Neutral</span><span>Greed</span><span>Extreme Greed</span>
              </div>
            </div>

            {/* Heat map tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              {Object.entries(staticData).sort((a, b) => b[1].allocation - a[1].allocation).map(([ticker, d]) => {
                const ld = liveData[ticker];
                const pct = ld ? parseFloat(ld.changePct) : 0;
                const intensity = Math.min(Math.abs(pct) / 3, 1);
                const bg = !ld ? "#e5e7eb" : pct > 0 ? `rgba(16, ${Math.round(185 - intensity * 30)}, 100, ${0.2 + intensity * 0.7})` : pct < 0 ? `rgba(${Math.round(220 + intensity * 35)}, 38, 38, ${0.2 + intensity * 0.7})` : "#e5e7eb";
                const textC = !ld ? "#666" : Math.abs(pct) > 1 ? "white" : pct > 0 ? "#065f46" : "#991b1b";
                return (
                  <div key={ticker} onClick={() => { setSelected(ticker); setActiveTab(0); }} style={{ background: bg, borderRadius: 16, padding: "16px 12px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", boxShadow: selected === ticker ? "0 4px 20px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.06)", transform: selected === ticker ? "scale(1.03)" : "none", gridColumn: ticker === "NVDA" ? "span 1" : "span 1" }}>
                    <div style={{ fontSize: 20, marginBottom: 2 }}>{d.emoji}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: textC }}>{ticker}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: textC, opacity: 0.9 }}>{d.allocation}%</div>
                    {ld ? <div style={{ fontSize: 14, fontWeight: 900, color: textC, marginTop: 4 }}>{pct >= 0 ? "▲" : "▼"}{Math.abs(pct).toFixed(2)}%</div> : <div style={{ fontSize: 11, color: "#aaa" }}>Loading...</div>}
                    {ld && <div style={{ fontSize: 11, color: textC, opacity: 0.8, marginTop: 2 }}>${ld.price}</div>}
                  </div>
                );
              })}
            </div>

            {/* Correlation matrix */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#333", marginBottom: 4 }}>🔗 Correlation Matrix</div>
              <p style={{ color: "#888", fontSize: 12, marginBottom: 14 }}>How much your positions move together (1.0 = identical)</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "6px 8px", textAlign: "left", color: "#aaa", fontWeight: 700 }}></th>
                      {TICKERS.map(t => <th key={t} style={{ padding: "6px 6px", textAlign: "center", color: staticData[t].accent, fontWeight: 800, fontSize: 10 }}>{t}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {TICKERS.map(t1 => (
                      <tr key={t1}>
                        <td style={{ padding: "6px 8px", fontWeight: 800, color: staticData[t1].accent, fontSize: 10 }}>{t1}</td>
                        {TICKERS.map(t2 => {
                          const val = t1 === t2 ? 1.0 : (staticData[t1].correlation[t2] || 0.5);
                          const bg = val >= 0.8 ? "#fee2e2" : val >= 0.6 ? "#fef3c7" : "#f0fdf4";
                          const tc = val >= 0.8 ? "#991b1b" : val >= 0.6 ? "#92400e" : "#065f46";
                          return <td key={t2} style={{ padding: "6px 6px", textAlign: "center", background: bg, color: tc, fontWeight: val === 1.0 ? 900 : 700, borderRadius: 4 }}>{val.toFixed(2)}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, marginTop: 10 }}>🔴 High (0.8+) = concentrated risk &nbsp; 🟡 Medium (0.6–0.8) = some overlap &nbsp; 🟢 Low (&lt;0.6) = good diversification</p>
            </div>
          </div>
        )}

        {/* ── TAB 3: NEWS ── */}
        {activeTab === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Market News</div>
              <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Headlines relevant to your portfolio</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, justifyContent: "center" }}>
              {["ALL", ...TICKERS, "MARKET"].map(t => (
                <button key={t} onClick={() => setNewsFilter(t)} style={{ padding: "6px 12px", borderRadius: 100, border: "none", background: newsFilter === t ? (staticData[t] ? staticData[t].gradient : "linear-gradient(135deg, #667eea, #764ba2)") : "white", color: newsFilter === t ? "white" : "#666", fontWeight: 700, fontSize: 11, cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", transition: "all 0.2s ease" }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {newsItems.filter(n => newsFilter === "ALL" || n.ticker === newsFilter).map((item, i) => (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderLeft: `4px solid ${item.sentiment === "bullish" ? "#10b981" : item.sentiment === "bearish" ? "#ef4444" : "#f59e0b"}`, animation: "slideIn 0.3s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ background: staticData[item.ticker] ? staticData[item.ticker].gradient : "linear-gradient(135deg, #667eea, #764ba2)", color: "white", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>{item.ticker}</span>
                        <span style={{ background: item.sentiment === "bullish" ? "#d1fae5" : item.sentiment === "bearish" ? "#fee2e2" : "#fef3c7", color: item.sentiment === "bullish" ? "#065f46" : item.sentiment === "bearish" ? "#991b1b" : "#92400e", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{item.sentiment === "bullish" ? "📈 Bullish" : item.sentiment === "bearish" ? "📉 Bearish" : "➡️ Neutral"}</span>
                        <span style={{ color: "#bbb", fontSize: 10, fontWeight: 600, paddingTop: 2 }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#333", lineHeight: 1.5 }}>{item.headline}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 16, padding: "12px 16px", background: "white", borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>📡 For live news, visit <a href="https://finviz.com" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", fontWeight: 700 }}>Finviz.com</a>, <a href="https://stockanalysis.com" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", fontWeight: 700 }}>Stockanalysis.com</a>, or search your tickers on <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", fontWeight: 700 }}>Yahoo Finance</a></div>
            </div>
          </div>
        )}

        {/* ── TAB 4: CALENDAR ── */}
        {activeTab === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Earnings & Economic Calendar</div>
              <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Key dates for your portfolio</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderRadius: 16, padding: "12px 16px", marginBottom: 14, border: "2px solid #f59e0b40" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#92400e" }}>⚡ Coming Up This Week</div>
              <div style={{ fontSize: 13, color: "#78350f", marginTop: 4 }}>NVDA earnings Feb 26 — biggest catalyst of the quarter. Expect volatility.</div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {economicCalendar.map((item, i) => (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderLeft: `4px solid ${item.type === "earnings" ? "#667eea" : item.impact === "HIGH" ? "#ef4444" : "#f59e0b"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ background: item.type === "earnings" ? "linear-gradient(135deg, #667eea, #764ba2)" : "#fee2e2", color: item.type === "earnings" ? "white" : "#991b1b", borderRadius: 100, padding: "2px 10px", fontSize: 10, fontWeight: 800 }}>{item.type === "earnings" ? "📊 Earnings" : "🏛️ Macro"}</span>
                        <span style={{ background: item.impact === "HIGH" ? "#fee2e2" : "#fef3c7", color: item.impact === "HIGH" ? "#991b1b" : "#92400e", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{item.impact} IMPACT</span>
                        <span style={{ background: "#f0f4ff", color: "#667eea", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 800 }}>{item.date}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#333", marginBottom: 4 }}>{item.event}</div>
                      <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{item.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: METRICS ── */}
        {activeTab === 5 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Stock Metrics</div>
            </div>
            {Object.entries(staticData).map(([ticker, d]) => {
              const ld = liveData[ticker];
              const upside = ld && d.analystTarget ? (((d.analystTarget - parseFloat(ld.price)) / parseFloat(ld.price)) * 100).toFixed(1) : null;
              return (
                <div key={ticker} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 12 }}>
                  <div style={{ background: d.gradient, padding: "14px 18px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontWeight: 900, fontSize: 18 }}>{d.emoji} {ticker}</div><div style={{ fontSize: 11, opacity: 0.85 }}>{d.company}</div></div>
                    <div style={{ textAlign: "right" }}>
                      <div className="price-animate" style={{ fontSize: 18, fontWeight: 800 }}>{ld ? `$${ld.price}` : "Loading..."}</div>
                      {ld && <div style={{ fontSize: 11, opacity: 0.9 }}>{parseFloat(ld.changePct) >= 0 ? "▲" : "▼"}{Math.abs(parseFloat(ld.changePct))}% today</div>}
                      {upside && <div style={{ fontSize: 11, opacity: 0.9 }}>{upside}% to target</div>}
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                      {[{ label: "Fwd P/E", val: d.peRatio }, { label: "PEG", val: d.pegRatio }, { label: "EV/EBITDA", val: d.evEbitda }, { label: "Gross Margin", val: d.grossMargin }, { label: "Op. Margin", val: d.operatingMargin }, { label: "ROE", val: d.roe }].map((m, i) => (
                        <div key={i} style={{ background: "#f8f8f8", borderRadius: 10, padding: 10, textAlign: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#333" }}>{m.val}</div>
                          <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                      {[{ label: "Debt/Equity", val: d.debtEquity }, { label: "Revenue Growth", val: d.revenueGrowth }].map((m, i) => (
                        <div key={i} style={{ background: "#f8f8f8", borderRadius: 10, padding: 10, textAlign: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#333" }}>{m.val}</div>
                          <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, background: "#f0f9ff", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, color: "#0891b2", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Free Cash Flow</div>
                      <div style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{d.fcf}</div>
                    </div>
                    {/* Technical signals mini */}
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {[{ label: `RSI ${d.rsi}`, color: d.rsi < 30 ? "#ef4444" : d.rsi > 70 ? "#f59e0b" : "#10b981" }, { label: d.aboveMa50 ? "▲ 50MA" : "▼ 50MA", color: d.aboveMa50 ? "#10b981" : "#f59e0b" }, { label: d.aboveMa200 ? "▲ 200MA" : "▼ 200MA", color: d.aboveMa200 ? "#10b981" : "#ef4444" }].map((s, i) => (
                        <div key={i} style={{ background: `${s.color}15`, borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TABS 6-12: Reuse existing content ── */}
        {activeTab === 6 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Due Diligence Guide</div></div>
            {[{ cat: "📊 Valuation", color: "#3b82f6", items: [{ n: "Forward P/E", d: "Under 15x = cheap. 15–25x = fair. 25–40x = growth premium. 40x+ = must execute perfectly.", t: "Always compare to sector average. A 40x P/E for a semiconductor growing 60% YoY is reasonable." }, { n: "PEG Ratio", d: "Under 1.0 = undervalued vs growth. 1–2 = fairly valued. Above 2 = expensive.", t: "Best metric for growth stocks. P/E ÷ earnings growth rate. AVGO's PEG of ~0.85 is why we own it." }, { n: "EV/EBITDA", d: "Under 10x = value. 10–15x = fair. 15–20x = premium. 20x+ = needs strong growth.", t: "Better than P/E for comparing companies with different debt levels." }] }, { cat: "📈 Growth", color: "#10b981", items: [{ n: "Revenue Growth (YoY)", d: "Under 5% = slow. 5–10% = steady. 10–20% = solid. 20–40% = strong. 40%+ = exceptional.", t: "Is it accelerating or decelerating? Decelerating is often more concerning than slow growth." }, { n: "Free Cash Flow (FCF)", d: "Positive and growing = healthy. The single most important number.", t: "Growing FCF means the company funds its own future. MSFT at $70B+ FCF is exceptional." }] }, { cat: "💪 Quality", color: "#8b5cf6", items: [{ n: "Return on Equity (ROE)", d: "Under 10% = below average. 10–15% = average. 15–20% = good. 20%+ = excellent.", t: "Warren Buffett's favorite metric. Consistent over 3–5 years is better than spiky." }, { n: "Debt-to-Equity", d: "Under 0.5x = conservative. 0.5–1.5x = manageable. 1.5–3x = elevated. Above 3x = high risk.", t: "AVGO is at 1.8x due to VMware acquisition — acceptable given FCF generated to pay it down." }] }, { cat: "🔍 6-Step Smell Test", color: "#f59e0b", items: [{ n: "Step 1 — Is it growing?", d: "Check revenue and EPS growth YoY. Accelerating or decelerating?", t: "" }, { n: "Step 2 — Is it fairly priced?", d: "Forward P/E and PEG. High P/E is ok IF PEG is under 2.0.", t: "" }, { n: "Step 3 — Is the business healthy?", d: "FCF positive? Margins stable or expanding? Debt manageable?", t: "" }, { n: "Step 4 — Is management good?", d: "ROE consistently above 15% over 3–5 years.", t: "" }, { n: "Step 5 — What could go wrong?", d: "Read the Risk Factors in the 10-K on SEC.gov.", t: "Most underused tool by retail investors." }, { n: "Step 6 — Sector context?", d: "Is this sector leading or lagging? Check Stockcharts RRG.", t: "" }] }].map((cat, ci) => (
              <div key={ci} style={{ marginBottom: 12, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <button onClick={() => setOpenDD(p => ({ ...p, [ci]: !p[ci] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", border: "none", background: openDD[ci] ? cat.color : "white", color: openDD[ci] ? "white" : "#333", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.2s ease" }}>
                  <span>{cat.cat}</span><span style={{ transform: openDD[ci] ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>▼</span>
                </button>
                {openDD[ci] && <div style={{ background: "white" }}>{cat.items.map((item, ii) => (
                  <div key={ii} style={{ padding: "14px 20px", borderTop: "1px solid #f5f5f5" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: cat.color, marginBottom: 5 }}>{item.n}</div>
                    <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: item.t ? 8 : 0 }}>{item.d}</div>
                    {item.t && <div style={{ display: "flex", gap: 8, background: `${cat.color}10`, borderRadius: 8, padding: "8px 12px" }}><span>💡</span><span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{item.t}</span></div>}
                  </div>
                ))}</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 7 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Swing Trading Prep</div></div>
            <div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderRadius: 16, padding: "14px 18px", marginBottom: 14, border: "2px solid #f59e0b40" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#92400e", marginBottom: 5 }}>⚠️ The Golden Rule</div>
              <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>Paper trade on Webull for a minimum of <strong>60 days</strong> before ANY real swing trades. Target: win rate above 50% AND average win larger than average loss.</div>
            </div>
            {[{ concept: "📊 Support & Resistance", detail: "Support = a price level where a stock has historically bounced upward. Resistance = where it has stalled. Buy near support, take profits near resistance.", tip: "Draw horizontal lines on TradingView at obvious price levels where the stock repeatedly reversed." }, { concept: "📈 Moving Averages", detail: "50-day MA and 200-day MA are the most watched levels. Price above both = bullish. The Golden Cross (50MA crosses above 200MA) is a bullish signal.", tip: "Golden Cross = bullish. Death Cross (50MA crosses below 200MA) = bearish." }, { concept: "⚡ RSI", detail: "Momentum on a 0–100 scale. Above 70 = overbought. Below 30 = oversold. Most useful in range-bound markets.", tip: "Don't use RSI alone — combine with support/resistance and volume." }, { concept: "🌊 MACD", detail: "MACD line crossing above signal line = bullish. Crossing below = bearish. Histogram shows strength.", tip: "MACD divergence is powerful — when price makes new high but MACD doesn't, momentum is fading." }, { concept: "📦 Volume", detail: "Breakout on HIGH volume = institutional conviction — the move is real. Low volume breakout = likely false.", tip: "A valid breakout should show at least 1.5–2x average daily volume." }, { concept: "🕯️ Candlesticks", detail: "Hammer (bullish reversal at support), Shooting Star (bearish at resistance), Engulfing (strong reversal).", tip: "Learn 3 patterns really well rather than 50 poorly." }, { concept: "📋 Paper Trade First", detail: "Use Webull's paper trading simulator for 60 days minimum. Track wins AND losses.", tip: "Target: win rate above 50% AND average win larger than average loss before going live." }].map((item, i) => (
              <div key={i} style={{ marginBottom: 10, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", background: "white" }}>
                <button onClick={() => setOpenSwing(p => ({ ...p, [i]: !p[i] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: openSwing[i] ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: openSwing[i] ? "white" : "#333", fontWeight: 700, fontSize: 13.5, cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" }}>
                  <span>{item.concept}</span><span style={{ transform: openSwing[i] ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7, flexShrink: 0, marginLeft: 10 }}>▼</span>
                </button>
                {openSwing[i] && <div style={{ padding: "14px 18px" }}><div style={{ fontSize: 13.5, color: "#444", lineHeight: 1.7, marginBottom: 10 }}>{item.detail}</div><div style={{ display: "flex", gap: 8, background: "#f0f9ff", borderRadius: 10, padding: "10px 12px" }}><span>💡</span><span style={{ fontSize: 12.5, color: "#0369a1", lineHeight: 1.6 }}>{item.tip}</span></div></div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 8 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sector Rotation</div><p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Current rotation as of February 2026</p></div>
            {sectorRotation.map((s, i) => (
              <div key={i} style={{ marginBottom: 10, background: "white", borderRadius: 16, padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: `5px solid ${s.status.includes("🟢") ? "#10b981" : s.status.includes("🟡") ? "#f59e0b" : "#ef4444"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#333" }}>{s.sector}</div>
                  <span style={{ background: s.status.includes("🟢") ? "#d1fae5" : s.status.includes("🟡") ? "#fef3c7" : "#fee2e2", color: s.status.includes("🟢") ? "#065f46" : s.status.includes("🟡") ? "#92400e" : "#991b1b", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{s.status}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.6, marginBottom: 8 }}>{s.why}</div>
                <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "#666" }}><strong style={{ color: "#667eea" }}>Our Exposure:</strong> {s.ourExposure}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 9 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rules of Engagement</div></div>
            {rulesOfEngagement.map((item, i) => (
              <div key={i} style={{ marginBottom: 10, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", background: "white" }}>
                <button onClick={() => setOpenRule(openRule === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: openRule === i ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: openRule === i ? "white" : "#333", fontWeight: 700, fontSize: 13.5, cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" }}>
                  <span>{item.rule}</span><span style={{ transform: openRule === i ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7, flexShrink: 0, marginLeft: 10 }}>▼</span>
                </button>
                {openRule === i && <div style={{ padding: "14px 18px 16px", borderTop: "1px solid #f0f0f0", fontSize: 13.5, color: "#555", lineHeight: 1.7 }}>{item.detail}</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 10 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Quarterly Review</div></div>
            <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: "#333" }}>📅 Review Schedule</div>
              {[{ q: "Q1", date: "Mid-February", note: "After Q4 earnings" }, { q: "Q2", date: "Mid-May", note: "After Q1 earnings" }, { q: "Q3", date: "Mid-August", note: "After Q2 earnings" }, { q: "Q4", date: "Mid-November", note: "After Q3 earnings" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>{item.q} Review</div><div style={{ fontSize: 11, color: "#aaa" }}>{item.note}</div></div>
                  <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{item.date}</div>
                </div>
              ))}
            </div>
            {quarterlyChecklist.map((phase, pi) => (
              <div key={pi} style={{ marginBottom: 10, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <button onClick={() => setOpenChecklist(p => ({ ...p, [pi]: !p[pi] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: openChecklist[pi] ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: openChecklist[pi] ? "white" : "#333", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s ease" }}>
                  <span>{phase.phase}</span><span style={{ transform: openChecklist[pi] ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7 }}>▼</span>
                </button>
                {openChecklist[pi] && <div style={{ background: "white", padding: "8px 0" }}>{phase.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 18px", borderBottom: ii < phase.items.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                    <div style={{ width: 18, height: 18, border: "2px solid #667eea", borderRadius: "50%", flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{item}</div>
                  </div>
                ))}</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 11 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Research Resources</div></div>
            {resources.map((res, i) => (
              <div key={i} style={{ marginBottom: 10, background: "white", borderRadius: 16, padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `4px solid ${res.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div><div style={{ fontWeight: 800, fontSize: 15, color: res.color, marginBottom: 4 }}>{res.name}</div><div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{res.use}</div></div>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ background: res.color, color: "white", padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>Visit →</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 12 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}><div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Watchlist</div><p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Strong & moderate conviction — in priority order</p></div>
            {watchlistData.map((item, i) => (
              <div key={i} style={{ marginBottom: 12, background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `5px solid ${item.color}` }}>
                <button onClick={() => setOpenWatchlist(p => ({ ...p, [i]: !p[i] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.ticker}</span>
                    <div>
                      <div style={{ fontSize: 12, color: "#888" }}>{item.conviction}</div>
                      <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{item.note.substring(0, 45)}...</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ background: `${item.color}18`, border: `1.5px solid ${item.color}40`, borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: item.color, whiteSpace: "nowrap" }}>{item.priority}</span>
                    <span style={{ transform: openWatchlist[i] ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.4, fontSize: 12 }}>▼</span>
                  </div>
                </button>
                {openWatchlist[i] && (
                  <div style={{ padding: "0 18px 14px", borderTop: "1px solid #f5f5f5", paddingTop: 12 }}>
                    <div style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7, marginBottom: 12 }}>{item.why}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f8f8", borderRadius: 10, padding: "10px 14px" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>🔔 Alert at $</span>
                      <input type="number" value={priceAlerts[item.ticker] || ""} onChange={e => setPriceAlerts(p => ({ ...p, [item.ticker]: e.target.value }))} placeholder="Set target" style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${item.color}40`, fontSize: 13, outline: "none", background: "white" }} />
                      {priceAlerts[item.ticker] && liveData[item.ticker] && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: parseFloat(liveData[item.ticker]?.price) <= parseFloat(priceAlerts[item.ticker]) ? "#10b981" : "#f59e0b", whiteSpace: "nowrap" }}>
                          {parseFloat(liveData[item.ticker]?.price) <= parseFloat(priceAlerts[item.ticker]) ? "✅ IN RANGE!" : `$${liveData[item.ticker]?.price} now`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div style={{ background: "white", borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginTop: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: "#333" }}>💵 Next Capital Deployment</div>
              {[{ order: "1st", ticker: "SCHD", why: "Income & defensive layer — add immediately", color: "#10b981" }, { order: "2nd", ticker: "GEV", why: "Only if it pulls back to $700–750", color: "#f59e0b" }, { order: "3rd", ticker: "LLY", why: "When you can deploy $300–500 meaningfully", color: "#ec4899" }, { order: "4th", ticker: "GOOGL", why: "Revisit at each quarterly review", color: "#3b82f6" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                  <div style={{ background: item.color, color: "white", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10, flexShrink: 0 }}>{item.order}</div>
                  <div><div style={{ fontWeight: 800, fontSize: 14, color: item.color }}>{item.ticker}</div><div style={{ fontSize: 12, color: "#888", marginTop: 2, lineHeight: 1.5 }}>{item.why}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "#ccc", padding: "0 16px" }}>
        Not financial advice • Personal reference only • Review quarterly 💛<br />
        <span style={{ fontSize: 10 }}>Live prices via Yahoo Finance • 70% Stocks / 30% ETFs ✅ • Built with 💖</span>
      </div>
    </div>
  );
}

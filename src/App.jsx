import React, { useState, useEffect, useCallback } from "react";

const TICKERS = ["NVDA", "AVGO", "MSFT", "CEG", "VTI", "VXUS", "MCK"];
const NAMES = ["Beautiful", "Money Moves", "Boss Investor", "Dream Team", "Future Millionaire", "Sexy"];

// CORRECTED 30/70 SPLIT
const staticData = {
  NVDA: {
    company: "Nvidia Corporation", sector: "Technology / Semiconductors", category: "Aggressive Growth",
    allocation: 20, dollarAmount: "$225.92", approxShares: "~1.19", analystTarget: 253.88,
    buySell: "57 Buy, 7 Hold, 1 Sell", consensus: "Strong Buy", convictionScore: 9, conviction: "9/10",
    recentPerformance: "Volatile post-DeepSeek shock", upcomingCatalyst: "⚡ Earnings Feb 25 — expect short term volatility",
    timeHorizon: "3–5+ years", bucket: "Aggressive", dividendYield: "~0.03%", expenseRatio: "N/A",
    rothOverlap: "Indirect via QQQ", aiAngle: "GPU / general AI infrastructure — sells to everyone",
    macroTailwinds: "AI data center demand, CUDA ecosystem moat, data center buildout accelerating",
    whyWeOwnIt: "AI infrastructure still in early innings. CUDA moat competitors cannot replicate in 2–3 years. DeepSeek shock was overblown — efficient AI models still need Nvidia hardware to train and run at scale.",
    whyNotAlternative: "N/A",
    riskFactors: "High valuation, Taiwan supply chain geopolitical risk, long term competition from AMD and hyperscaler custom chips",
    entryPointNote: "Conviction buy long term — be prepared for short term volatility around Feb 25 earnings",
    nextAddPriority: "Hold and add on dips", watchlistConnection: "N/A",
    gradient: "linear-gradient(135deg, #76b900, #a8e063)", light: "#f0ffe0", accent: "#76b900",
    tag: "🟢 Aggressive Growth", emoji: "⚡",
    peRatio: "~31x", pegRatio: "~0.9", evEbitda: "~35x", grossMargin: "~75%", operatingMargin: "~55%", roe: "~115%", debtEquity: "~0.4x", fcf: "Growing strongly — $26B+ annually", revenueGrowth: "~122% YoY",
  },
  AVGO: {
    company: "Broadcom Inc.", sector: "Technology / Semiconductors + Enterprise Software", category: "Aggressive-Moderate Growth",
    allocation: 16, dollarAmount: "$180.73", approxShares: "~0.52", analystTarget: 475.00,
    buySell: "46 Buy, 2 Hold, 0 Sell", consensus: "Strong Buy 9.5/10", convictionScore: 10, conviction: "10/10 ⭐",
    recentPerformance: "~50% gain in 2025", upcomingCatalyst: "📅 Earnings Mar 4 — clean window to buy before then",
    timeHorizon: "3–5+ years", bucket: "Aggressive-Moderate", dividendYield: "~1.1%", expenseRatio: "N/A",
    rothOverlap: "Indirect via QQQ", aiAngle: "Custom AI silicon + networking for hyperscalers — Google, Meta, Apple, OpenAI",
    macroTailwinds: "Custom AI chip demand, VMware enterprise software FCF, AI capex cycle accelerating",
    whyWeOwnIt: "Builds the custom chips hyperscalers use to reduce NVDA dependence — meaning NVDA's biggest long term threat is AVGO's biggest revenue opportunity. VMware adds enterprise software cash flow making it less cyclical.",
    whyNotAlternative: "Not CAT — ran 32% YTD, cyclical. Not KMI — pipeline utility doesn't match growth profile.",
    riskFactors: "Semiconductor cyclicality, VMware integration risk, customer concentration among few hyperscalers",
    entryPointNote: "Conviction buy — PEG ratio confirms undervalued relative to growth despite 2025 run. Strongest analyst consensus in entire portfolio.",
    nextAddPriority: "Hold — highest conviction, add as account grows", watchlistConnection: "N/A",
    gradient: "linear-gradient(135deg, #cc0000, #ff6b6b)", light: "#fff0f0", accent: "#cc0000",
    tag: "🔴 Aggressive-Moderate", emoji: "🔥",
    peRatio: "~34x", pegRatio: "~0.85", evEbitda: "~22x", grossMargin: "~64%", operatingMargin: "~37%", roe: "~60%+", debtEquity: "~1.8x (VMware acq)", fcf: "Strong — $19B+ annually", revenueGrowth: "~51% YoY",
  },
  MSFT: {
    company: "Microsoft Corporation", sector: "Technology / Enterprise Software + Cloud", category: "Moderate-Growth",
    allocation: 15, dollarAmount: "$169.44", approxShares: "~0.43", analystTarget: 628.98,
    buySell: "32 Buy, 2 Hold, 0 Sell", consensus: "Strong Buy 8.5/10", convictionScore: 9.5, conviction: "9.5/10",
    recentPerformance: "+16% YTD — underperformed past year despite strong business", upcomingCatalyst: "✅ None imminent — clean entry",
    timeHorizon: "3–5+ years", bucket: "Moderate-Growth", dividendYield: "~0.7%", expenseRatio: "N/A",
    rothOverlap: "None", aiAngle: "Enterprise AI monetization via Copilot — adopted by 70% of Fortune 500",
    macroTailwinds: "Azure growing 39% YoY, Copilot enterprise adoption, $80B cash reserve, path to $500B revenue by 2030",
    whyWeOwnIt: "Great business punished irrationally. Stock underperformed while Azure grew 39%, Copilot adopted by 70% of Fortune 500, and $80B cash sits on balance sheet. 98% of analysts say Buy with zero Sells.",
    whyNotAlternative: "Not GOOGL — already ran 65% YTD. Not CRM — Sales Cloud slowing and MSFT is direct competitive threat.",
    riskFactors: "Three tech names move together on bad tech days, Azure competition from AWS, Copilot adoption pace",
    entryPointNote: "Conviction buy — buying the lag between strong business performance and stock price.",
    nextAddPriority: "Hold and monitor quarterly", watchlistConnection: "GOOGL as future complement when capital allows",
    gradient: "linear-gradient(135deg, #00a4ef, #50d9ff)", light: "#e8f8ff", accent: "#00a4ef",
    tag: "🔵 Moderate-Growth", emoji: "☁️",
    peRatio: "~28x", pegRatio: "~1.4", evEbitda: "~22x", grossMargin: "~70%", operatingMargin: "~44%", roe: "~38%", debtEquity: "~0.35x", fcf: "Exceptional — $70B+ annually", revenueGrowth: "~17% YoY",
  },
  CEG: {
    company: "Constellation Energy", sector: "Energy / Nuclear Power Infrastructure", category: "Moderate-Growth",
    allocation: 12, dollarAmount: "$135.55", approxShares: "~0.47", analystTarget: 406.00,
    buySell: "14 Buy, 5 Hold, 0 Sell", consensus: "Strong Buy 8.5/10", convictionScore: 9, conviction: "9/10",
    recentPerformance: "Down 24% YTD — policy headline selloff, NOT fundamentals", upcomingCatalyst: "🚀 New CyrusOne 380MW deal signed this week!",
    timeHorizon: "3–5+ years", bucket: "Moderate-Growth", dividendYield: "~0.5%", expenseRatio: "N/A",
    rothOverlap: "None", aiAngle: "Nuclear power sold directly to AI data centers via long term PPAs",
    macroTailwinds: "AI data center power demand, nuclear energy renaissance, Big Tech long term PPA contracts",
    whyWeOwnIt: "Down 24% from a single policy headline — not fundamentals. Meta 20-year PPA, CyrusOne 380MW deal this week, Microsoft Three Mile Island in progress. EPS growing $11→$13→$16–17 through 2028.",
    whyNotAlternative: "Not GEV — at all time highs, median analyst says fairly valued, 2 Sell ratings. CEG offers same AI energy thesis at 24% discount with 53% upside and zero Sells.",
    riskFactors: "Policy and regulatory risk on nuclear pricing, execution risk on new contracts, competition for Big Tech PPA deals",
    entryPointNote: "Conviction buy at genuine discount — DCA: deploy ~$68 now, hold ~$68 as dry powder for any further pullback.",
    nextAddPriority: "Add remaining dry powder on any further pullback", watchlistConnection: "GEV on watchlist — add if pulls back to $700–750",
    gradient: "linear-gradient(135deg, #f7a800, #ffd166)", light: "#fffae8", accent: "#f7a800",
    tag: "🟡 Moderate-Growth", emoji: "⚛️",
    peRatio: "~16x", pegRatio: "~0.7", evEbitda: "~12x", grossMargin: "~28%", operatingMargin: "~18%", roe: "~22%", debtEquity: "~1.2x", fcf: "Strong — $4.5–6B projected through 2028", revenueGrowth: "~8% YoY",
  },
  VTI: {
    company: "Vanguard Total Stock Market ETF", sector: "Broad U.S. Market — ETF", category: "Anchor / Moderate",
    allocation: 17, dollarAmount: "$192.03", approxShares: "~0.57", analystTarget: null,
    buySell: "N/A — ETF", consensus: "N/A — ETF", convictionScore: 10, conviction: "10/10 ⭐",
    recentPerformance: "Small cap rotation benefiting in 2026 (-0.41% YTD vs RSP +3.65%)", upcomingCatalyst: "✅ No specific catalyst — hold forever",
    timeHorizon: "Indefinite — hold forever", bucket: "Anchor", dividendYield: "~1.3%", expenseRatio: "0.03% 💚",
    rothOverlap: "Minimal — VTI adds small/mid cap that VOO in Roth does not have",
    aiAngle: "Indirect — broad U.S. market exposure",
    macroTailwinds: "Broad U.S. economy growth, small cap rotation actively happening in 2026",
    whyWeOwnIt: "Entire U.S. market in one ETF — large, mid, AND small cap. Timely given small cap outperformance in early 2026. The stabilizing anchor of the portfolio.",
    whyNotAlternative: "Not RSP — 7x higher expense ratio (0.20% vs 0.03%), underperforms VTI over 10 years (13% vs 15.4% annualized), creates quarterly rebalancing tax drag in taxable account. RSP is a tactical trade — VTI is a core long-term hold.",
    riskFactors: "Market-wide downturns — mitigated by 4,000+ stock diversification",
    entryPointNote: "Always a reasonable entry — DCA consistently over time.",
    nextAddPriority: "First ETF to add to consistently", watchlistConnection: "SCHD — first new ETF on next capital injection",
    gradient: "linear-gradient(135deg, #1a5276, #2e86c1)", light: "#eaf4ff", accent: "#2e86c1",
    tag: "🛡️ Anchor ETF", emoji: "🇺🇸",
    peRatio: "~22x (market avg)", pegRatio: "N/A — ETF", evEbitda: "N/A", grossMargin: "N/A", operatingMargin: "N/A", roe: "N/A", debtEquity: "N/A", fcf: "N/A", revenueGrowth: "N/A",
  },
  VXUS: {
    company: "Vanguard Total International ETF", sector: "International Markets — ETF", category: "Anchor / Moderate",
    allocation: 13, dollarAmount: "$146.85", approxShares: "~1.76", analystTarget: null,
    buySell: "N/A — ETF", consensus: "N/A — ETF", convictionScore: 9.5, conviction: "9.5/10",
    recentPerformance: "Outperforming U.S. equities in 2026 ✅", upcomingCatalyst: "✅ No specific catalyst — hold forever",
    timeHorizon: "Indefinite — hold forever", bucket: "Anchor", dividendYield: "~2.8% 💚", expenseRatio: "0.07%",
    rothOverlap: "Intentional — international outperforming, worth holding in both accounts",
    aiAngle: "Indirect — international market exposure",
    macroTailwinds: "International outperformance in 2026, USD hedging, geographic diversification",
    whyWeOwnIt: "International equities genuinely outperforming U.S. in 2026. Hedges against U.S.-specific policy risk, dollar weakness, and domestic concentration risk.",
    whyNotAlternative: "N/A",
    riskFactors: "Currency risk, geopolitical risk in emerging markets, slower growth in EU and Japan",
    entryPointNote: "Always a reasonable entry — DCA consistently over time.",
    nextAddPriority: "Second ETF to add to consistently", watchlistConnection: "N/A",
    gradient: "linear-gradient(135deg, #117a65, #1abc9c)", light: "#e8fff8", accent: "#117a65",
    tag: "🌍 Anchor ETF", emoji: "🌎",
    peRatio: "N/A", pegRatio: "N/A", evEbitda: "N/A", grossMargin: "N/A", operatingMargin: "N/A", roe: "N/A", debtEquity: "N/A", fcf: "N/A", revenueGrowth: "N/A",
  },
  MCK: {
    company: "McKesson Corporation", sector: "Healthcare / Medical Distribution", category: "Moderate Growth / Quality",
    allocation: 7, dollarAmount: "$79.07", approxShares: "~0.08", analystTarget: 1107,
    buySell: "Moderate Buy", consensus: "Moderate Buy", convictionScore: 8.5, conviction: "8.5/10",
    recentPerformance: "+55.2% past year 🚀", upcomingCatalyst: "✅ None imminent",
    timeHorizon: "3–5 years", bucket: "Moderate", dividendYield: "~0.6%", expenseRatio: "N/A",
    rothOverlap: "None", aiAngle: "None — pure healthcare compounder",
    macroTailwinds: "Aging U.S. population, growing pharma demand, Healthcare Outperform rating next 6–12 months",
    whyWeOwnIt: "Largest pharma distributor in North America. Every drug prescribed and filled in the U.S. likely touches McKesson. Strong FCF, steady compounder, lower volatility than growth names.",
    whyNotAlternative: "Not LLY — $800+ price, drug pricing policy risk, high P/E requires perfect execution. Revisit LLY with more capital.",
    riskFactors: "Drug pricing regulation, Amazon pharmacy expansion long term, opioid litigation tail risk",
    entryPointNote: "Strong 1yr run but analyst targets suggest 10–15% more runway — add to this position as account grows.",
    nextAddPriority: "Priority add as account grows — position too small at 7%", watchlistConnection: "LLY as healthcare upgrade when account grows",
    gradient: "linear-gradient(135deg, #6c3483, #a855f7)", light: "#faf0ff", accent: "#6c3483",
    tag: "💜 Moderate Growth", emoji: "💊",
    peRatio: "~20x", pegRatio: "~1.1", evEbitda: "~14x", grossMargin: "~5–6%", operatingMargin: "~2.5%", roe: "~80%+", debtEquity: "~1.0x", fcf: "Strong — $4B+ annually", revenueGrowth: "~15% YoY",
  },
};

const DEFAULT_POSITIONS = {
  NVDA: { avgCost: "", shares: "" },
  AVGO: { avgCost: "", shares: "" },
  MSFT: { avgCost: "", shares: "" },
  CEG: { avgCost: "", shares: "" },
  VTI: { avgCost: "", shares: "" },
  VXUS: { avgCost: "", shares: "" },
  MCK: { avgCost: "", shares: "" },
};

const fieldGroups = [
  { groupLabel: "📊 Position Basics", color: "#3b82f6", bg: "#eff6ff", fields: [{ key: "sector", label: "Sector" }, { key: "category", label: "Category" }, { key: "bucket", label: "Bucket" }, { key: "timeHorizon", label: "Time Horizon" }, { key: "upcomingCatalyst", label: "Upcoming Catalyst" }, { key: "recentPerformance", label: "Recent Performance" }] },
  { groupLabel: "💰 Allocation & Pricing", color: "#10b981", bg: "#f0fdf4", fields: [{ key: "allocation", label: "Allocation %" }, { key: "dollarAmount", label: "Target $ Amount" }, { key: "approxShares", label: "Target Shares" }, { key: "dividendYield", label: "Dividend Yield" }, { key: "expenseRatio", label: "Expense Ratio" }, { key: "rothOverlap", label: "Roth IRA Overlap" }] },
  { groupLabel: "📈 Analyst Data", color: "#f59e0b", bg: "#fffbeb", fields: [{ key: "buySell", label: "Buy / Hold / Sell" }, { key: "consensus", label: "Consensus" }, { key: "conviction", label: "Our Conviction" }] },
  { groupLabel: "🌍 Market & AI Context", color: "#8b5cf6", bg: "#f5f3ff", fields: [{ key: "aiAngle", label: "AI Angle" }, { key: "macroTailwinds", label: "Macro Tailwinds" }] },
  { groupLabel: "🧠 Our Investment Thesis", color: "#ef4444", bg: "#fef2f2", fields: [{ key: "whyWeOwnIt", label: "Why We Own It" }, { key: "whyNotAlternative", label: "Why Not Alternative" }, { key: "entryPointNote", label: "Entry Point Note" }, { key: "nextAddPriority", label: "Next Add Priority" }, { key: "watchlistConnection", label: "Watchlist Connection" }] },
  { groupLabel: "⚠️ Risk Factors", color: "#dc2626", bg: "#fff5f5", fields: [{ key: "riskFactors", label: "Risk Factors" }] },
  { groupLabel: "📐 Key Metrics", color: "#0891b2", bg: "#f0f9ff", fields: [{ key: "peRatio", label: "Forward P/E" }, { key: "pegRatio", label: "PEG Ratio" }, { key: "evEbitda", label: "EV/EBITDA" }, { key: "grossMargin", label: "Gross Margin" }, { key: "operatingMargin", label: "Operating Margin" }, { key: "roe", label: "Return on Equity" }, { key: "debtEquity", label: "Debt-to-Equity" }, { key: "fcf", label: "Free Cash Flow" }, { key: "revenueGrowth", label: "Revenue Growth" }] },
];

const watchlistData = [
  { ticker: "SCHD", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "First add — income/defensive layer. 3.86% yield, 0.06% expense ratio. Perfect tech-heavy portfolio complement.", priority: "🥇 Next Buy", color: "#10b981", why: "Outperforming in 2026 rotation. Covers Consumer Staples, Energy, Healthcare — sectors largely absent from your portfolio. Dividend growing 10.58% annually for a decade." },
  { ticker: "GEV", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "Buy if pulls back to $700–750. $150B backlog. Power grid story most retail investors are still sleeping on.", priority: "🥈 Watch Price", color: "#f59e0b", why: "One of ~3 companies globally with scale to fix the power grid. AI data center energy demand thesis. Set Webull price alert at $700–750 now." },
  { ticker: "LLY", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "First healthcare upgrade when you can deploy $300–500 meaningfully.", priority: "🥉 Save Capital", color: "#ec4899", why: "GLP-1/Ozempic story still in early innings. Deep drug pipeline. Dominant position in one of the biggest pharma breakthroughs in decades. Excluded today due to account size only." },
  { ticker: "GOOGL", stars: 5, conviction: "⭐⭐⭐⭐⭐", note: "Revisit at quarterly review. Lost MSFT slot due to timing — GOOGL had already run 65%.", priority: "📋 Quarterly Check", color: "#3b82f6", why: "Dominant search, YouTube, Google Cloud, Waymo optionality. PEG under 1.5. If MSFT catches up and GOOGL pulls back, this moves to buy territory fast." },
  { ticker: "ORCL", stars: 4, conviction: "⭐⭐⭐⭐", note: "Watch quarterly earnings execution. $523B remaining performance obligation is extraordinary.", priority: "📋 Monitor", color: "#8b5cf6", why: "Cloud infrastructure for OpenAI. Revenue up 68% YoY. Near-term execution concerns are real but long-term story is compelling." },
  { ticker: "MELI", stars: 4, conviction: "⭐⭐⭐⭐", note: "Add when account reaches $3–5K. The Amazon + PayPal of Latin America.", priority: "📋 Scale Up First", color: "#f97316", why: "Dominant e-commerce AND fintech in Latin America. 32% annual earnings growth projected. Need meaningful capital for it to matter." },
  { ticker: "CRM", stars: 4, conviction: "⭐⭐⭐⭐", note: "75% analyst upside, 15x forward P/E. Revisit if MSFT exits portfolio.", priority: "📋 Conditional", color: "#06b6d4", why: "Agentforce growing 114% YoY. Down 34% over past year creating value opportunity. Held back because MSFT is its direct competitor." },
  { ticker: "ABBV", stars: 4, conviction: "⭐⭐⭐⭐", note: "High conviction income + growth combo. 3% dividend. Pairs beautifully with SCHD.", priority: "📋 Income Add", color: "#dc2626", why: "Dividend King — 54 consecutive years of increases. Rinvoq and Skyrizi entering new growth phase. Rare combo of income AND 17%+ annual earnings growth." },
  { ticker: "MRK", stars: 4, conviction: "⭐⭐⭐⭐", note: "Deeply undervalued at 10.5x forward P/E. Bank of America high conviction Q1 2026 pick.", priority: "📋 Value Add", color: "#059669", why: "Keytruda projected at $7.6B in sales by 2030. 3%+ dividend. Trades at just 10.5x forward P/E — remarkably cheap for this quality of business." },
];

const rulesOfEngagement = [
  { rule: "🎯 Always Use Limit Orders", detail: "Never use market orders on Webull. Set the exact price you're willing to pay before executing. Especially critical for higher-priced names like MCK, AVGO, and CEG where a $5–10 price swing on a fractional share matters." },
  { rule: "📅 Review Quarterly — Non-Negotiable", detail: "Mid-Feb, Mid-May, Mid-Aug, Mid-Nov. Align with earnings season. Put it in both calendars right now as a recurring event. Treat it like a bill — it doesn't move." },
  { rule: "🧠 Know Your Thesis Before You Buy", detail: "You must be able to explain why you own each position in 2 sentences. If you can't, you don't know it well enough to own it. This protects you from panic selling — when NVDA drops 20% you need to know WHY you bought it." },
  { rule: "📉 Volatility Is Not Your Enemy", detail: "NVDA, AVGO, and MSFT will have 15–25% drawdown days. That is completely normal for growth stocks. Your thesis is 3–5 years, not 3–5 weeks. Zoom out. A temporary drop in a fundamentally strong business is an opportunity, not a disaster." },
  { rule: "📊 Beat Your Benchmark", detail: "Your benchmark is VTI total return. At every quarterly review, compare each individual stock against what VTI returned over the same period. If your stocks consistently underperform VTI for 12+ months, that's your signal to reconsider." },
  { rule: "💵 Add Capital Consistently", detail: "Next additions in order: SCHD → GEV (if pulls back to $700–750) → LLY → GOOGL. Write this order down. Don't deviate unless a fundamental thesis change justifies it. Chasing momentum = how retail investors get hurt." },
  { rule: "🤝 Both Must Agree Before Executing", detail: "Any buy/sell/hold decision requires both of you to agree before executing on Webull. If you disagree, the default answer is HOLD and revisit at next quarterly review." },
  { rule: "📓 Keep An Investment Journal", detail: "After every quarterly review, write down: what you decided, why, and what the macro environment looks like. Looking back 12 months from now will make you dramatically better investors." },
  { rule: "📱 Paper Trade Before Every Swing Trade", detail: "Use Webull's built-in paper trading simulator for a minimum of 60 days before any real swing trade. Target: win rate above 50% AND average win larger than average loss before going live." },
  { rule: "⚖️ Watch Concentration", detail: "If any single stock appreciates to 30–35%+ of your total portfolio, consider trimming and redistributing. Concentration risk is real — if NVDA doubles it could become 40%+ of your portfolio." },
  { rule: "🔍 Do Your Own DD Every Time", detail: "Before adding to any position or adding a watchlist name, run through the 6-step smell test in the Due Diligence tab. Use Stockanalysis.com, Macrotrends.net, Finviz.com, and Stockcharts.com RRG. No shortcuts." },
  { rule: "🚫 No FOMO Trades Ever", detail: "If you missed a move, you missed it. There will ALWAYS be another opportunity. Chasing a stock after it already ran 30% is one of the most common and costly retail investor mistakes." },
];

const quarterlyChecklist = [
  { phase: "📋 Before The Review", items: ["Pull up this tracker and note current prices vs when you bought", "Read the last quarterly journal entry you wrote together", "Each person reviews the portfolio independently BEFORE discussing", "Write down your current conviction level (1–10) for each position", "Note any macro news since last quarter (Fed decisions, GDP, inflation)"] },
  { phase: "📊 During The Review", items: ["Compare each position's performance vs VTI (your benchmark)", "For each stock: has the original thesis changed? Yes/No and why", "Check analyst target updates on Finviz or Stockanalysis.com", "Check Stockcharts.com RRG — are your sectors still leading?", "Review Earnings Whispers for upcoming earnings in next 30 days", "Evaluate any watchlist names — have entry points improved?", "Discuss how much new capital you're adding this quarter"] },
  { phase: "💡 Decisions To Make", items: ["Hold / Add / Trim / Exit for each position — both must agree", "Which watchlist name (if any) do you add this quarter?", "How much capital goes to existing positions vs new positions?", "Does any position exceed 30–35% of portfolio? If so, trim.", "Are you still comfortable with 70/30 stock/ETF split?"] },
  { phase: "📓 After The Review", items: ["Write in your investment journal: decisions made and WHY", "Document the macro environment as of this review", "Set price alerts on Webull for watchlist targets (e.g. GEV at $700)", "Schedule next quarterly review date on both calendars", "Update this tracker with any new prices or thesis changes"] },
];

const swingTradingGuide = [
  { concept: "📊 Support & Resistance", detail: "Support = a price level where a stock has historically bounced upward. Resistance = a level where it has historically stalled or reversed. Buy near support, take profits near resistance. The more times a level has held, the stronger it is.", tip: "Draw horizontal lines on TradingView at obvious price levels where the stock repeatedly reversed. These become your buy and sell zones." },
  { concept: "📈 Moving Averages (50MA & 200MA)", detail: "50-day MA and 200-day MA are the two most watched levels by institutional investors. When price is above both = bullish. Below both = bearish. Use as dynamic support/resistance levels.", tip: "The Golden Cross (50MA crosses above 200MA) is a bullish signal. The Death Cross (50MA crosses below 200MA) is bearish. Widely watched and often self-fulfilling." },
  { concept: "⚡ RSI — Relative Strength Index", detail: "Measures momentum on a 0–100 scale. Above 70 = overbought, possible pullback. Below 30 = oversold, possible bounce. Most useful in range-bound markets.", tip: "Don't use RSI alone — it can stay overbought for weeks in a strong uptrend. Combine with support/resistance and volume for confirmation." },
  { concept: "🌊 MACD", detail: "Shows when momentum is strengthening or weakening. MACD line crosses above signal line = bullish momentum. Crosses below = bearish. Histogram shows the strength of the crossover.", tip: "MACD divergence is powerful — when price makes a new high but MACD doesn't, the move is losing steam. This often precedes a reversal." },
  { concept: "📦 Volume Confirmation", detail: "A breakout on HIGH volume = institutional conviction — the move is real. A breakout on LOW volume = likely a false move that will reverse. Always check volume before acting on a breakout.", tip: "A valid breakout should show at least 1.5–2x the average daily volume. Anything less is suspect." },
  { concept: "🕯️ Candlestick Patterns", detail: "Key patterns: Doji (indecision), Hammer (bullish reversal at support), Shooting Star (bearish reversal at resistance), Engulfing (strong reversal signal). Context matters — a hammer at support is powerful.", tip: "Learn just 3 patterns really well rather than 50 poorly. Hammer, Engulfing, and Doji at key levels will serve you well starting out." },
  { concept: "📋 Paper Trade First — No Exceptions", detail: "Use Webull's built-in paper trading simulator for a minimum of 60 days before committing real money to any swing trade. Track your wins AND losses. Calculate your win rate and average win/loss ratio.", tip: "Target: win rate above 50% AND average win larger than average loss before going live. If you can achieve both, your strategy has edge." },
];

const sectorRotation = [
  { sector: "⚡ Industrials", status: "🟢 Leading", ytd: "+16%", why: "AI data center construction, domestic manufacturing reshoring, defense spending surge. GE Vernova at all time highs.", ourExposure: "Indirect via VTI. GEV on watchlist." },
  { sector: "☢️ Energy (Nuclear)", status: "🟢 Leading", ytd: "CEG -24% YTD but fundamentals intact", why: "AI data center power demand creating multi-decade nuclear renaissance. Big Tech signing 20-year PPAs. Policy headline created buying opportunity.", ourExposure: "CEG — direct position at 12% allocation" },
  { sector: "💻 Semiconductors", status: "🟡 Rotating", ytd: "Mixed — NVDA volatile, AVGO strong", why: "DeepSeek shock created temporary volatility but AI infrastructure thesis intact long term. Custom chip demand from hyperscalers accelerating.", ourExposure: "NVDA (20%) + AVGO (16%) — largest combined exposure" },
  { sector: "☁️ Enterprise Software", status: "🟢 Leading", ytd: "MSFT recovering", why: "Copilot monetization starting to show in earnings. Azure growing 39% YoY. AI becoming embedded in enterprise workflows at scale.", ourExposure: "MSFT — direct position at 15% allocation" },
  { sector: "🏥 Healthcare", status: "🟢 Outperform", ytd: "Sector rated Outperform 6–12 months", why: "Aging population, GLP-1 drug demand, pharma distribution secular growth.", ourExposure: "MCK — direct position at 7% allocation" },
  { sector: "🌍 International", status: "🟢 Leading", ytd: "Outperforming U.S. in 2026", why: "Non-US equities leading in early 2026 rotation. USD weakness, Europe recovery, emerging market growth all contributing.", ourExposure: "VXUS — direct position at 13% allocation" },
  { sector: "📱 Consumer Discretionary", status: "🔴 Lagging", ytd: "Underperforming", why: "Consumer stress among lower-income households. Schwab rates Underperform. Discretionary spending being cut first when budgets tighten.", ourExposure: "None — intentionally avoided" },
  { sector: "🏠 Real Estate", status: "🔴 Lagging", ytd: "Underperforming", why: "High interest rates still suppressing real estate valuations. Office market structurally challenged post-COVID.", ourExposure: "None — intentionally avoided" },
];

const resources = [
  { name: "Stockanalysis.com", use: "Free income statements, balance sheets, cash flow for any ticker", url: "https://stockanalysis.com", color: "#3b82f6" },
  { name: "Macrotrends.net", use: "Historical financials going back decades — P/E, margins, revenue, EPS, ROE", url: "https://macrotrends.net", color: "#10b981" },
  { name: "Finviz.com", use: "Stock screener — filter by P/E, revenue growth, sector, market cap, analyst targets", url: "https://finviz.com", color: "#f59e0b" },
  { name: "Stockcharts.com", use: "Relative Rotation Graphs (RRG) — see which sectors are leading vs lagging in real time", url: "https://stockcharts.com", color: "#8b5cf6" },
  { name: "EarningsWhispers.com", use: "Earnings dates and whisper numbers — what market actually expects vs official estimate", url: "https://earningswhispers.com", color: "#ef4444" },
  { name: "Simply Wall St", use: "Visual breakdown of valuation, growth, financial health, and dividends", url: "https://simplywall.st", color: "#ec4899" },
  { name: "TradingView", use: "Best charting platform for learning TA and paper trading swing trades", url: "https://tradingview.com", color: "#1abc9c" },
  { name: "SEC EDGAR", use: "Official company filings — 10-K, 10-Q, risk factors, insider activity", url: "https://sec.gov/edgar", color: "#6366f1" },
];

const TABS = ["💼 Portfolio", "📊 My P&L", "📐 Metrics", "🔍 Due Diligence", "📈 Swing Trading", "🌍 Sector Rotation", "📋 Rules", "📅 Quarterly Review", "📚 Resources", "⭐ Watchlist"];

const dueDiligenceItems = [
  { category: "📊 Valuation Metrics", color: "#3b82f6", metrics: [{ name: "Forward P/E", good: "Under 15x = cheap (ask why). 15–25x = fair value. 25–40x = growth premium. 40x+ = must execute perfectly.", tip: "Always compare to sector average, not the whole market. A 40x P/E for a semiconductor growing 60% YoY is reasonable." }, { name: "PEG Ratio", good: "Under 1.0 = undervalued vs growth. 1–2 = fairly valued. Above 2 = expensive relative to growth rate.", tip: "Best metric for growth stocks. P/E ÷ earnings growth rate. AVGO's PEG of ~0.85 is why we own it despite high P/E." }, { name: "EV/EBITDA", good: "Under 10x = value. 10–15x = fair. 15–20x = premium. 20x+ = needs strong growth to justify.", tip: "Better than P/E for companies with different debt levels. Most useful for CEG, MCK, and AVGO." }] },
  { category: "📈 Growth Metrics", color: "#10b981", metrics: [{ name: "Revenue Growth (YoY)", good: "Under 5% = slow/mature. 5–10% = steady. 10–20% = solid. 20–40% = strong. 40%+ = exceptional.", tip: "Is it accelerating or decelerating? Decelerating growth is often more concerning than slow growth." }, { name: "EPS Growth", good: "Negative = red flag. 0–10% = slow. 10–20% = solid. 20%+ = strong growth territory.", tip: "Make sure it's from real business growth, NOT just share buybacks. Check revenue is growing alongside EPS." }, { name: "Free Cash Flow (FCF)", good: "Positive and growing = healthy. Negative but revenue growing fast = acceptable early stage. Both negative = avoid.", tip: "The single most important number. Growing FCF means the company funds its own future. MSFT at $70B+ FCF is exceptional." }] },
  { category: "💪 Quality & Health", color: "#8b5cf6", metrics: [{ name: "Gross Margin", good: "Under 20% = low margin (normal for distributors like MCK). 20–40% = solid. 40–60% = strong. 60%+ = exceptional.", tip: "MCK's 5–6% gross margin looks terrible until you realize that's normal for pharmaceutical distribution. Always compare to peers." }, { name: "Operating Margin", good: "Under 5% = thin. 5–15% = acceptable. 15–25% = strong. 25%+ = exceptional moat.", tip: "Expanding margins year over year = management executing well and gaining pricing power." }, { name: "Return on Equity (ROE)", good: "Under 10% = below average. 10–15% = average. 15–20% = good. 20%+ = excellent moat signal.", tip: "Warren Buffett's favorite metric. MCK's 80%+ ROE looks wild but is common for asset-light distribution businesses." }, { name: "Debt-to-Equity", good: "Under 0.5x = conservative. 0.5–1.5x = manageable. 1.5–3x = elevated. Above 3x = high risk.", tip: "AVGO is at 1.8x due to the VMware acquisition — elevated but acceptable given the FCF it generates to pay it down." }] },
  { category: "🔍 The 6-Step Smell Test", color: "#f59e0b", metrics: [{ name: "Step 1 — Is it growing?", good: "Check revenue growth and EPS growth YoY. Is it accelerating or decelerating?", tip: "Decelerating growth even at high levels is a yellow flag worth monitoring every quarter." }, { name: "Step 2 — Is it fairly priced?", good: "Check Forward P/E and PEG. High P/E is ok IF PEG is under 2.0.", tip: "Compare to sector peers, not the overall market." }, { name: "Step 3 — Is the business healthy?", good: "FCF positive and growing? Margins stable or expanding? Debt manageable?", tip: "All three should ideally be yes before buying. Two red flags = concern. Three = pass." }, { name: "Step 4 — Is management good?", good: "ROE consistently above 15% over 3–5 years = good management using capital efficiently.", tip: "Check Macrotrends.net for 10-year ROE history. Consistent is better than spiky." }, { name: "Step 5 — What could go wrong?", good: "Read the Risk Factors section of the most recent 10-K filing on SEC.gov.", tip: "Companies are legally required to disclose their biggest vulnerabilities here. Most underused tool by retail investors." }, { name: "Step 6 — Sector context?", good: "Is this sector in the leading or lagging rotation? Check Stockcharts.com RRG before every new position.", tip: "Even a great company in a lagging sector can underperform for a year or more." }] },
];

function ConvictionBar({ score }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", fontWeight: "700", letterSpacing: "1px" }}>CONVICTION</span>
        <span style={{ fontSize: "12px", fontWeight: "800", color: "white" }}>{score}/10</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", height: "6px", overflow: "hidden" }}>
        <div style={{ width: `${(score / 10) * 100}%`, height: "100%", background: "white", borderRadius: "100px", transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function AllocationBar({ pct }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", fontWeight: "700", letterSpacing: "1px" }}>ALLOCATION</span>
        <span style={{ fontSize: "12px", fontWeight: "800", color: "white" }}>{pct}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", height: "6px", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct * 4.5, 100)}%`, height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: "100px", transition: "width 0.8s ease" }} />
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
  const [countdown, setCountdown] = useState(15);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [positions, setPositions] = useState(DEFAULT_POSITIONS);
  const [positionsLocked, setPositionsLocked] = useState(false);
  const [editingPositions, setEditingPositions] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    setGreeting(`${timeGreet}, ${name}! 💖`);
    const t = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const fetchLiveData = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    try {
      // Calls our own Vercel serverless function — server-to-server, no CORS
      const symbols = TICKERS.join(",");
      const res = await fetch(`/api/quote?symbols=${symbols}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const mapped = {};
        json.forEach(q => {
          if (q && q.symbol) {
            mapped[q.symbol] = {
              price: q.price != null ? Number(q.price).toFixed(2) : null,
              change: q.change != null ? Number(q.change).toFixed(2) : null,
              changePct: q.changesPercentage != null ? Number(q.changesPercentage).toFixed(2) : null,
              dayHigh: q.dayHigh != null ? Number(q.dayHigh).toFixed(2) : null,
              dayLow: q.dayLow != null ? Number(q.dayLow).toFixed(2) : null,
              marketCap: q.marketCap,
              volume: q.volume,
            };
          }
        });
        if (Object.keys(mapped).length > 0) {
          setLiveData(mapped);
          setLastUpdated(new Date().toLocaleTimeString());
        } else { setApiError(true); }
      } else { setApiError(true); }
    } catch (err) {
      console.error("Quote fetch error:", err);
      setApiError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);

  // Auto-refresh every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => { fetchLiveData(); setCountdown(15); }, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  // Countdown timer
  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 15), 1000);
    return () => clearInterval(tick);
  }, []);

  const data = staticData[selected];
  const live = liveData[selected];

  const calcUpside = (ticker) => {
    const ld = liveData[ticker];
    const target = staticData[ticker].analystTarget;
    if (!ld?.price || !target) return null;
    return ((target - parseFloat(ld.price)) / parseFloat(ld.price) * 100).toFixed(1);
  };

  const calcPnL = (ticker) => {
    const pos = positions[ticker];
    const ld = liveData[ticker];
    if (!pos?.avgCost || !pos?.shares || !ld?.price) return null;
    const cost = parseFloat(pos.avgCost);
    const shares = parseFloat(pos.shares);
    const currentPrice = parseFloat(ld.price);
    if (isNaN(cost) || isNaN(shares) || isNaN(currentPrice)) return null;
    const costBasis = cost * shares;
    const currentValue = currentPrice * shares;
    const pnl = currentValue - costBasis;
    const pnlPct = ((currentValue - costBasis) / costBasis) * 100;
    return { costBasis, currentValue, pnl, pnlPct };
  };

  const totalPortfolioStats = () => {
    let totalCost = 0, totalValue = 0, positionCount = 0;
    TICKERS.forEach(ticker => {
      const pnl = calcPnL(ticker);
      if (pnl) { totalCost += pnl.costBasis; totalValue += pnl.currentValue; positionCount++; }
    });
    return { totalCost, totalValue, totalPnL: totalValue - totalCost, totalPnLPct: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0, positionCount };
  };

  const fmtMktCap = (n) => {
    if (!n) return "N/A";
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    return `$${n}`;
  };

  const totals = totalPortfolioStats();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 50%, #fdf0ff 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: "48px" }}>

      {showGreeting && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "linear-gradient(135deg, #667eea, #f093fb)", color: "white", padding: "14px 28px", borderRadius: "100px", fontSize: "15px", fontWeight: "700", boxShadow: "0 8px 32px rgba(102,126,234,0.4)", whiteSpace: "nowrap", animation: "fadeInDown 0.5s ease" }}>
          {greeting}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateX(-50%) translateY(-20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .tabs::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", padding: "28px 20px 24px", textAlign: "center", color: "white" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", opacity: 0.85, marginBottom: "6px", textTransform: "uppercase" }}>Joint Brokerage Portfolio</div>
        <h1 style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: "900", margin: "0 0 14px" }}>Our Investment Hub 💰</h1>

        {/* Live Status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "14px" }}>
          {loading ? <div style={{ width: "10px", height: "10px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> : <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: apiError ? "#fbbf24" : "#4ade80", boxShadow: apiError ? "0 0 6px #fbbf24" : "0 0 6px #4ade80" }} />}
          <span style={{ fontSize: "11px", opacity: 0.85, fontWeight: "600" }}>{loading ? "Fetching live data..." : apiError ? "Using reference data" : `Live prices • Updated ${lastUpdated} • Refreshes in ${countdown}s`}</span>
          <button onClick={fetchLiveData} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>↻</button>
        </div>

        {/* Summary Pills — CORRECTED 30/70 */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "7px", marginBottom: "16px" }}>
          {[{ label: "Capital", value: "$1,129.59" }, { label: "Positions", value: "7" }, { label: "Stocks", value: "70%" }, { label: "ETFs", value: "30% ✅" }, { label: "Yield", value: "~1%" }, { label: "Review", value: "Quarterly" }].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: "100px", padding: "5px 12px", fontSize: "11px", fontWeight: "600" }}>
              <span style={{ opacity: 0.8 }}>{item.label}: </span><span style={{ fontWeight: "800" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Rainbow Bar */}
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "0 10px" }}>
          <div style={{ display: "flex", borderRadius: "100px", overflow: "hidden", height: "14px", gap: "2px" }}>
            {Object.entries(staticData).map(([ticker, d]) => (
              <div key={ticker} onClick={() => { setSelected(ticker); setActiveTab(0); }} title={`${ticker}: ${d.allocation}%`} style={{ flex: d.allocation, background: d.gradient, cursor: "pointer", opacity: selected === ticker ? 1 : 0.6, transform: selected === ticker ? "scaleY(1.2)" : "none", transition: "all 0.3s ease" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {Object.entries(staticData).map(([ticker]) => (
              <div key={ticker} onClick={() => { setSelected(ticker); setActiveTab(0); }} style={{ fontSize: "9px", fontWeight: "800", opacity: selected === ticker ? 1 : 0.55, cursor: "pointer" }}>{ticker}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: "flex", overflowX: "auto", background: "white", borderBottom: "2px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", scrollbarWidth: "none" }}>
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: "14px 4px", border: "none", background: activeTab === i ? "linear-gradient(180deg, #f5f3ff 0%, white 100%)" : "none", color: activeTab === i ? "#667eea" : "#aaa", fontWeight: activeTab === i ? "800" : "500", fontSize: "12.5px", cursor: "pointer", borderBottom: activeTab === i ? "3px solid #667eea" : "3px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s ease", textAlign: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", letterSpacing: activeTab === i ? "-0.2px" : "0" }}>{tab}</button>
        ))}
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px 16px 0" }}>

        {/* ── TAB 0: PORTFOLIO ── */}
        {activeTab === 0 && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px", justifyContent: "center" }}>
              {Object.keys(staticData).map((ticker) => {
                const isSelected = selected === ticker;
                const ld = liveData[ticker];
                const isUp = ld && parseFloat(ld.changePct) >= 0;
                return (
                  <button key={ticker} onClick={() => setSelected(ticker)} style={{ padding: "9px 15px", borderRadius: "100px", border: "none", background: isSelected ? staticData[ticker].gradient : "white", color: isSelected ? "white" : "#555", fontWeight: "700", fontSize: "12px", cursor: "pointer", boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)", transform: isSelected ? "translateY(-2px)" : "none", transition: "all 0.2s ease" }}>
                    <div>{staticData[ticker].emoji} {ticker}</div>
                    {ld && <div style={{ fontSize: "10px", opacity: 0.85, marginTop: "1px", color: isSelected ? "white" : (isUp ? "#10b981" : "#ef4444") }}>{isUp ? "▲" : "▼"}{Math.abs(parseFloat(ld.changePct))}%</div>}
                  </button>
                );
              })}
            </div>

            <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.1)", background: "white" }}>
              <div style={{ background: data.gradient, padding: "22px 20px 18px", color: "white", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", position: "relative" }}>
                  <div>
                    <div style={{ fontSize: "38px", fontWeight: "900", lineHeight: 1 }}>{data.emoji} {selected}</div>
                    <div style={{ fontSize: "13px", opacity: 0.9, marginTop: "4px" }}>{data.company}</div>
                    <div style={{ display: "inline-block", marginTop: "8px", background: "rgba(255,255,255,0.25)", borderRadius: "100px", padding: "3px 12px", fontSize: "11px", fontWeight: "600" }}>{data.tag}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "30px", fontWeight: "900", lineHeight: 1 }}>{data.allocation}%</div>
                    <div style={{ fontSize: "11px", opacity: 0.75, marginTop: "2px" }}>of portfolio</div>
                    <div style={{ fontSize: "15px", fontWeight: "700", marginTop: "5px" }}>{data.dollarAmount}</div>
                  </div>
                </div>
                <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <ConvictionBar score={data.convictionScore} />
                  <AllocationBar pct={data.allocation} />
                </div>
              </div>

              {/* Price Row */}
              <div style={{ background: data.light, padding: "14px 18px", borderBottom: "1px solid #f0f0f0" }}>
                {live ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center" }}>
                    {[{ label: "Live Price", val: `$${live.price}`, color: "#333" }, { label: "Today", val: `${parseFloat(live.changePct) >= 0 ? "▲" : "▼"}${Math.abs(parseFloat(live.changePct))}%`, color: parseFloat(live.changePct) >= 0 ? "#10b981" : "#ef4444" }, { label: "Market Cap", val: fmtMktCap(live.marketCap), color: "#555" }, { label: "To Target", val: calcUpside(selected) ? `${calcUpside(selected)}%` : "N/A", color: "#6366f1" }].map((s, i) => (
                      <div key={i} style={{ borderRight: i < 3 ? "1px solid #e8e8e8" : "none" }}>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: "9px", color: "#bbb", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", fontSize: "13px", color: "#888" }}>Loading live price...</div>
                )}
              </div>

              {/* Collapsible Groups */}
              <div style={{ padding: "12px" }}>
                {fieldGroups.map((group, gi) => {
                  const isOpen = openGroups[gi];
                  return (
                    <div key={gi} style={{ marginBottom: "8px" }}>
                      <button onClick={() => setOpenGroups(p => ({ ...p, [gi]: !p[gi] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "12px", border: "none", background: isOpen ? group.color : group.bg, color: isOpen ? "white" : "#444", fontWeight: "700", fontSize: "13px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: isOpen ? `0 4px 16px ${group.color}40` : "none" }}>
                        <span>{group.groupLabel}</span>
                        <span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7 }}>▼</span>
                      </button>
                      {isOpen && (
                        <div style={{ background: "#fafafa", borderRadius: "0 0 12px 12px", overflow: "hidden", border: `2px solid ${group.color}25`, borderTop: "none", marginTop: "-4px" }}>
                          {group.fields.map((field, fi) => (
                            <div key={field.key} style={{ display: "grid", gridTemplateColumns: "130px 1fr", borderBottom: fi < group.fields.length - 1 ? "1px solid #f0f0f0" : "none", background: fi % 2 === 0 ? "white" : "#fafafa" }}>
                              <div style={{ padding: "11px 14px", fontSize: "10px", fontWeight: "700", color: group.color, letterSpacing: "0.5px", textTransform: "uppercase", borderRight: `3px solid ${group.color}20`, paddingTop: "13px" }}>{field.label}</div>
                              <div style={{ padding: "11px 14px", fontSize: "13px", color: "#444", lineHeight: "1.6" }}>{field.key === "allocation" ? `${data[field.key]}%` : data[field.key]}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ textAlign: "center", padding: "4px 16px 16px", fontSize: "11px", color: "#bbb" }}>👆 Tap any section to expand</div>
            </div>
          </div>
        )}

        {/* ── TAB 1: MY P&L ── */}
        {activeTab === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>My Portfolio P&L</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Enter your actual positions to track real gains & losses</p>
            </div>

            {/* Total Portfolio Summary */}
            {totals.positionCount > 0 && (
              <div style={{ background: totals.totalPnL >= 0 ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "linear-gradient(135deg, #fee2e2, #fecaca)", borderRadius: "20px", padding: "18px 20px", marginBottom: "16px", border: `2px solid ${totals.totalPnL >= 0 ? "#10b981" : "#ef4444"}40` }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: totals.totalPnL >= 0 ? "#065f46" : "#991b1b", marginBottom: "8px" }}>Total Portfolio P&L ({totals.positionCount} positions entered)</div>
                  <div style={{ fontSize: "32px", fontWeight: "900", color: totals.totalPnL >= 0 ? "#10b981" : "#ef4444" }}>{totals.totalPnL >= 0 ? "+" : ""}${totals.totalPnL.toFixed(2)}</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: totals.totalPnL >= 0 ? "#059669" : "#dc2626", marginTop: "4px" }}>{totals.totalPnL >= 0 ? "▲" : "▼"} {Math.abs(totals.totalPnLPct).toFixed(2)}%</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                    <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "12px", padding: "10px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#333" }}>${totals.totalCost.toFixed(2)}</div>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>Cost Basis</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "12px", padding: "10px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#333" }}>${totals.totalValue.toFixed(2)}</div>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>Current Value</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Position Entry */}
            <div style={{ background: "white", borderRadius: "20px", padding: "18px 20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ fontWeight: "800", fontSize: "15px", color: "#333" }}>📝 Enter Your Positions</div>
                <button onClick={() => setEditingPositions(!editingPositions)} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "100px", padding: "6px 16px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                  {editingPositions ? "✅ Done" : "✏️ Edit"}
                </button>
              </div>

              {editingPositions && (
                <div style={{ background: "#f0f4ff", borderRadius: "12px", padding: "12px 14px", marginBottom: "14px", fontSize: "12px", color: "#4338ca", lineHeight: "1.6" }}>
                  💡 Enter your average cost per share and how many shares you own. Live prices will calculate your real P&L automatically. You only need to update this when you add new shares.
                </div>
              )}

              <div style={{ display: "grid", gap: "10px" }}>
                {TICKERS.map((ticker) => {
                  const d = staticData[ticker];
                  const ld = liveData[ticker];
                  const pnl = calcPnL(ticker);
                  const pos = positions[ticker];
                  return (
                    <div key={ticker} style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
                      <div style={{ background: d.gradient, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: "white", fontWeight: "800", fontSize: "14px" }}>{d.emoji} {ticker}</div>
                        <div style={{ color: "white", fontSize: "12px", opacity: 0.9 }}>{ld ? `Live: $${ld.price}` : "Loading..."}</div>
                      </div>
                      {editingPositions ? (
                        <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "white" }}>
                          <div>
                            <label style={{ fontSize: "10px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Avg Cost/Share ($)</label>
                            <input type="number" placeholder="e.g. 189.50" value={pos.avgCost} onChange={e => setPositions(p => ({ ...p, [ticker]: { ...p[ticker], avgCost: e.target.value } }))}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #e0e0e0", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                          </div>
                          <div>
                            <label style={{ fontSize: "10px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Shares Owned</label>
                            <input type="number" placeholder="e.g. 1.31" value={pos.shares} onChange={e => setPositions(p => ({ ...p, [ticker]: { ...p[ticker], shares: e.target.value } }))}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #e0e0e0", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: "10px 14px", background: "white" }}>
                          {pnl ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center" }}>
                              {[{ label: "Cost Basis", val: `$${pnl.costBasis.toFixed(2)}`, color: "#555" }, { label: "Current Value", val: `$${pnl.currentValue.toFixed(2)}`, color: "#333" }, { label: "P&L $", val: `${pnl.pnl >= 0 ? "+" : ""}$${pnl.pnl.toFixed(2)}`, color: pnl.pnl >= 0 ? "#10b981" : "#ef4444" }, { label: "P&L %", val: `${pnl.pnlPct >= 0 ? "▲" : "▼"}${Math.abs(pnl.pnlPct).toFixed(2)}%`, color: pnl.pnlPct >= 0 ? "#10b981" : "#ef4444" }].map((s, i) => (
                                <div key={i} style={{ borderRight: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                                  <div style={{ fontSize: "13px", fontWeight: "800", color: s.color }}>{s.val}</div>
                                  <div style={{ fontSize: "9px", color: "#ccc", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{s.label}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center", fontSize: "12px", color: "#bbb", padding: "4px 0" }}>
                              {pos.avgCost && pos.shares ? "Waiting for live price..." : "Tap Edit to enter your position →"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: METRICS ── */}
        {activeTab === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Stock Metrics</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Key metrics applied to your actual 7 positions</p>
            </div>
            {Object.entries(staticData).map(([ticker, d]) => {
              const ld = liveData[ticker];
              const upside = calcUpside(ticker);
              return (
                <div key={ticker} style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "12px" }}>
                  <div style={{ background: d.gradient, padding: "14px 18px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "900", fontSize: "18px" }}>{d.emoji} {ticker}</div>
                      <div style={{ fontSize: "11px", opacity: 0.85 }}>{d.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: "800" }}>{ld ? `$${ld.price}` : "Loading..."}</div>
                      {ld && <div style={{ fontSize: "11px", opacity: 0.9 }}>{parseFloat(ld.changePct) >= 0 ? "▲" : "▼"}{Math.abs(parseFloat(ld.changePct))}% today</div>}
                      {upside && <div style={{ fontSize: "11px", opacity: 0.9 }}>{upside}% to target</div>}
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[{ label: "Fwd P/E", val: d.peRatio }, { label: "PEG", val: d.pegRatio }, { label: "EV/EBITDA", val: d.evEbitda }, { label: "Gross Margin", val: d.grossMargin }, { label: "Op. Margin", val: d.operatingMargin }, { label: "ROE", val: d.roe }].map((m, i) => (
                        <div key={i} style={{ background: "#f8f8f8", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                          <div style={{ fontSize: "13px", fontWeight: "800", color: "#333" }}>{m.val}</div>
                          <div style={{ fontSize: "9px", color: "#aaa", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                      {[{ label: "Debt/Equity", val: d.debtEquity }, { label: "Revenue Growth", val: d.revenueGrowth }].map((m, i) => (
                        <div key={i} style={{ background: "#f8f8f8", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                          <div style={{ fontSize: "13px", fontWeight: "800", color: "#333" }}>{m.val}</div>
                          <div style={{ fontSize: "9px", color: "#aaa", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: "8px", background: "#f0f9ff", borderRadius: "10px", padding: "10px 12px" }}>
                      <div style={{ fontSize: "9px", color: "#0891b2", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Free Cash Flow</div>
                      <div style={{ fontSize: "13px", color: "#444", fontWeight: "600" }}>{d.fcf}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 3: DUE DILIGENCE ── */}
        {activeTab === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Due Diligence Guide</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>What to look for when researching any stock</p>
            </div>
            {dueDiligenceItems.map((cat, ci) => {
              const isOpen = openDD[ci];
              return (
                <div key={ci} style={{ marginBottom: "12px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <button onClick={() => setOpenDD(p => ({ ...p, [ci]: !p[ci] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", border: "none", background: isOpen ? cat.color : "white", color: isOpen ? "white" : "#333", fontWeight: "800", fontSize: "14px", cursor: "pointer", transition: "all 0.2s ease" }}>
                    <span>{cat.category}</span><span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{ background: "white" }}>
                      {cat.metrics.map((metric, mi) => (
                        <div key={mi} style={{ padding: "16px 20px", borderTop: "1px solid #f5f5f5" }}>
                          <div style={{ fontWeight: "700", fontSize: "14px", color: cat.color, marginBottom: "6px" }}>{metric.name}</div>
                          <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.6", marginBottom: "8px" }}>{metric.good}</div>
                          <div style={{ display: "flex", gap: "8px", background: `${cat.color}10`, borderRadius: "8px", padding: "8px 12px" }}>
                            <span>💡</span><span style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>{metric.tip}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 4: SWING TRADING ── */}
        {activeTab === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Swing Trading Prep</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Master these before touching real money</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderRadius: "16px", padding: "14px 18px", marginBottom: "14px", border: "2px solid #f59e0b40" }}>
              <div style={{ fontWeight: "800", fontSize: "14px", color: "#92400e", marginBottom: "5px" }}>⚠️ The Golden Rule</div>
              <div style={{ fontSize: "13px", color: "#78350f", lineHeight: "1.6" }}>Paper trade on Webull for a minimum of <strong>60 days</strong> before ANY real swing trades. Target: win rate above 50% AND average win larger than average loss. Both conditions must be met.</div>
            </div>
            {swingTradingGuide.map((item, i) => {
              const isOpen = openSwing[i];
              return (
                <div key={i} style={{ marginBottom: "10px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", background: "white" }}>
                  <button onClick={() => setOpenSwing(p => ({ ...p, [i]: !p[i] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: isOpen ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: isOpen ? "white" : "#333", fontWeight: "700", fontSize: "13.5px", cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" }}>
                    <span>{item.concept}</span><span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7, flexShrink: 0, marginLeft: "10px" }}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "14px 18px", borderTop: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: "13.5px", color: "#444", lineHeight: "1.7", marginBottom: "10px" }}>{item.detail}</div>
                      <div style={{ display: "flex", gap: "8px", background: "#f0f9ff", borderRadius: "10px", padding: "10px 12px" }}>
                        <span>💡</span><span style={{ fontSize: "12.5px", color: "#0369a1", lineHeight: "1.6" }}>{item.tip}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 5: SECTOR ROTATION ── */}
        {activeTab === 5 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sector Rotation</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Current market rotation as of February 2026</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #eff6ff, #e0f2fe)", borderRadius: "16px", padding: "14px 18px", marginBottom: "14px", border: "2px solid #3b82f640" }}>
              <div style={{ fontWeight: "800", fontSize: "14px", color: "#1e40af", marginBottom: "5px" }}>📡 Macro Context</div>
              <div style={{ fontSize: "13px", color: "#1e3a8a", lineHeight: "1.6" }}>GDP tracking at <strong>3.1% annualized</strong> for Q1 2026. Money rotating from pure tech into industrials, energy infrastructure, and defensives. AI energy demand is the dominant 2026 macro theme.</div>
            </div>
            {sectorRotation.map((s, i) => (
              <div key={i} style={{ marginBottom: "10px", background: "white", borderRadius: "16px", padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: `5px solid ${s.status.includes("🟢") ? "#10b981" : s.status.includes("🟡") ? "#f59e0b" : "#ef4444"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                  <div style={{ fontWeight: "800", fontSize: "14px", color: "#333" }}>{s.sector}</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ background: s.status.includes("🟢") ? "#d1fae5" : s.status.includes("🟡") ? "#fef3c7" : "#fee2e2", color: s.status.includes("🟢") ? "#065f46" : s.status.includes("🟡") ? "#92400e" : "#991b1b", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", fontWeight: "700" }}>{s.status}</span>
                  </div>
                </div>
                <div style={{ fontSize: "12.5px", color: "#555", lineHeight: "1.6", marginBottom: "8px" }}>{s.why}</div>
                <div style={{ background: "#f8f8f8", borderRadius: "8px", padding: "7px 12px", fontSize: "12px", color: "#666" }}>
                  <strong style={{ color: "#667eea" }}>Our Exposure:</strong> {s.ourExposure}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 6: RULES ── */}
        {activeTab === 6 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rules of Engagement</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>The non-negotiables for building wealth together</p>
            </div>
            {rulesOfEngagement.map((item, i) => (
              <div key={i} style={{ marginBottom: "10px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", background: "white" }}>
                <button onClick={() => setOpenRule(openRule === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: openRule === i ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: openRule === i ? "white" : "#333", fontWeight: "700", fontSize: "13.5px", cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" }}>
                  <span>{item.rule}</span><span style={{ transform: openRule === i ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7, flexShrink: 0, marginLeft: "10px" }}>▼</span>
                </button>
                {openRule === i && <div style={{ padding: "14px 18px 16px", borderTop: "1px solid #f0f0f0", fontSize: "13.5px", color: "#555", lineHeight: "1.7" }}>{item.detail}</div>}
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 7: QUARTERLY REVIEW ── */}
        {activeTab === 7 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Quarterly Review</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Your step-by-step process — every quarter, non-negotiable</p>
            </div>
            <div style={{ background: "white", borderRadius: "20px", padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "14px" }}>
              <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "14px", color: "#333" }}>📅 Review Schedule</div>
              {[{ q: "Q1", date: "Mid-February", note: "After Q4 earnings season" }, { q: "Q2", date: "Mid-May", note: "After Q1 earnings season" }, { q: "Q3", date: "Mid-August", note: "After Q2 earnings season" }, { q: "Q4", date: "Mid-November", note: "After Q3 earnings season" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "13px", color: "#333" }}>{item.q} Review</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{item.note}</div>
                  </div>
                  <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", fontWeight: "700" }}>{item.date}</div>
                </div>
              ))}
            </div>
            {quarterlyChecklist.map((phase, pi) => {
              const isOpen = openChecklist[pi];
              return (
                <div key={pi} style={{ marginBottom: "10px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <button onClick={() => setOpenChecklist(p => ({ ...p, [pi]: !p[pi] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: isOpen ? "linear-gradient(135deg, #667eea, #764ba2)" : "white", color: isOpen ? "white" : "#333", fontWeight: "700", fontSize: "14px", cursor: "pointer", transition: "all 0.2s ease" }}>
                    <span>{phase.phase}</span><span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.7 }}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{ background: "white", padding: "8px 0" }}>
                      {phase.items.map((item, ii) => (
                        <div key={ii} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 18px", borderBottom: ii < phase.items.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                          <div style={{ width: "18px", height: "18px", border: "2px solid #667eea", borderRadius: "50%", flexShrink: 0, marginTop: "2px" }} />
                          <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.6" }}>{item}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ marginTop: "8px", background: "linear-gradient(135deg, #fdf4ff, #fce7f3)", borderRadius: "16px", padding: "16px 20px", border: "2px solid #e879f940" }}>
              <div style={{ fontWeight: "800", fontSize: "14px", color: "#86198f", marginBottom: "8px" }}>📓 After Every Review — Write This Down</div>
              {["What did we decide and why?", "What does the macro environment look like right now?", "What is our conviction level (1–10) for each position?", "What are we watching for next quarter?", "How much capital are we planning to add?"].map((q, i) => (
                <div key={i} style={{ fontSize: "13px", color: "#701a75", lineHeight: "1.7", paddingLeft: "14px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0 }}>•</span>{q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 8: RESOURCES ── */}
        {activeTab === 8 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Research Resources</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Your complete DD toolkit</p>
            </div>
            {resources.map((res, i) => (
              <div key={i} style={{ marginBottom: "10px", background: "white", borderRadius: "16px", padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `4px solid ${res.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "15px", color: res.color, marginBottom: "4px" }}>{res.name}</div>
                    <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.6" }}>{res.use}</div>
                  </div>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ background: res.color, color: "white", padding: "7px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", textDecoration: "none", flexShrink: 0 }}>Visit →</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 9: WATCHLIST ── */}
        {activeTab === 9 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Watchlist</div>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Strong & moderate conviction only — in priority order</p>
            </div>
            {watchlistData.map((item, i) => {
              const isOpen = openWatchlist[i];
              return (
                <div key={i} style={{ marginBottom: "12px", background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `5px solid ${item.color}` }}>
                  <button onClick={() => setOpenWatchlist(p => ({ ...p, [i]: !p[i] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "none", background: "white", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "900", color: item.color }}>{item.ticker}</span>
                      <div>
                        <div style={{ fontSize: "12px", color: "#888" }}>{item.conviction}</div>
                        <div style={{ fontSize: "11px", color: "#bbb", marginTop: "1px" }}>{item.note.substring(0, 45)}...</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ background: `${item.color}18`, border: `1.5px solid ${item.color}40`, borderRadius: "100px", padding: "3px 10px", fontSize: "10px", fontWeight: "700", color: item.color, whiteSpace: "nowrap" }}>{item.priority}</span>
                      <span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", opacity: 0.4, fontSize: "12px" }}>▼</span>
                    </div>
                  </button>
                  {isOpen && <div style={{ padding: "0 18px 14px", borderTop: "1px solid #f5f5f5", paddingTop: "12px", fontSize: "13.5px", color: "#555", lineHeight: "1.7" }}>{item.why}</div>}
                </div>
              );
            })}
            <div style={{ background: "white", borderRadius: "20px", padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginTop: "8px" }}>
              <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "14px", color: "#333" }}>💵 Next Capital Deployment Order</div>
              {[{ order: "1st", ticker: "SCHD", why: "Income & defensive layer — no debate, add immediately", color: "#10b981" }, { order: "2nd", ticker: "GEV", why: "Only if it pulls back to $700–750. Set the Webull alert now.", color: "#f59e0b" }, { order: "3rd", ticker: "LLY", why: "When you can deploy $300–500 meaningfully", color: "#ec4899" }, { order: "4th", ticker: "GOOGL", why: "Revisit at each quarterly review vs MSFT performance", color: "#3b82f6" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                  <div style={{ background: item.color, color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "10px", flexShrink: 0 }}>{item.order}</div>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "14px", color: item.color }}>{item.ticker}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "2px", lineHeight: "1.5" }}>{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div style={{ textAlign: "center", marginTop: "32px", fontSize: "11px", color: "#ccc", padding: "0 16px" }}>
        Not financial advice • Personal reference only • Review quarterly 💛<br />
        <span style={{ fontSize: "10px" }}>Live prices via Financial Modeling Prep • 70% Stocks / 30% ETFs ✅ • Built with 💖</span>
      </div>
    </div>
  );
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const AV_KEY = process.env.ALPHA_VANTAGE_KEY || "G422J4WD6TBLA9K3";

async function fetchAnalystData(ticker, retries = 2) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${AV_KEY}`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" } });
      if (!res.ok) { await sleep(400); continue; }
      const d = await res.json();
      if (!d || d["Information"] || d["Note"] || !d["Symbol"]) { await sleep(400); continue; }

      const safe = (key, decimals = 2) => {
        const v = d[key];
        if (!v || v === "None" || v === "-") return null;
        const n = parseFloat(v);
        return isNaN(n) ? null : parseFloat(n.toFixed(decimals));
      };
      const safeInt = (key) => {
        const v = d[key];
        if (!v || v === "None" || v === "-") return null;
        const n = parseInt(v);
        return isNaN(n) ? null : n;
      };

      // Analyst ratings
      const strongBuy = safeInt("AnalystRatingStrongBuy") || 0;
      const buy = safeInt("AnalystRatingBuy") || 0;
      const hold = safeInt("AnalystRatingHold") || 0;
      const sell = safeInt("AnalystRatingSell") || 0;
      const strongSell = safeInt("AnalystRatingStrongSell") || 0;
      const bullish = strongBuy + buy;
      const totalAnalysts = bullish + hold + sell + strongSell;
      const buySellStr = totalAnalysts > 0 ? `${bullish} Buy, ${hold} Hold, ${sell + strongSell} Sell` : null;
      const recKey = d["AnalystRatingBuy"] ? (bullish / totalAnalysts > 0.7 ? "Strong Buy" : bullish / totalAnalysts > 0.5 ? "Buy" : hold / totalAnalysts > 0.5 ? "Hold" : "Sell") : null;

      // Price target
      const analystTarget = safe("AnalystTargetPrice", 2);

      // Earnings
      const nextEarnings = d["NextEarningsDate"] && d["NextEarningsDate"] !== "None" ? d["NextEarningsDate"] : null;

      // Valuation
      const forwardPE = safe("ForwardPE", 1);
      const pegRatio = safe("PEGRatio", 2);
      const evEbitda = safe("EVToEBITDA", 1);
      const priceToBook = safe("PriceToBookRatio", 2);
      const priceToSales = safe("PriceToSalesRatioTTM", 2);

      // Financial health — AV OVERVIEW fields
      const currentRatio = safe("CurrentRatio", 2);
      const debtToEquity = safe("DebtToEquityRatio", 2); // net debt proxy
      const returnOnEquity = safe("ReturnOnEquityTTM", 2);
      const returnOnAssets = safe("ReturnOnAssetsTTM", 2);
      const revenueGrowthYOY = safe("RevenueGrowthYOY", 1);
      const grossProfitTTM = safeInt("GrossProfitTTM");
      const revenueTTM = safeInt("RevenueTTM");
      const ebitda = safeInt("EBITDA");
      const grossMarginLive = grossProfitTTM && revenueTTM
        ? parseFloat(((grossProfitTTM / revenueTTM) * 100).toFixed(1)) : null;

      // Format large numbers nicely
      const fmtBig = (n) => {
        if (!n) return null;
        if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
        if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
        if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
        return `$${n}`;
      };

      return {
        ticker,
        analystTarget, analystTargetHigh: null, analystTargetLow: null,
        consensus: recKey,
        buySell: buySellStr,
        numAnalysts: totalAnalysts || null,
        strongBuy, buy, hold, sell, strongSell, totalAnalysts,
        nextEarnings, earningsEpsEst: null,
        // Valuation
        forwardPE, pegRatio, evEbitda, priceToBook, priceToSales,
        // Financial health
        currentRatio,
        debtToEquity,
        returnOnEquity: returnOnEquity ? `${(returnOnEquity * 100).toFixed(1)}%` : null,
        returnOnAssets: returnOnAssets ? `${(returnOnAssets * 100).toFixed(1)}%` : null,
        revenueGrowthYOY: revenueGrowthYOY ? `${revenueGrowthYOY > 0 ? "+" : ""}${revenueGrowthYOY}%` : null,
        grossMarginLive: grossMarginLive ? `${grossMarginLive}%` : null,
        ebitdaFmt: fmtBig(ebitda),
        revenueFmt: fmtBig(revenueTTM),
      };
    } catch (e) { await sleep(400); continue; }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=3600");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { tickers } = req.query;
if (!tickers) return res.status(400).json({ error: "No tickers" });
  const tickerList = tickers.split(",").map(t => t.trim()).filter(Boolean);
  const results = [];
  for (let i = 0; i < tickerList.length; i++) {
    if (i > 0) await sleep(500);
    const data = await fetchAnalystData(tickerList[i]);
    if (data) results.push(data);
  }
  return res.status(200).json(results);
}

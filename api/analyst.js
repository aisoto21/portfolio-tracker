const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAnalystData(ticker, retries = 3) {
  const modules = "recommendationTrend,financialData,calendarEvents,defaultKeyStatistics";
  const urls = [
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=${modules}`,
    `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=${modules}`,
  ];

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(urls[attempt % urls.length], {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://finance.yahoo.com",
        }
      });
      if (!res.ok) {
        if (attempt < retries - 1) { await sleep(400 * (attempt + 1)); continue; }
        return null;
      }
      const data = await res.json();
      const result = data?.quoteSummary?.result?.[0];
      if (!result) return null;

      // Analyst recommendations
      const trend = result.recommendationTrend?.trend?.[0] || {};
      const strongBuy = trend.strongBuy || 0;
      const buy = trend.buy || 0;
      const hold = trend.hold || 0;
      const sell = trend.sell || 0;
      const strongSell = trend.strongSell || 0;
      const totalAnalysts = strongBuy + buy + hold + sell + strongSell;
      const bullish = strongBuy + buy;

      // Financial data
      const fd = result.financialData || {};
      const targetMean = fd.targetMeanPrice?.raw || null;
      const targetHigh = fd.targetHighPrice?.raw || null;
      const targetLow = fd.targetLowPrice?.raw || null;
      const recKey = fd.recommendationKey || null; // "strongBuy", "buy", "hold", "sell"
      const numAnalysts = fd.numberOfAnalystOpinions?.raw || totalAnalysts || null;

      // Earnings date from calendarEvents
      const cal = result.calendarEvents || {};
      const earningsDates = cal.earnings?.earningsDate || [];
      const nextEarnings = earningsDates[0]?.raw
        ? new Date(earningsDates[0].raw * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;
      const earningsEpsEst = cal.earnings?.epsEstimate?.raw || null;

      // Format consensus label
      const consensusMap = {
        strongBuy: "Strong Buy",
        buy: "Buy",
        hold: "Hold",
        sell: "Sell",
        strongSell: "Strong Sell",
      };
      const consensus = consensusMap[recKey] || (bullish > hold + sell ? "Buy" : "Hold");

      // Format buy/sell string like "57 Buy, 7 Hold, 1 Sell"
      const buySellStr = totalAnalysts > 0
        ? `${bullish} Buy, ${hold} Hold, ${sell + strongSell} Sell`
        : null;

      return {
        ticker,
        analystTarget: targetMean ? parseFloat(targetMean.toFixed(2)) : null,
        analystTargetHigh: targetHigh ? parseFloat(targetHigh.toFixed(2)) : null,
        analystTargetLow: targetLow ? parseFloat(targetLow.toFixed(2)) : null,
        consensus,
        buySell: buySellStr,
        numAnalysts,
        strongBuy, buy, hold, sell, strongSell, totalAnalysts,
        nextEarnings,
        earningsEpsEst: earningsEpsEst ? `$${earningsEpsEst.toFixed(2)} EPS` : null,
      };
    } catch (e) {
      if (attempt < retries - 1) { await sleep(400); continue; }
      return null;
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"); // cache 1 hour
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: "No tickers" });

  const tickerList = tickers.split(",").map(t => t.trim()).filter(Boolean);

  const results = [];
  for (let i = 0; i < tickerList.length; i++) {
    if (i > 0) await sleep(250); // stagger to avoid rate limiting
    const data = await fetchAnalystData(tickerList[i]);
    if (data) results.push(data);
  }

  return res.status(200).json(results);
}

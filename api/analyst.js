const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAnalystData(ticker, retries = 3) {
  // Try multiple Yahoo Finance endpoints
  const endpointSets = [
    // v11 quoteSummary (less restricted)
    `https://query1.finance.yahoo.com/v11/finance/quoteSummary/${ticker}?modules=recommendationTrend%2CfinancialData%2CcalendarEvents`,
    `https://query2.finance.yahoo.com/v11/finance/quoteSummary/${ticker}?modules=recommendationTrend%2CfinancialData%2CcalendarEvents`,
    // v10 fallback
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=recommendationTrend%2CfinancialData%2CcalendarEvents`,
    `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=recommendationTrend%2CfinancialData%2CcalendarEvents`,
  ];

  const headerSets = [
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Origin": "https://finance.yahoo.com",
      "Referer": "https://finance.yahoo.com/quote/" + ticker,
    },
    {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      "Accept": "application/json",
      "Referer": "https://finance.yahoo.com",
    }
  ];

  for (let attempt = 0; attempt < endpointSets.length; attempt++) {
    try {
      const headers = headerSets[attempt % headerSets.length];
      const res = await fetch(endpointSets[attempt], { headers });
      if (!res.ok) { await sleep(300); continue; }
      const data = await res.json();
      const result = data?.quoteSummary?.result?.[0];
      if (!result) { await sleep(300); continue; }

      const trend = result.recommendationTrend?.trend?.[0] || {};
      const strongBuy = trend.strongBuy || 0;
      const buy = trend.buy || 0;
      const hold = trend.hold || 0;
      const sell = trend.sell || 0;
      const strongSell = trend.strongSell || 0;
      const bullish = strongBuy + buy;
      const totalAnalysts = bullish + hold + sell + strongSell;

      const fd = result.financialData || {};
      const targetMean = fd.targetMeanPrice?.raw || null;
      const targetHigh = fd.targetHighPrice?.raw || null;
      const targetLow = fd.targetLowPrice?.raw || null;
      const recKey = fd.recommendationKey || null;

      const cal = result.calendarEvents || {};
      const earningsDates = cal.earnings?.earningsDate || [];
      const nextEarnings = earningsDates[0]?.raw
        ? new Date(earningsDates[0].raw * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;
      const earningsEpsEst = cal.earnings?.epsEstimate?.raw || null;

      const consensusMap = { strongBuy: "Strong Buy", buy: "Buy", hold: "Hold", sell: "Sell", strongSell: "Strong Sell" };
      const consensus = consensusMap[recKey] || (bullish > hold + sell ? "Buy" : "Hold");
      const buySellStr = totalAnalysts > 0 ? `${bullish} Buy, ${hold} Hold, ${sell + strongSell} Sell` : null;

      // Only return if we got meaningful data
      if (!targetMean && !buySellStr && !nextEarnings) { await sleep(300); continue; }

      return {
        ticker,
        analystTarget: targetMean ? parseFloat(targetMean.toFixed(2)) : null,
        analystTargetHigh: targetHigh ? parseFloat(targetHigh.toFixed(2)) : null,
        analystTargetLow: targetLow ? parseFloat(targetLow.toFixed(2)) : null,
        consensus,
        buySell: buySellStr,
        numAnalysts: totalAnalysts || null,
        strongBuy, buy, hold, sell, strongSell, totalAnalysts,
        nextEarnings,
        earningsEpsEst: earningsEpsEst ? `$${earningsEpsEst.toFixed(2)} EPS` : null,
      };
    } catch (e) {
      await sleep(300);
      continue;
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: "No tickers" });

  const tickerList = tickers.split(",").map(t => t.trim()).filter(Boolean);

  const results = [];
  for (let i = 0; i < tickerList.length; i++) {
    if (i > 0) await sleep(300);
    const data = await fetchAnalystData(tickerList[i]);
    if (data) results.push(data);
  }

  return res.status(200).json(results);
}

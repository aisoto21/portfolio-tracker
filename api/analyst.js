const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AV_KEY = process.env.ALPHA_VANTAGE_KEY || "G422J4WD6TBLA9K3";

async function fetchAnalystData(ticker, retries = 2) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${AV_KEY}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
      });
      if (!res.ok) { await sleep(400); continue; }
      const d = await res.json();

      if (!d || d["Information"] || d["Note"] || !d["Symbol"]) {
        await sleep(400); continue;
      }

      const analystTarget = d["AnalystTargetPrice"] && d["AnalystTargetPrice"] !== "None"
        ? parseFloat(parseFloat(d["AnalystTargetPrice"]).toFixed(2)) : null;

      const strongBuy = parseInt(d["AnalystRatingStrongBuy"]) || 0;
      const buy = parseInt(d["AnalystRatingBuy"]) || 0;
      const hold = parseInt(d["AnalystRatingHold"]) || 0;
      const sell = parseInt(d["AnalystRatingSell"]) || 0;
      const strongSell = parseInt(d["AnalystRatingStrongSell"]) || 0;
      const bullish = strongBuy + buy;
      const totalAnalysts = bullish + hold + sell + strongSell;

      const buySellStr = totalAnalysts > 0
        ? `${bullish} Buy, ${hold} Hold, ${sell + strongSell} Sell`
        : null;

      const consensus = totalAnalysts > 0
        ? (bullish / totalAnalysts > 0.7 ? "Strong Buy"
          : bullish / totalAnalysts > 0.5 ? "Buy"
          : hold / totalAnalysts > 0.5 ? "Hold"
          : "Sell")
        : null;

      const nextEarnings = d["NextEarningsDate"] && d["NextEarningsDate"] !== "None"
        ? d["NextEarningsDate"] : null;

      const forwardPE = d["ForwardPE"] && d["ForwardPE"] !== "None"
        ? parseFloat(parseFloat(d["ForwardPE"]).toFixed(1)) : null;

      const pegRatio = d["PEGRatio"] && d["PEGRatio"] !== "None"
        ? parseFloat(parseFloat(d["PEGRatio"]).toFixed(2)) : null;

      const evEbitda = d["EVToEBITDA"] && d["EVToEBITDA"] !== "None"
        ? parseFloat(parseFloat(d["EVToEBITDA"]).toFixed(1)) : null;

      return {
        ticker, analystTarget, analystTargetHigh: null, analystTargetLow: null,
        consensus, buySell: buySellStr, numAnalysts: totalAnalysts || null,
        strongBuy, buy, hold, sell, strongSell, totalAnalysts,
        nextEarnings, earningsEpsEst: null,
        forwardPE, pegRatio, evEbitda,
      };
    } catch (e) {
      await sleep(400); continue;
    }
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTicker(ticker, retries = 3) {
  // VIX uses a different Yahoo endpoint
  const symbol = ticker.startsWith("^") ? encodeURIComponent(ticker) : ticker;
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
  ];

  for (let attempt = 0; attempt < retries; attempt++) {
    const url = urls[attempt % urls.length];
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        }
      });
      if (!response.ok) {
        if (attempt < retries - 1) { await sleep(300 * (attempt + 1)); continue; }
        return null;
      }
      const data = await response.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (!meta?.regularMarketPrice) {
        if (attempt < retries - 1) { await sleep(300 * (attempt + 1)); continue; }
        return null;
      }
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || meta.previousClose || price;
      const change = price - prevClose;
      const changePct = (change / prevClose) * 100;
      return {
        symbol: ticker, // return original symbol including ^
        price,
        change,
        changesPercentage: changePct,
        dayHigh: meta.regularMarketDayHigh || null,
        dayLow: meta.regularMarketDayLow || null,
        marketCap: meta.marketCap || null,
        volume: meta.regularMarketVolume || null,
      };
    } catch (e) {
      if (attempt < retries - 1) { await sleep(300 * (attempt + 1)); continue; }
      console.error(`Failed ${ticker} after ${retries} attempts:`, e.message);
      return null;
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: "No symbols" });

  const tickers = symbols.split(",").map(t => t.trim()).filter(Boolean);
  const results = [];

  for (let i = 0; i < tickers.length; i++) {
    if (i > 0) await sleep(150);
    const result = await fetchTicker(tickers[i]);
    if (result) results.push(result);
  }

  res.status(200).json(results);
}

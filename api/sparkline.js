const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchSparkline(ticker, retries = 3) {
  // Fetch intraday 5-minute data for today's sparkline
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=5m&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=5m&range=1d`,
  ];
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(urls[attempt % urls.length], {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "application/json",
          "Referer": "https://finance.yahoo.com",
        }
      });
      if (!res.ok) { await sleep(300); continue; }
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) { await sleep(300); continue; }

      const closes = result.indicators?.quote?.[0]?.close || [];
      const timestamps = result.timestamp || [];
      const filtered = closes
        .map((c, i) => ({ price: c, ts: timestamps[i] }))
        .filter(d => d.price != null && !isNaN(d.price));

      if (filtered.length < 5) { await sleep(300); continue; }

      // Downsample to ~20 points for clean sparklines
      const step = Math.max(1, Math.floor(filtered.length / 20));
      const sampled = filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);

      return {
        symbol: ticker,
        points: sampled.map(d => parseFloat(d.price.toFixed(2))),
        open: filtered[0].price,
        close: filtered[filtered.length - 1].price,
        change: ((filtered[filtered.length - 1].price - filtered[0].price) / filtered[0].price * 100).toFixed(2),
      };
    } catch (e) {
      await sleep(300); continue;
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60"); // cache 5 min
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: "No tickers" });

  const tickerList = tickers.split(",").map(t => t.trim()).filter(Boolean);
  const results = [];
  for (let i = 0; i < tickerList.length; i++) {
    if (i > 0) await sleep(200);
    const data = await fetchSparkline(tickerList[i]);
    if (data) results.push(data);
  }
  return res.status(200).json(results);
}

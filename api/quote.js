const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period, avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff >= 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return Math.round(100 - (100 / (1 + avgGain / avgLoss)));
}

function calcSMA(closes, period) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

// Fast fetch — just current price data (1d range)
async function fetchPrice(ticker, retries = 3) {
  const symbol = ticker.startsWith("^") ? encodeURIComponent(ticker) : ticker;
  // v7 quote endpoint — more reliable for after-hours/pre-market data
  const urls = [
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketDayHigh,regularMarketDayLow,marketCap,regularMarketVolume,fiftyTwoWeekHigh,fiftyTwoWeekLow,postMarketPrice,postMarketChange,postMarketChangePercent,preMarketPrice,preMarketChange,preMarketChangePercent,marketState,chartPreviousClose`,
    `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketDayHigh,regularMarketDayLow,marketCap,regularMarketVolume,fiftyTwoWeekHigh,fiftyTwoWeekLow,postMarketPrice,postMarketChange,postMarketChangePercent,preMarketPrice,preMarketChange,preMarketChangePercent,marketState,chartPreviousClose`,
  ];
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(urls[attempt % urls.length], {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
      });
      if (!res.ok) { if (attempt < retries - 1) { await sleep(300 * (attempt + 1)); continue; } return null; }
      const data = await res.json();
      const q = data?.quoteResponse?.result?.[0];
      if (!q?.regularMarketPrice) { if (attempt < retries - 1) { await sleep(300); continue; } return null; }
      const price = q.regularMarketPrice;
      const prevClose = q.chartPreviousClose || q.regularMarketPreviousClose || price;
      const change = price - prevClose;
      const postPrice = q.postMarketPrice || null;
      const prePrice = q.preMarketPrice || null;
      const postChange = q.postMarketChangePercent || (postPrice ? ((postPrice - price) / price) * 100 : null);
      const preChange = q.preMarketChangePercent || (prePrice ? ((prePrice - price) / price) * 100 : null);
      const marketState = q.marketState || "REGULAR";
      return {
        symbol: ticker, price, change,
        changesPercentage: q.regularMarketChangePercent || (change / prevClose) * 100,
        dayHigh: q.regularMarketDayHigh || null,
        dayLow: q.regularMarketDayLow || null,
        marketCap: q.marketCap || null,
        volume: q.regularMarketVolume || null,
        week52High: q.fiftyTwoWeekHigh || null,
        week52Low: q.fiftyTwoWeekLow || null,
        postMarketPrice: postPrice,
        postMarketChangePct: postChange,
        preMarketPrice: prePrice,
        preMarketChangePct: preChange,
        marketState,
      };
    } catch (e) {
      if (attempt < retries - 1) { await sleep(300); continue; }
      return null;
    }
  }
  return null;
}

// Slow fetch — full year for technicals
async function fetchTechnicals(ticker, retries = 3) {
  if (ticker.startsWith("^")) return null; // skip VIX for technicals
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`,
  ];
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(urls[attempt % urls.length], {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
      });
      if (!res.ok) { if (attempt < retries - 1) { await sleep(400 * (attempt + 1)); continue; } return null; }
      const data = await res.json();
      const closes = (data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []).filter(v => v != null && !isNaN(v));
      if (closes.length < 14) return null;
      const rsi = calcRSI(closes);
      const ma50 = calcSMA(closes, 50);
      const ma200 = calcSMA(closes, 200);
      const currentPrice = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      return {
        symbol: ticker,
        rsi,
        ma50: ma50 ? parseFloat(ma50.toFixed(2)) : null,
        ma200: ma200 ? parseFloat(ma200.toFixed(2)) : null,
        aboveMa50: ma50 && currentPrice ? currentPrice > ma50 : null,
        aboveMa200: ma200 && currentPrice ? currentPrice > ma200 : null,
        week52High: Math.max(...closes),
        week52Low: Math.min(...closes.filter(v => v > 0)),
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
  if (req.method === "OPTIONS") return res.status(200).end();

  const { symbols, mode } = req.query;
  if (!symbols) return res.status(400).json({ error: "No symbols" });

  const tickers = symbols.split(",").map(t => t.trim()).filter(Boolean);

  // FAST mode — just prices, parallel fetch
  if (mode === "fast") {
    const results = await Promise.all(tickers.map(t => fetchPrice(t)));
    return res.status(200).json(results.filter(Boolean));
  }

  // TECHNICALS mode — historical data, staggered
  if (mode === "technicals") {
    const results = [];
    for (let i = 0; i < tickers.length; i++) {
      if (i > 0) await sleep(200);
      const r = await fetchTechnicals(tickers[i]);
      if (r) results.push(r);
    }
    return res.status(200).json(results);
  }

  // Default — fast prices only
  const results = await Promise.all(tickers.map(t => fetchPrice(t)));
  return res.status(200).json(results.filter(Boolean));
}

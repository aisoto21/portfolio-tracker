const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate RSI from closing prices
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
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - (100 / (1 + rs)));
}

// Calculate simple moving average
function calcSMA(closes, period) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

async function fetchTicker(ticker, retries = 3) {
  const symbol = ticker.startsWith("^") ? encodeURIComponent(ticker) : ticker;
  // Fetch 1 year of daily data for MA200 + RSI calculation
  const isIndex = ticker.startsWith("^");
  const range = isIndex ? "1d" : "1y";
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`,
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
        if (attempt < retries - 1) { await sleep(400 * (attempt + 1)); continue; }
        return null;
      }
      const data = await response.json();
      const result = data?.chart?.result?.[0];
      const meta = result?.meta;
      if (!meta?.regularMarketPrice) {
        if (attempt < retries - 1) { await sleep(400 * (attempt + 1)); continue; }
        return null;
      }

      // Extract closing prices for technical calculations
      const closes = (result?.indicators?.quote?.[0]?.close || []).filter(v => v != null && !isNaN(v));
      const currentPrice = meta.regularMarketPrice;

      // Calculate technicals (skip for VIX)
      let rsi = null, ma50 = null, ma200 = null, aboveMa50 = null, aboveMa200 = null;
      if (!isIndex && closes.length >= 14) {
        rsi = calcRSI(closes);
        ma50 = calcSMA(closes, 50);
        ma200 = calcSMA(closes, 200);
        aboveMa50 = ma50 ? currentPrice > ma50 : null;
        aboveMa200 = ma200 ? currentPrice > ma200 : null;
      }

      const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
      const change = currentPrice - prevClose;
      const changePct = (change / prevClose) * 100;

      // 52-week high/low from the fetched data
      const allCloses = closes.length > 0 ? closes : [currentPrice];
      const week52High = Math.max(...allCloses, meta.fiftyTwoWeekHigh || 0);
      const week52Low = Math.min(...allCloses.filter(v => v > 0), meta.fiftyTwoWeekLow || currentPrice);

      return {
        symbol: ticker,
        price: currentPrice,
        change,
        changesPercentage: changePct,
        dayHigh: meta.regularMarketDayHigh || null,
        dayLow: meta.regularMarketDayLow || null,
        marketCap: meta.marketCap || null,
        volume: meta.regularMarketVolume || null,
        rsi,
        ma50: ma50 ? parseFloat(ma50.toFixed(2)) : null,
        ma200: ma200 ? parseFloat(ma200.toFixed(2)) : null,
        aboveMa50,
        aboveMa200,
        week52High: parseFloat(week52High.toFixed(2)),
        week52Low: parseFloat(week52Low.toFixed(2)),
      };
    } catch (e) {
      if (attempt < retries - 1) { await sleep(400 * (attempt + 1)); continue; }
      console.error(`Failed ${ticker}:`, e.message);
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
    if (i > 0) await sleep(200);
    const result = await fetchTicker(tickers[i]);
    if (result) results.push(result);
  }

  res.status(200).json(results);
}

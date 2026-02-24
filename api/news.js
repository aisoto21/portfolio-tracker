const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNewsForTicker(ticker, retries = 3) {
  const urls = [
    `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&newsCount=5&quotesCount=0&enableFuzzyQuery=false`,
    `https://query2.finance.yahoo.com/v1/finance/search?q=${ticker}&newsCount=5&quotesCount=0&enableFuzzyQuery=false`,
  ];
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(urls[attempt % urls.length], {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        }
      });
      if (!res.ok) {
        if (attempt < retries - 1) { await sleep(300 * (attempt + 1)); continue; }
        return [];
      }
      const data = await res.json();
      const items = data?.news || [];
      return items.slice(0, 5).map(item => ({
        ticker,
        headline: item.title || "",
        time: formatTime(item.providerPublishTime),
        source: item.publisher || "Yahoo Finance",
        url: item.link || "#",
        uuid: item.uuid || Math.random().toString(36),
      })).filter(item => item.headline);
    } catch (e) {
      if (attempt < retries - 1) { await sleep(300); continue; }
      return [];
    }
  }
  return [];
}

function formatTime(unixTs) {
  if (!unixTs) return "recently";
  const now = Date.now() / 1000;
  const diff = now - unixTs;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 172800) return "1d ago";
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`;
  return new Date(unixTs * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate"); // cache 5 min
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: "No tickers" });

  const tickerList = tickers.split(",").map(t => t.trim()).filter(Boolean);

  // Stagger requests to avoid rate limiting
  const allNews = [];
  for (let i = 0; i < tickerList.length; i++) {
    if (i > 0) await sleep(150);
    const news = await fetchNewsForTicker(tickerList[i]);
    allNews.push(...news);
  }

  // Also fetch general market news
  await sleep(150);
  const marketNews = await fetchNewsForTicker("stock+market");
  const marketTagged = marketNews.map(n => ({ ...n, ticker: "MARKET" }));
  allNews.push(...marketTagged);

  // Deduplicate by uuid/headline
  const seen = new Set();
  const deduped = allNews.filter(item => {
    const key = item.uuid || item.headline;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by recency (most recent first) — approximate from time string
  return res.status(200).json(deduped);
}

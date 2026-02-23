// Vercel Serverless Function — runs on the SERVER, not the browser
// This proxies the FMP API call so there's no CORS issue
export default async function handler(req, res) {
  // Allow requests from your own app
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const API_KEY = "RRTdfDn0imGz8UYiCfvHBDrEkFDvnYhE";
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "No symbols provided" });
  }

  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from FMP" });
  }
}

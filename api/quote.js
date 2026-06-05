export default async function handler(req, res) {
  try {
    const apiKey = process.env.NINJAS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing NINJAS_API_KEY env var" });
    }

    const categories = [
      "wisdom",
      "philosophy",
      "life",
      "inspirational",
      "humor",
      "success",
      "happiness",
      "leadership",
    ];

    // Pick 1 category each request, or change this to pick multiple.
    const category = categories[Math.floor(Math.random() * categories.length)];

    const url = `https://api.api-ninjas.com/v2/quotes?category=${encodeURIComponent(category)}`;
    const r = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: "API Ninjas error", details: text });
    }

    const data = await r.json();
    // API returns an array like: [{ quote, author, category }]
    const q = data?.[0];

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      quote: q?.quote ?? "",
      author: q?.author ?? "",
      category: q?.category ?? category,
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}

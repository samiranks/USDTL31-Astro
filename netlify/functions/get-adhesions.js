const https = require("https");

// Fetch helper using native https (no external dependencies needed)
function fetchJSON(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "UDTL31-Dashboard",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
    };
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

exports.handler = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const token = process.env.GITHUB_TOKEN;
    const apiBase = "https://api.github.com/repos/samiranks/USDTL31-Astro";

    // 1. Lister les fichiers dans src/content/adhesions/
    const files = await fetchJSON(`${apiBase}/contents/src/content/adhesions`, token);

    // Filtrer uniquement les .json (exclure .gitkeep)
    const jsonFiles = files.filter(f => f.name.endsWith(".json"));

    if (jsonFiles.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ count: 0, adhesions: [] }),
      };
    }

    // 2. Telecharger le contenu de chaque fichier en parallele
    const adhesions = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const raw = await fetchJSON(file.url, token);
          // Le contenu est en base64
          const decoded = Buffer.from(raw.content, "base64").toString("utf-8");
          return JSON.parse(decoded);
        } catch (e) {
          return null;
        }
      })
    );

    // Filtrer les erreurs et trier par date (plus recent en premier)
    const valid = adhesions
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: valid.length, adhesions: valid }),
    };
  } catch (error) {
    console.error("get-adhesions error:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

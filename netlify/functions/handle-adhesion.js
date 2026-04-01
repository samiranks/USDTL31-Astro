import { Octokit } from "@octokit/rest";

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // Parse form data (application/x-www-form-urlencoded)
    const params = new URLSearchParams(event.body);
    const data = {};
    params.forEach((value, key) => { data[key] = value; });

    const { nom, prenom, email, tel, entreprise, fonction, contrat, temps, cotisation, frequence } = data;

    // Validation basique
    if (!nom || !prenom || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Champs requis manquants (nom, prenom, email)." }),
      };
    }

    // Verification du token GitHub
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error("❌ GITHUB_TOKEN manquant dans les variables d'environnement Netlify.");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Configuration serveur manquante." }),
      };
    }

    // Nom de fichier unique avec horodatage
    const date = new Date().toISOString();
    const slug = `${date.split("T")[0]}-${nom.toLowerCase().replace(/\s+/g, "-")}-${prenom.toLowerCase().replace(/\s+/g, "-")}`;
    const filePath = `src/content/adhesions/${slug}.json`;

    const content = JSON.stringify(
      { nom, prenom, email, tel, entreprise, fonction, contrat, temps, cotisation, frequence, date },
      null,
      2
    );

    // Initialiser Octokit avec le token GitHub
    const octokit = new Octokit({ auth: token });

    // Creer le fichier JSON dans le repo GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: "samiranks",
      repo: "USDTL31-Astro",
      path: filePath,
      message: `Nouvelle adhesion : ${nom} ${prenom}`,
      content: Buffer.from(content).toString("base64"),
      branch: "main",
    });

    console.log(`✅ Adhesion enregistree : ${filePath}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Erreur handle-adhesion:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Erreur serveur interne." }),
    };
  }
};

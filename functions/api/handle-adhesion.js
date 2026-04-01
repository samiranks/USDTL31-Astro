export async function onRequestPost(context) {
  const { request, env } = context;

  // Configuration CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Gestion des requêtes OPTIONS (pre-flight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { nom, prenom, email, telephone, entreprise, fonction, contrat, date_adhesion } = body;

    if (!nom || !email) {
      return new Response(JSON.stringify({ error: 'Nom et Email requis' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const githubToken = env.GITHUB_TOKEN;
    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'Configuration serveur manquante (TOKEN)' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const repoOwner = 'samiranks';
    const repoName = 'USDTL31-Astro';
    const fileName = `${new Date().toISOString().split('T')[0]}-${nom.toLowerCase().replace(/\s+/g, '-')}-${prenom.toLowerCase().replace(/\s+/g, '-')}.json`;
    const path = `src/content/adhesions/${fileName}`;

    // Préparation du contenu JSON pour GitHub
    const fileContent = JSON.stringify(body, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

    // Appel à l'API GitHub via fetch (plus léger que Octokit pour Workers)
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker-USDTL31',
      },
      body: JSON.stringify({
        message: `Nouvelle adhésion : ${nom} ${prenom}`,
        content: base64Content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur GitHub: ${errorData.message}`);
    }

    return new Response(JSON.stringify({ success: true, message: 'Adhésion enregistrée avec succès' }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

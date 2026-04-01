export async function onRequestGet(context) {
  const { env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  const githubToken = env.GITHUB_TOKEN;
  if (!githubToken) {
    return new Response(JSON.stringify({ error: 'Configuration serveur manquante (TOKEN)' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const repoOwner = 'samiranks';
  const repoName = 'USDTL31-Astro';
  const path = 'src/content/adhesions';

  try {
    // 1. Lister les fichiers dans le dossier
    const listResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'Cloudflare-Worker-USDTL31',
      },
    });

    if (!listResponse.ok) {
      if (listResponse.status === 404) {
        return new Response(JSON.stringify([]), { status: 200, headers: corsHeaders });
      }
      const err = await listResponse.json();
      throw new Error(`Erreur GitHub (liste): ${err.message}`);
    }

    const files = await listResponse.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    // 2. Parcourir les fichiers et récupérer le contenu
    const adhesions = [];
    for (const file of jsonFiles) {
      const fileResponse = await fetch(file.download_url);
      if (fileResponse.ok) {
        const data = await fileResponse.json();
        // Ajouter un ID unique basé sur le nom du fichier
        data.id = file.name;
        adhesions.push(data);
      }
    }

    return new Response(JSON.stringify(adhesions), {
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

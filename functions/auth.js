export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');

  // Configuration GitHub OAuth (doivent être chargées dans Cloudflare)
  const clientID = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  // --- ÉTAPE 1 : REDIRECTION VERS GITHUB ---
  if (!url.searchParams.has('code')) {
    const scope = url.searchParams.get('scope') || 'repo,user';
    const redirectUrl = new URL('https://github.com/login/oauth/authorize');
    redirectUrl.searchParams.set('client_id', clientID);
    redirectUrl.searchParams.set('scope', scope);
    redirectUrl.searchParams.set('allow_signup', 'true');
    // Le redirect_uri est optionnel si configuré dans GitHub, 
    // mais on le force ici pour plus de précision.
    redirectUrl.searchParams.set('state', Math.random().toString(36).substring(2));

    return Response.redirect(redirectUrl.toString(), 302);
  }

  // --- ÉTAPE 2 : ÉCHANGE DU CODE CONTRE LE TOKEN ---
  const code = url.searchParams.get('code');

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const result = await tokenResponse.json();

    if (result.error) {
      return new Response(`Erreur GitHub : ${result.error_description}`, { status: 400 });
    }

    // --- ÉTAPE 3 : RETOUR AU CMS VIA POSTMESSAGE ---
    // Sveltia CMS attend un script qui fait window.opener.postMessage
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification réussie</title></head>
      <body>
        <script>
          const receiveMessage = (message) => {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: result.access_token,
                provider: 'github',
              })}',
              message.origin
            );
          };
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        </script>
      </body>
      </html>
    `;

    return new Response(content, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (e) {
    return new Response(`Erreur Interne : ${e.message}`, { status: 500 });
  }
}

const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // Only process POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const submission = body.payload.data;
    
    // Check if the form is 'adhesion-2025'
    if (body.payload.form_name !== "adhesion-2025") {
      return { statusCode: 200, body: "Form ignored" };
    }

    const { nom, prenom, email, tel, entreprise, fonction, contrat, temps, cotisation, frequence } = submission;
    
    // Prepare the JSON content
    const date = new Date().toISOString();
    const fileName = `${date.split('T')[0]}-${nom.toLowerCase()}-${prenom.toLowerCase()}.json`;
    const filePath = `src/content/adhesions/${fileName}`;
    const content = JSON.stringify({
      nom, prenom, email, tel, entreprise, fonction, contrat, temps, cotisation, frequence, date
    }, null, 2);

    // Initialize Octokit with the Personal Access Token (stored in ENV)
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const [owner, repo] = process.env.REPOSITORY_PATH ? process.env.REPOSITORY_PATH.split('/') : ["samiranks", "USDTL31-Astro"];

    console.log(`Saving submission to ${owner}/${repo} at ${filePath}`);

    // Create the file in the GitHub repository
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `New membership submission: ${nom} ${prenom}`,
      content: Buffer.from(content).toString("base64"),
      branch: "main"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Submission encoded and saved to Git" })
    };
  } catch (error) {
    console.error("Submission processing error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

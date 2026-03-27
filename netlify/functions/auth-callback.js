exports.handler = async (event, context) => {
  const { code } = event.queryStringParameters || {};

  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No code provided' }) };
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.URL + '/auth/callback';

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      return {
        statusCode: 302,
        headers: { Location: `/?error=${encodeURIComponent(tokens.error_description || tokens.error)}` },
      };
    }

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();

    // Redirect back with tokens in URL fragment (never hits server logs)
    const fragment = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || '',
      email: user.email || '',
    });

    return {
      statusCode: 302,
      headers: { Location: `/?connected=true#${fragment}` },
    };
  } catch (err) {
    return {
      statusCode: 302,
      headers: { Location: `/?error=${encodeURIComponent(err.message)}` },
    };
  }
};

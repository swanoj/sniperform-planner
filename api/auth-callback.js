module.exports = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const host = `https://${req.headers.host}`;
  const redirectUri = host + '/api/auth-callback';

  try {
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
      return res.redirect(302, `/?error=${encodeURIComponent(tokens.error_description || tokens.error)}`);
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();

    const params = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || '',
      email: user.email || '',
    });

    return res.redirect(302, `/?${params.toString()}`);
  } catch (err) {
    return res.redirect(302, `/?error=${encodeURIComponent(err.message)}`);
  }
};

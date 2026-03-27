module.exports = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const host = `https://${req.headers.host}`;
  const redirectUri = host + '/api/auth-callback';

  const scope = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ url });
};

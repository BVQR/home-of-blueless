const CLIENT_ID = 'Ov23li7e35OSF4QtBQGj';

export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: context.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  const postMessage = data.error
    ? `authorization:github:error:${JSON.stringify({ error: data.error })}`
    : `authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}`;

  const html = `<!DOCTYPE html><html><body><script>
(function() {
  window.opener.postMessage('${postMessage}', '*');
  window.close();
})();
</script></body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

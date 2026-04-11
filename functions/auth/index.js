const CLIENT_ID = 'Ov23li7e35OSF4QtBQGj';

export async function onRequestGet() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: 'repo,user',
  });
  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}

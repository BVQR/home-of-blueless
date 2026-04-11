// GitHub OAuth proxy for Sveltia CMS
// 部署方式：粘贴到 Cloudflare Worker 编辑器，设置两个 Secret 变量即可

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 允许跨域
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://home.bluelessfun.xyz',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Step 1: 跳转到 GitHub 授权页
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
      });
      return Response.redirect(`${GITHUB_OAUTH_URL}?${params}`, 302);
    }

    // Step 2: GitHub 回调，用 code 换 token
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing OAuth code', { status: 400 });
      }

      const tokenRes = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();

      const postMsg = data.error
        ? `authorization:github:error:${JSON.stringify({ error: data.error })}`
        : `authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}`;

      const html = `<!DOCTYPE html><html><body><script>
(function() {
  window.opener.postMessage('${postMsg}', 'https://home.bluelessfun.xyz');
  window.close();
})();
</script></body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

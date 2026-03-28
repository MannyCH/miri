/**
 * Vercel Edge Middleware — Neon Auth Proxy
 *
 * Safari ITP (Intelligent Tracking Prevention) blocks cross-domain cookies
 * from *.neon.tech when the app is on *.vercel.app.
 *
 * Fix: proxy all /neon-auth/* requests through our own domain so the browser
 * sees cookies as same-site and ITP never triggers.
 *
 * Key operation: strip the "Domain=..." attribute from Set-Cookie response
 * headers so the browser sets cookies for the current host (miri-meal.vercel.app
 * or a preview URL) instead of *.neon.tech.
 *
 * NEON_AUTH_BASE_URL is injected automatically per deployment by the
 * Neon-Vercel integration (preview branches get their own auth instance).
 */

export const config = {
  matcher: '/neon-auth/:path*',
};

export default async function middleware(request) {
  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!authBaseUrl) {
    return new Response(JSON.stringify({ error: 'Auth proxy not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);

  // Strip the /neon-auth prefix to get the actual Neon Auth path
  const targetPath = url.pathname.replace(/^\/neon-auth/, '') || '/';
  const targetUrl = `${authBaseUrl}${targetPath}${url.search}`;

  // Forward all request headers except host
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('host', new URL(authBaseUrl).host);

  // Read body once for methods that have one
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers: forwardHeaders,
    body: hasBody ? request.body : undefined,
    // @ts-ignore — duplex is required for streaming request bodies
    duplex: hasBody ? 'half' : undefined,
  });

  // Copy response headers, rewriting Set-Cookie domain
  const responseHeaders = new Headers(upstream.headers);

  const setCookies = upstream.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    responseHeaders.delete('set-cookie');
    for (const cookie of setCookies) {
      // Strip Domain attribute so the browser uses the current host
      const rewritten = cookie.replace(/;\s*[Dd]omain=[^;,]+/g, '');
      responseHeaders.append('set-cookie', rewritten);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

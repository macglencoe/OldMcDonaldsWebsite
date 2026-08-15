export const TURNSTILE_ACTION = 'vendor_application';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const ALWAYS_PASS_TEST_SECRET = '1x0000000000000000000000000000000AA';
const MAX_TOKEN_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 10_000;

export function parseExpectedHostnames(value) {
  return new Set(String(value || '')
    .split(',')
    .map(hostname => hostname.trim().toLowerCase())
    .filter(Boolean));
}

export async function verifyVendorTurnstile({
  token,
  remoteIp,
  fetchImpl = globalThis.fetch,
  secretKey = process.env.TURNSTILE_SECRET_KEY,
  expectedHostnames = process.env.TURNSTILE_EXPECTED_HOSTNAMES || process.env.TURNSTILE_EXPECTED_HOSTNAME,
  nodeEnv = process.env.NODE_ENV,
} = {}) {
  if (!secretKey || typeof fetchImpl !== 'function') {
    return { ok: false, category: 'configuration', reason: 'Turnstile is not configured.' };
  }
  const allowedHostnames = expectedHostnames instanceof Set
    ? new Set([...expectedHostnames].map(hostname => String(hostname).trim().toLowerCase()).filter(Boolean))
    : parseExpectedHostnames(expectedHostnames);
  if (!allowedHostnames.size) {
    return { ok: false, category: 'configuration', reason: 'Turnstile hostname allowlist is empty.' };
  }
  const usesTestSecret = secretKey === ALWAYS_PASS_TEST_SECRET;
  if (usesTestSecret && nodeEnv === 'production') {
    return { ok: false, category: 'configuration', reason: 'Turnstile test credentials cannot be used in production.' };
  }
  if (typeof token !== 'string' || !token.trim() || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, category: 'challenge', reason: 'Turnstile token is missing or invalid.' };
  }

  const formData = new URLSearchParams({ secret: secretKey, response: token.trim() });
  if (remoteIp) formData.set('remoteip', remoteIp);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  let result;
  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      return { ok: false, category: 'unavailable', reason: `Turnstile returned HTTP ${response.status}.` };
    }
    result = await response.json();
  } catch (error) {
    return {
      ok: false,
      category: 'unavailable',
      reason: error?.name === 'AbortError' ? 'Turnstile verification timed out.' : 'Turnstile verification failed.',
    };
  } finally {
    clearTimeout(timeout);
  }

  if (result?.success !== true) {
    return { ok: false, category: 'challenge', reason: 'Turnstile rejected the token.' };
  }
  if (usesTestSecret) {
    if (result?.metadata?.result_with_testing_key !== true) {
      return { ok: false, category: 'challenge', reason: 'Turnstile did not confirm a testing-key response.' };
    }
    return { ok: true, hostname: result.hostname || 'testing' };
  }
  if (result.action !== TURNSTILE_ACTION) {
    return { ok: false, category: 'challenge', reason: 'Turnstile action did not match.' };
  }
  const hostname = typeof result.hostname === 'string' ? result.hostname.trim().toLowerCase() : '';
  if (!allowedHostnames.has(hostname)) {
    return { ok: false, category: 'challenge', reason: 'Turnstile hostname did not match.' };
  }

  return { ok: true, hostname };
}

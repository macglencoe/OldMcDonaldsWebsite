import { createStatsigAdapter } from '@flags-sdk/statsig';

const STATSIG_ID_COOKIE = 'statsig-stable-id';
const statsigEnvironment = process.env.STATSIG_ENV_STRING?.trim();

/**
 * Shared Statsig adapter instance configured for the current environment.
 */
export const statsigAdapter = createStatsigAdapter({
  statsigServerApiKey: process.env.STATSIG_SERVER_API_KEY ?? '',
  statsigOptions: statsigEnvironment ? { environment: { tier: statsigEnvironment } } : undefined,
});

/**
 * Build the Statsig user object the server SDK requires for evaluations.
 *
 * @param {{headers?:Headers,cookies?:import('next/headers').RequestCookies}} context
 * @returns {{userID:string, ip?:string, userAgent?:string, custom?:{vercelId?:string}}}
 */
export function identifyStatsigUser({ headers, cookies }) {
  const cookieId = cookies?.get(STATSIG_ID_COOKIE)?.value;
  const forwardedFor = headers?.get('x-forwarded-for') ?? '';
  const ip = forwardedFor.split(',')[0]?.trim() || undefined;
  const vercelId = headers?.get('x-vercel-id') ?? headers?.get('x-request-id') ?? undefined;
  const userAgent = headers?.get('user-agent') ?? undefined;
  const userID = cookieId ?? vercelId ?? ip ?? 'anonymous';

  const statsigUser = { userID };

  if (ip) {
    statsigUser.ip = ip;
  }

  if (userAgent) {
    statsigUser.userAgent = userAgent;
  }

  if (vercelId) {
    statsigUser.custom = { vercelId };
  }

  return statsigUser;
}

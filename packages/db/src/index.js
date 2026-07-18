import 'server-only';

import { neon } from '@neondatabase/serverless';

let sqlClient;

/**
 * Return the shared Neon SQL client for the current server process.
 *
 * Initialization is lazy so builds that do not query the database do not need
 * a live connection. OLDMC_DATABASE_URL can pin coordinated preview apps to
 * the same Neon branch; otherwise the integration-managed DATABASE_URL is
 * used. Both values are intentionally read only on the server.
 */
export function getDatabase() {
  if (sqlClient) {
    return sqlClient;
  }

  const databaseUrl =
    process.env.OLDMC_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error('OLDMC_DATABASE_URL or DATABASE_URL is required to access the database.');
  }

  sqlClient = neon(databaseUrl);
  return sqlClient;
}

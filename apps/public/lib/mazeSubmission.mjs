export function buildMazeSubmission({ name, phone, usingDatabase }) {
  if (usingDatabase) {
    return {
      endpoint: '/api/forms/maze-entry',
      payload: { name, phone },
    };
  }

  return {
    endpoint: '/api/email',
    payload: {
      kind: 'maze',
      text: `Name: ${name}\nPhone Number: ${phone}`,
      html: `<p>Name: ${name}</p><p>Phone Number: ${phone}</p>`,
    },
  };
}

export function shouldEnableMazeFallback({ usingDatabase, status, code, error }) {
  const databaseUnavailable = usingDatabase && (
    status >= 500 ||
    code === 'DATABASE_ERROR'
  );
  const serviceLimited = (
    status === 429 ||
    ['LIMIT_EXCEEDED', 'RATE_LIMITED'].includes(code) ||
    /limit|quota|rate|daily/i.test(String(error))
  );

  return databaseUnavailable || serviceLimited;
}

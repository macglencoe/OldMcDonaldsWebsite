function sanitizeNotes(rawNotes) {
  if (!Array.isArray(rawNotes)) {
    return [];
  }
  return rawNotes
    .map((note) => (typeof note === 'string' ? note.trim() : ''))
    .filter(Boolean);
}

function sanitizePriceEntry(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const rawAmount = typeof raw.amount === 'string' ? raw.amount.trim() : raw.amount;
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount)) {
    return null;
  }

  const per = typeof raw.per === 'string' && raw.per.trim() ? raw.per.trim() : undefined;
  const notes = sanitizeNotes(raw.notes);

  return {
    amount,
    ...(per ? { per } : {}),
    notes,
  };
}

function sanitizePricingRecord(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const entries = Object.entries(raw).reduce((acc, [key, value]) => {
    const sanitized = sanitizePriceEntry(value);
    if (sanitized) {
      acc[key] = sanitized;
    }
    return acc;
  }, {});

  return Object.keys(entries).length > 0 ? entries : null;
}

function clonePricingRecord(record) {
  if (!record || typeof record !== 'object') {
    return {};
  }
  return Object.entries(record).reduce((acc, [key, value]) => {
    acc[key] = {
      amount: value.amount,
      per: value.per,
      notes: Array.isArray(value.notes) ? [...value.notes] : [],
    };
    return acc;
  }, {});
}

export function normalizePricing(raw) {
  const sanitized = sanitizePricingRecord(raw);
  return sanitized ? clonePricingRecord(sanitized) : {};
}

export function getPriceValue(pricing, key) {
  if (!pricing || typeof pricing !== 'object') {
    return undefined;
  }
  const entry = pricing[key];
  if (!entry) {
    return undefined;
  }
  return {
    amount: entry.amount,
    per: entry.per,
    notes: Array.isArray(entry.notes) ? [...entry.notes] : [],
  };
}

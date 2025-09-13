"use client";

// Unified analytics track function: forwards to Vercel and Statsig.
// Usage: import { track } from '@/utils/analytics'

import { track as vercelTrack } from '@vercel/analytics';

// Best-effort send to Statsig; if the client isn't ready yet, queue events.
function sendToStatsig(name, props) {
  try {
    const g = globalThis;
    const client = g && g.__statsigClient;
    if (client && typeof client.logEvent === 'function') {
      client.logEvent(name, undefined, props || undefined);
      return;
    }
    // Queue until client becomes available
    const q = (g.__statsigQueue ||= []);
    q.push({ name, props });
  } catch {
    // noop
  }
}

export function track(name, props) {
  try {
    vercelTrack(name, props);
  } catch {
    // ignore Vercel analytics errors
  }
  sendToStatsig(name, props);
}


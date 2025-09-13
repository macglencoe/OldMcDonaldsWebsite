"use client";

import React, { useEffect } from "react";
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';
import { StatsigSessionReplayPlugin } from '@statsig/session-replay';


export default function MyStatsig({ children }) {
  const { client } = useClientAsyncInit(
    "client-uYWDoug6fdLQ1niTe32T6wnbe8XgPpISu2CoPgRa97B",
    { userID: 'a-user' }, 
    { plugins: [ new StatsigAutoCapturePlugin(), new StatsigSessionReplayPlugin() ] },
  );

  // Expose client globally for non-hook callers and drain queued events
  useEffect(() => {
    if (!client) return;
    try {
      const g = globalThis;
      g.__statsigClient = client;
      if (Array.isArray(g.__statsigQueue) && g.__statsigQueue.length) {
        const queue = g.__statsigQueue.splice(0);
        for (const evt of queue) {
          try {
            client.logEvent(evt.name, undefined, evt.props || undefined);
          } catch {}
        }
      }
    } catch {
      // ignore
    }
  }, [client]);

  return (
    <StatsigProvider client={client} loadingComponent={<div>Loading...</div>}>
      {children}
    </StatsigProvider>
  );
}

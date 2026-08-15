"use client";

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (
  process.env.NODE_ENV === 'production' ? '0x4AAAAAAEQc-B6BYgrnlJwQ' : '1x00000000000000000000AA'
);
const TURNSTILE_ACTION = 'vendor_application';

export default function TurnstileWidget({ onTokenChange, onVerificationError, resetKey }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current !== null) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      action: TURNSTILE_ACTION,
      appearance: process.env.NODE_ENV === 'production' ? 'interaction-only' : 'always',
      size: 'flexible',
      theme: 'auto',
      callback: token => onTokenChange(token),
      'expired-callback': () => onTokenChange(''),
      'error-callback': () => {
        onTokenChange('');
        onVerificationError();
      },
    });
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [onTokenChange, onVerificationError, resetKey, scriptReady]);

  return <>
    <Script
      id="cloudflare-turnstile"
      onLoad={() => setScriptReady(true)}
      onReady={() => setScriptReady(true)}
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
    />
    <div className="min-h-[65px]" ref={containerRef} />
  </>;
}

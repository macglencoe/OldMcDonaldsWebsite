'use client'

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@vercel/analytics';

export default function QrTracker() {
    const searchParams = useSearchParams();
    const hasTracked = useRef(false);

    useEffect(() => {
        const source = searchParams?.get('source')
        if (source == 'qr' && !hasTracked.current) {
            track('qr_scan');
            hasTracked.current = true;
        }
    }, searchParams)
}
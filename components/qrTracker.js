'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'

export default function QrTracker() {
    const searchParams = useSearchParams()
    const source = searchParams?.get('source')

    useEffect(() => {
        if (source !== 'qr' || sessionStorage.getItem('qr-source') === '1') return
        track('qr_scan', { source: 'qr' })
        sessionStorage.setItem('qr-source', '1')
    }, [source])

    return null
}
'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'

export default function QrTracker() {
    const searchParams = useSearchParams()
    const source = searchParams?.get('source')
    const hasTracked = useRef(false)

    useEffect(() => {
        if (source !== 'qr' || hasTracked.current) return
        track('qr_scan', { source: 'qr' })
        hasTracked.current = true
    }, [source])

    return null
}

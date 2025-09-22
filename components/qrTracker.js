'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'

export default function QrTracker() {
    const searchParams = useSearchParams()

    useEffect(() => {
        const source = searchParams?.get('source')
        if (source === 'qr') {
            track('qr_scan')
        }
    }, [searchParams])

    return null
}

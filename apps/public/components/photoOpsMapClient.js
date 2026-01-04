'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const MapWithNoSSR = dynamic(() => import('./photoOpsMapInner'), {
  ssr: false,
})

export default function PhotoOpsMapClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <MapWithNoSSR /> : <div>Loading map...</div>
}

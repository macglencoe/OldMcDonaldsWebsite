"use client"
import clsx from 'clsx'
import Image from 'next/image'
import path from 'path'
import { MapPinLine, MarkerCircle } from 'phosphor-react'
import { useState } from 'react'

export default function PhotoOpsListClient({ photoOps }) {
    return (
        <div className='grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative'>
            {photoOps.map((op, i) => (
                <Photo alt={op.label} src={op.imgSrc && path.posix.join('/photo-ops/', op.imgSrc)} pos={op.pos} key={i}/>
            ))}
        </div>
    )
}

function Photo({ src, alt, pos }) {
    const size = 32;
    const [hoveringPos, setHoveringPos] = useState(false);
    return (
        <div className={`aspect-square relative rounded overflow-hidden shadow-lg group hover:scale-105 transition-transform flex items-center justify-center bg-foreground/20 text-foreground/50`}>
            {src &&
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className='object-cover rounded'
                />
            }
            {!src &&
                <p className='text-center'>
                    <strong>{alt}</strong>
                    <br />
                    <em>Doesn&apos;t have a photo yet!</em>
                    <br />
                    <a className="!break-normal" href='#upload'>Be the first to upload one!</a>
                </p>
            }
            { pos &&
                <div onMouseEnter={() => setHoveringPos(true)} onMouseLeave={() => setHoveringPos(false)} className='absolute top-0 right-0 m-1 p-1 rounded-full bg-foreground/30 hover:bg-foreground/50 transition-colors flex items-center justify-center space-x-1 text-xs'>
                    {hoveringPos &&
                        <div className='mx-4 text-xs text-white'>
                            <span >View on map:</span><br />
                            <span><strong>{alt}</strong></span>
                        </div>
                    }
                    <a href={`/map?x=${pos[0]}&y=${pos[1]}`}>
                        <MapPinLine size={size} color='white' weight='bold' />
                    </a>
                </div>
            }
        </div>
    )
}

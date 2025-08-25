"use client"
import path from 'path'
import Photo from './photoClient'

export default function PhotoOpsListClient({ photoOps }) {
    return (
        <div className='grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative'>
            {photoOps.map((op) => (
                <Photo alt={op.label} src={op.imgSrc && path.posix.join('/photo-ops/', op.imgSrc)} pos={op.pos}/>
            ))}
        </div>
    )
}


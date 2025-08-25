"use client"

import { ArrowRight, UploadSimple } from "phosphor-react"

export default function UploadSectionClient({ uploadUrl, title, subtitle, id }) {
    return (
        <section id={id} className='mt-8 p-4 border border-accent/50 rounded shadow-lg bg-foreground/10 flex'>
            <div className='flex-1 space-y-2 flex justify-center flex-col'>
                <h3 className='text-2xl text-accent font-bold !font-[Inter]'>{title}</h3>
                <p className='text-foreground/70 !text-xl'>{subtitle} <ArrowRight size={23} color='var(--accent)' weight='bold' className="inline"/></p>
            </div>
            <div className="flex items-center justify-center">
                <a href={uploadUrl} className="group flex items-center gap-3 text-accent font-bold !font-[Inter] border border-accent/50 rounded px-4 py-2 hover:bg-accent/10 transition-colors">
                    <UploadSimple size={32} color='var(--accent)' weight='bold' className='group-hover:scale-110 transition-transform'/>
                    Upload
                </a>
            </div>
        </section>
    )
}
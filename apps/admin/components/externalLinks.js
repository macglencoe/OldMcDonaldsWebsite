"use client";

import { ArrowSquareOut} from "phosphor-react";



export default function ExternalLinks({items}) {
    return (
        <div className="flex flex-row flex-wrap gap-4 mb-8 w-full justify-evenly">
            {items.map((item, index) => (
                <a key={index} href={item.url} className="block hover:underline" target="_blank" rel="noopener noreferrer">
                    {item.name}
                    <ArrowSquareOut size={16} className="inline-block ml-1 mb-1" />
                </a>
            ))}
        </div>
    )
}
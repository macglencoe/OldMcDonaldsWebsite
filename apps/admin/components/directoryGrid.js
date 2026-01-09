"use client";

import Link from "next/link";

export default function DirectoryGrid({ items }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                items.map((item) => (
                    <Link href={item.url} key={item.name} target={item.target || "_self"} className="m-3 p-5 bg-accent/80 border-background/50 border-2 rounded-2xl hover:bg-accent transition-colors duration-200 group">
                        <h3 className="text-xl font-medium text-white group-hover:underline">{item.name}</h3>
                    </Link>
                ))
            }
        </div>
    )
}
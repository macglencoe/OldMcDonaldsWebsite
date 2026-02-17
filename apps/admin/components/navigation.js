"use client";

import { Navbar } from "@ui/navbar";


export default function Navigation() {
    return (
        <Navbar 
          titleText={"OMPP Admin"}
          items={[
            
          ]}
          auxiliaryItems={[
            {
                href: "https://oldmcdonaldspumpkinpatch.com",
                label: "Public Site",
                children: <span className="text-white font-semibold px-1">Public Site</span>
            },
            {
                href: "https://ops.oldmcdonaldspumpkinpatch.com",
                label: "Staff Tools",
                children: <span className="text-white font-semibold px-1">Staff Tools</span>
            }
          ]}
        />
    )
}
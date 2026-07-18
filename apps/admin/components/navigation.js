"use client";

import { Navbar } from "@ui/navbar";

const PRIMARY_KEYS = new Set(["maze-entries"]);

export default function Navigation() {
    return (
        <Navbar 
          titleText={"OMPP Admin"}
          primaryKeys={PRIMARY_KEYS}
          items={[
            {
              key: "maze-entries",
              path: "/maze-entries",
              title: "Maze Entries"
            }
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

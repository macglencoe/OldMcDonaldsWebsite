"use client";

import { Navbar } from "@ui/navbar";

const PRIMARY_KEYS = new Set(["bookings", "maze-entries", "reservation-requests", "vendor-applications"]);

export default function Navigation() {
    return (
        <Navbar 
          titleText={"OMPP Admin"}
          primaryKeys={PRIMARY_KEYS}
          items={[
            {
              key: "bookings",
              path: "/bookings",
              title: "Bookings"
            },
            {
              key: "maze-entries",
              path: "/maze-entries",
              title: "Maze Entries"
            },
            {
              key: "reservation-requests",
              path: "/reservation-requests",
              title: "Reservation Requests"
            },
            {
              key: "vendor-applications",
              path: "/vendor-applications",
              title: "Vendor Applications"
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

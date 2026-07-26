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
              key: "maze-entries",
              path: "/maze-entries",
              title: "Maze Entries"
            },
            {
              key: "bookings",
              path: "/bookings",
              title: "Bookings"
            },
            {
              key: "reservation-requests",
              path: "/reservation-requests",
              title: "Reservation Requests"
            }
          ]}
          auxiliaryItems={[
            {
                href: "https://oldmcdonaldspumpkinpatch.com",
                label: "Public Site",
                children: <span className="text-white font-semibold px-1">Public Site</span>
            }
          ]}
        />
    )
}

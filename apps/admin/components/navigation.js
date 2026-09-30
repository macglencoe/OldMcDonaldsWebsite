"use client";

import { Navbar } from "@ui/navbar";

const PRIMARY_KEYS = new Set(["hayrides", "bookings", "maze-entries", "reservation-requests", "campfire-requests", "vendor-applications"]);

export default function Navigation() {
    return (
        <Navbar 
          titleText={"OMPP Admin"}
          primaryKeys={PRIMARY_KEYS}
          items={[
            {
              key: "hayrides",
              path: "/hayrides",
              title: "Hayrides"
            },
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
              title: "Gazebo Requests"
            },
            {
              key: "campfire-requests",
              path: "/campfire-requests",
              title: "Campfire Requests"
            }
          ]}
          actionItem={{
            href: "https://oldmcdonaldspumpkinpatch.com",
            title: "Public Site",
            external: true
          }}
        />
    )
}

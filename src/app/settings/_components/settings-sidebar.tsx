"use client"
import { BiListCheck } from "@react-icons/all-files/bi/BiListCheck"
import { VerticalNav } from "@/components/ui/vertical-nav"
import React from "react"
import { usePathname } from "next/navigation"
import { BiPlay } from "@react-icons/all-files/bi/BiPlay"
import { ImConnection } from "@react-icons/all-files/im/ImConnection"

export function SettingsSidebar() {

    const pathname = usePathname()

    return (
        <VerticalNav
            items={[
                {
                    href: "/settings",
                    icon: BiListCheck,
                    isCurrent: pathname === "/settings",
                    name: "My library",
                },
                {
                    href: "/settings/player",
                    icon: BiPlay,
                    isCurrent: pathname === "/settings/player",
                    name: "Video player",
                },
                {
                    href: "/settings/qbittorrent",
                    icon: ImConnection,
                    isCurrent: pathname === "/settings/qbittorrent",
                    name: "qBittorent",
                },
            ]}
        />
    )

}

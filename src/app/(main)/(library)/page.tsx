"use client"

import React from "react"
import { useSettings } from "@/atoms/settings"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppLayoutStack } from "@/components/ui/app-layout"
import { LocalLibrary } from "@/app/(main)/(library)/_components/local-library"
import { LibraryToolbar } from "@/app/(main)/(library)/_components/library-toolbar"

export default function Home() {

    const { settings } = useSettings()

    if (!settings.library.localDirectory) return (
        <AppLayoutStack className={"mt-10"}>
            {<div
                className="h-[15rem] w-[15rem] mx-auto flex-none rounded-md object-cover object-center relative overflow-hidden">
                <Image
                    src={"/luffy-01.png"}
                    alt={""}
                    fill
                    quality={100}
                    priority
                    sizes="10rem"
                    className="object-contain object-top"
                />
            </div>}
            <div className={"text-center space-y-4"}>
                <h2>Local library</h2>
                <p>First, you need to select your local library directory in the settings.</p>
                <div>
                    <Link href={"/settings"}>
                        <Button intent={"warning-subtle"}>Choose the directory</Button>
                    </Link>
                </div>
            </div>
        </AppLayoutStack>
    )

    return (
        <main>
            <LibraryToolbar/>
            <LocalLibrary/>
            {/*Hello*/}
            {/*<Button onClick={async () => VideoPlayer(settings).start()}>Start video player</Button>*/}
            {/*<Button*/}
            {/*    onClick={async () => await VideoPlayer(settings).openVideo("E:\\ANIME\\[EMBER] Kaguya-sama wa Kokurasetai - First Kiss wa Owaranai (Movie) [1080p] [HEVC WEBRip].mkv")}>Load*/}
            {/*    Kaguya-sama</Button>*/}
        </main>
    )
}
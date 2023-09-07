"use client"
import React from "react"
import { AnilistDetailedMedia } from "@/lib/anilist/fragment"
import { Divider } from "@/components/ui/divider"
import { BiCalendarAlt } from "@react-icons/all-files/bi/BiCalendarAlt"
import { BiDownload } from "@react-icons/all-files/bi/BiDownload"
import Link from "next/link"
import { ConsumetAnimeEpisodeData } from "@/lib/consumet/types"
import { BiPlayCircle } from "@react-icons/all-files/bi/BiPlayCircle"
import { useDownloadPageData } from "@/lib/download/helpers"
import { EpisodeListItem } from "@/components/shared/episode-list-item"
import { useSetAtom } from "jotai"
import { __torrentSearch_isOpenAtom } from "@/app/(main)/view/_containers/torrent-search/torrent-search-modal"

interface UndownloadedEpisodeListProps {
    children?: React.ReactNode
    media: AnilistDetailedMedia
    aniZipData?: AniZipData
    consumetEpisodeData?: ConsumetAnimeEpisodeData | null
}

export const UndownloadedEpisodeList: React.FC<UndownloadedEpisodeListProps> = React.memo((props) => {

    const { children, media, aniZipData, consumetEpisodeData, ...rest } = props

    const setTorrentSearchIsOpen = useSetAtom(__torrentSearch_isOpenAtom)

    const {
        downloadInfo,
    } = useDownloadPageData(media)

    if (!aniZipData || Object.keys(aniZipData?.episodes).length === 0 || (downloadInfo.toDownload === 0)) return null

    return (
        <>
            <Divider/>
            <div className={"space-y-2"}>
                <h3>Not downloaded</h3>
                <p className={"text-[--muted]"}>
                    {downloadInfo.rewatch ? "You have not downloaded the following" : "You have not watched nor downloaded the following"}
                </p>
            </div>
            <div className={"grid grid-cols-2 gap-4 opacity-60"}>
                {downloadInfo.episodeNumbers.map((epNumber, index) => {
                    const airDate = aniZipData?.episodes?.[String(epNumber)]?.airdate
                    const consumetEpisode = consumetEpisodeData?.find(n => n.number === epNumber)
                    return (
                        <EpisodeListItem
                            media={media}
                            key={epNumber + index}
                            title={media.format !== "MOVIE" ? `Episode ${epNumber}` : media.title?.userPreferred || ""}
                            showImagePlaceholder
                            episodeTitle={aniZipData?.episodes?.[String(epNumber)]?.title?.en}
                            image={consumetEpisode?.image || aniZipData?.episodes?.[String(epNumber)]?.image}
                            action={
                                <div className={""}>
                                    <a
                                        onClick={() => setTorrentSearchIsOpen({ isOpen: true, episode: epNumber })}
                                        className={"text-orange-200 absolue top-1 right-1 text-3xl absolute animate-pulse cursor-pointer"}>
                                        <BiDownload/>
                                    </a>
                                    <Link
                                        href={`/watch/${media.id}?episode=${epNumber}`}
                                        className={"text-gray-50 absolue top-10 right-1 text-3xl absolute"}>
                                        <BiPlayCircle/>
                                    </Link>
                                </div>
                            }
                        >
                            <div className={"mt-1"}>
                                <p className={"flex gap-1 items-center text-sm text-[--muted]"}>
                                    <BiCalendarAlt/> {airDate ? `Aired on ${new Date(airDate).toLocaleDateString()}` : "Aired"}
                                </p>
                            </div>
                        </EpisodeListItem>
                    )
                })}
            </div>
        </>
    )

})

"use client"
import { AnilistDetailedMedia } from "@/lib/anilist/fragment"
import React, { startTransition, useEffect, useMemo, useState } from "react"
import { unstable_findNyaaTorrents, unstable_handleSearchTorrents } from "@/lib/download/nyaa/search"
import { SearchTorrent } from "@/lib/download/nyaa/api/types"
import { createDataGridColumns, DataGrid } from "@/components/ui/datagrid"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { atom } from "jotai"
import { useAtom, useAtomValue } from "jotai/react"
import { Divider } from "@/components/ui/divider"
import { Switch } from "@/components/ui/switch"
import { NumberInput } from "@/components/ui/number-input"
import { useDebounce } from "@/hooks/use-debounce"
import { Button, IconButton } from "@/components/ui/button"
import { cn } from "@/components/ui/core"
import { useMount } from "react-use"
import { Drawer, Modal } from "@/components/ui/modal"
import { useDisclosure } from "@/hooks/use-disclosure"
import { normalizeMediaEpisode } from "@/lib/anilist/actions"
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal"
import { useDownloadPageData } from "@/lib/download/helpers"
import { TorrentList } from "@/app/(main)/view/_containers/torrent-search/_components/torrent-list"
import { useQuery } from "@tanstack/react-query"
import rakun from "@/lib/rakun/rakun"
import { atomWithImmer } from "jotai-immer"

interface Props {
    media: AnilistDetailedMedia,
    aniZipData?: AniZipData
}

type SearchTorrentData = SearchTorrent & { parsed: TorrentInfos }

export const __torrentSearch_selectedTorrentsAtom = atom<SearchTorrentData[]>([])

export const __torrentSearch_isOpenAtom = atomWithImmer<{ isOpen: boolean, episode: number | undefined }>({
    isOpen: false,
    episode: undefined,
})

export const __torrentSearch_sortedSelectedTorrentsAtom = atom((get) => {
    const torrents = get(__torrentSearch_selectedTorrentsAtom)
    if (torrents.every(torrent => !!torrent.parsed.episode)) { // Sort torrents if they all contain an episode number
        return get(__torrentSearch_selectedTorrentsAtom)?.sort((a, b) => Number(a.parsed.episode!) - Number(b.parsed.episode!))
    }
    return torrents
})

export function TorrentSearchModal(props: Props) {

    const [status, setStatus] = useAtom(__torrentSearch_isOpenAtom)

    return <Drawer isOpen={status.isOpen} onClose={() => setStatus(draft => {
        draft.isOpen = false
        return
    })} size={"xl"}>
        <Content media={props.media} aniZipData={props.aniZipData}/>
    </Drawer>

}

export const Content = ({ media, aniZipData }: { media: AnilistDetailedMedia, aniZipData?: AniZipData }) => {


    const {
        entryAtom,
        lastFile,
        downloadInfo,
    } = useDownloadPageData(media)
    const { episode } = useAtomValue(__torrentSearch_isOpenAtom)

    const [globalFilter, setGlobalFilter] = useState<string>("")

    const [selectedTorrents, setSelectedTorrents] = useAtom(__torrentSearch_selectedTorrentsAtom)
    const [quickSearchIsBatch, setQuickSearchIsBatch] = useState<boolean>(downloadInfo.batch || downloadInfo.canBatch)
    const [quickSearchEpisode, setQuickSearchEpisode] = useState<number | undefined>(episode || downloadInfo.episodeNumbers[0])
    const debouncedEpisode = useDebounce(quickSearchEpisode, 500)

    const [episodeOffset, setEpisodeOffset] = useState<number | undefined>(undefined)

    const torrentListModal = useDisclosure(false)

    useMount(() => {
        (async () => {
            if (media && downloadInfo) {
                setSelectedTorrents([])

                const object = await normalizeMediaEpisode({
                    media: media,
                    episode: downloadInfo.episodeNumbers[0],
                    force: true,
                })
                setEpisodeOffset(object?.offset ?? 0)
            }
        })()
    })

    useEffect(() => {
        console.log(downloadInfo)
    }, [downloadInfo])

    const { data: torrents, isLoading, isFetching } = useQuery<SearchTorrentData[]>(
        ["fetching-torrents", media.id, debouncedEpisode, globalFilter, quickSearchIsBatch, episodeOffset],
        async () => {
            let res: SearchTorrent[] | undefined = undefined
            if (globalFilter.length === 0) {
                res = await unstable_findNyaaTorrents({
                    media: media,
                    aniZipData: aniZipData!,
                    episode: quickSearchEpisode!,
                    lastFile: lastFile,
                    batch: quickSearchIsBatch,
                    offset: episodeOffset!,
                })
            } else {
                res = await unstable_handleSearchTorrents(globalFilter)
            }
            return (res?.map(torrent => {
                return { ...torrent, parsed: rakun.parse(torrent.name) }
            }) || []) as SearchTorrentData[]
        }, {
            keepPreviousData: false,
            refetchOnWindowFocus: false,
            retry: 5,
            enabled: episodeOffset !== undefined && !!aniZipData && quickSearchEpisode !== undefined,
        })


    const columns = useMemo(() => createDataGridColumns<SearchTorrentData>(() => [
        {
            accessorKey: "name",
            header: "Name",
            cell: info => <div className={"flex items-center gap-2"}>
                <IconButton
                    icon={<BiLinkExternal/>}
                    intent={"primary-basic"}
                    size={"sm"}
                    onClick={() => window.open("https://nyaa.si" + info.row.original.links.page.replace("#comments", ""), "_blank")}
                />
                <span
                    className={cn(
                        "text-[.95rem] truncate text-ellipsis cursor-pointer",
                        {
                            "text-brand-300 font-semibold": selectedTorrents.some(torrent => torrent.id === info.row.original.id),
                        },
                    )}
                    onClick={() => setSelectedTorrents(draft => {
                        if (!draft.find(torrent => torrent.id === info.row.original.id)) {
                            return [...draft, info.row.original]
                        } else {
                            return draft.filter(torrent => torrent.id !== info.row.original.id)
                        }
                    })}
                >
                    {info.getValue<string>()}
                </span>
            </div>,
            size: 120,
        },
        {
            accessorKey: "file_size_bytes",
            header: "Size",
            cell: info => info.row.original.file_size,
            size: 5,
        },
        {
            id: "_seeders",
            header: "Seeders",
            cell: info => <div className={"text-sm"}>
                {info.row.original.stats.seeders}
            </div>,
            size: 5,
        },
        {
            id: "_quality",
            header: "Quality",
            cell: info => info.row.original?.parsed?.resolution ? <div className={"text-sm"}>
                <Badge intent={info.row.original?.parsed?.resolution?.includes("1080")
                    ? "warning"
                    : (info.row.original?.parsed?.resolution?.includes("2160") || info.row.original?.parsed?.resolution?.toLowerCase().includes("4k"))
                        ? "success"
                        : "gray"}
                >
                    {info.row.original?.parsed?.resolution}
                </Badge>
            </div> : null,
            size: 5,
        },
        {
            id: "_downloads",
            header: "Downloads",
            cell: info => <div className={"text-sm"}>
                {info.row.original.stats.downloaded}
            </div>,
            size: 5,
        },
        {
            accessorKey: "timestamp",
            header: "Date",
            cell: info => <div className={"text-sm"}>
                {formatDistanceToNow(new Date(info.getValue<number>() * 1000), { addSuffix: true })} ({new Date(info.getValue<number>() * 1000).toLocaleDateString()})
            </div>,
            size: 30,
        },
    ]), [torrents, selectedTorrents])


    if (!downloadInfo || !media) return <></>


    return (
        <>
            <div className={"space-y-4 relative"}>

                {/*<Button onClick={handleFindNyaaTorrents}>Search torrents</Button>*/}
                {/*<Button onClick={async () => {*/}
                {/*    console.log(await torrentManager.current.getAllTorrents())*/}
                {/*}}>Test add magnet</Button>*/}

                {selectedTorrents.length > 0 && <div className={"absolute top-0 right-0 z-10"}>
                    <Button onClick={torrentListModal.open}>View selected torrents ({selectedTorrents.length})</Button>
                </div>}

                <div>
                    Episode to
                    download: {downloadInfo.episodeNumbers.slice(0, 12).join(", ")}{downloadInfo.episodeNumbers.length > 12 ? ", ..." : "."}
                </div>

                <div className={"space-y-2"}>
                    <h4>Quick search parameters</h4>
                    <div className={"inline-flex gap-4 items-center"}>
                        <Switch label={"Look for batches"} checked={quickSearchIsBatch}
                                onChange={setQuickSearchIsBatch} labelClassName={"text-md"}/>
                        <NumberInput label={"Episode number"} value={quickSearchEpisode} onChange={(value) => {
                            startTransition(() => {
                                setQuickSearchEpisode(value)
                            })
                        }} discrete size="sm" fieldClassName={"flex items-center justify-center gap-3 space-y-0"}
                                     fieldLabelClassName={"flex-none self-center font-normal !text-md sm:text-md lg:text-md"}/>
                    </div>
                </div>

                <Divider/>
                {/*<EpisodeList aniZipData={props.aniZipData} media={props.media}/>*/}

                <DataGrid<SearchTorrentData>
                    columns={columns}
                    data={torrents?.slice(0, 20)}
                    rowCount={torrents?.length ?? 0}
                    initialState={{
                        pagination: {
                            pageSize: 20,
                            pageIndex: 0,
                        },
                    }}
                    tdClassName={"py-4 data-[row-selected=true]:bg-gray-900"}
                    tableBodyClassName={"bg-transparent"}
                    footerClassName={"hidden"}
                    state={{
                        globalFilter,
                    }}
                    enableManualFiltering={true}
                    onGlobalFilterChange={setGlobalFilter}
                    isLoading={isLoading || isFetching}
                    isDataMutating={isFetching}
                    globalSearchInputProps={{
                        // placeholder:
                    }}
                />


            </div>

            <Modal isOpen={torrentListModal.isOpen} onClose={torrentListModal.close} size={"xl"} isClosable
                   title={"Torrents"}>
                <TorrentList entryAtom={entryAtom} onClose={torrentListModal.close} media={media}/>
            </Modal>
        </>
    )

}

// interface EpisodeListProps {
//     children?: React.ReactNode
//     aniZipData?: AniZipData
//     media: AnilistDetailedMedia
// }
//
// export const EpisodeList: React.FC<EpisodeListProps> = (props) => {
//
//     const { children, media, ...rest } = props
//
//     const selectedTorrents = useAtomValue(sortedSelectedTorrentsAtom)
//
//     if (selectedTorrents.length === 0 || !selectedTorrents.every(n => !!n.parsed.episode)) return null
//
//     return <>
//         <h3>Preview:</h3>
//         <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
//             {selectedTorrents.map(torrent => {
//                 const episodeData = props.aniZipData?.episodes[torrent.parsed.episode || "0"]
//                 return (
//                     <div key={torrent.name}
//                          className={"border border-[--border] p-4 pr-12 rounded-lg relative transition hover:bg-gray-900"}>
//                         <div
//                             className={"flex gap-4 relative cursor-pointer"}
//                         >
//                             {episodeData?.image && <div
//                                 className="h-24 w-24 flex-none rounded-md object-cover object-center relative overflow-hidden">
//                                 <Image
//                                     src={episodeData?.image}
//                                     alt={""}
//                                     fill
//                                     quality={60}
//                                     priority
//                                     sizes="10rem"
//                                     className="object-cover object-center"
//                                 />
//                             </div>}
//
//                             <div className={"space-y-1"}>
//                                 <h4 className={"font-medium"}>Episode {torrent.parsed.episode}</h4>
//                                 {!!episodeData && <p className={"text-sm text-[--muted]"}>{episodeData?.title?.en}</p>}
//                                 {torrent.parsed.resolution && <Badge>{torrent.parsed.resolution}</Badge>}
//                             </div>
//                         </div>
//                     </div>
//                 )
//             })}
//         </div>
//         <Divider/>
//     </>
//
// }
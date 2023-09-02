"use client"
import React, { startTransition } from "react"
import { AnilistDetailedMedia } from "@/lib/anilist/fragment"
import { useLibraryEntryAtomByMediaId } from "@/atoms/library/library-entry.atoms"
import { Divider } from "@/components/ui/divider"
import { ToggleLockStatusButton } from "@/app/(main)/(library)/view/[id]/_components/episodes/toggle-lock-status-button"
import { UtilityButtons } from "@/app/(main)/(library)/view/[id]/_components/episodes/utility-buttons"
import { EpisodeList } from "@/app/(main)/(library)/view/[id]/_components/episodes/episode-list"
import {
    UndownloadedEpisodeList,
} from "@/app/(main)/(library)/view/[id]/download/_components/undownloaded-episode-list"
import { useVideoPlayer } from "@/lib/video-player/use-video-player"
import { useAtom, useSetAtom } from "jotai/react"
import {
    getLocalFileByNameAtom,
    useMainLocalFileAtomsByMediaId,
    useNCLocalFileAtomsByMediaId,
    useSpecialsLocalFileAtomsByMediaId,
} from "@/atoms/library/local-file.atoms"
import { useStableSelectAtom } from "@/atoms/helpers"

import { useAnilistCollectionEntryAtomByMediaId, useWatchedAnilistEntry } from "@/atoms/anilist/entries.atoms"
import { atomWithImmer } from "jotai-immer"
import { LocalFile } from "@/lib/local-library/local-file"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import _ from "lodash"
import { Badge } from "@/components/ui/badge"
import { FiPlayCircle } from "@react-icons/all-files/fi/FiPlayCircle"

interface EpisodeSectionProps {
    children?: React.ReactNode
    detailedMedia: AnilistDetailedMedia
    aniZipData: AniZipData
}

const progressTrackingAtom = atomWithImmer<{ open: boolean, filesWatched: LocalFile[] }>({
    open: false,
    filesWatched: [],
})


export const EpisodeSection: React.FC<EpisodeSectionProps> = React.memo((props) => {

    const { children, detailedMedia, aniZipData, ...rest } = props

    const entryAtom = useLibraryEntryAtomByMediaId(detailedMedia.id)
    const { toWatch, watched } = useMainLocalFileAtomsByMediaId(detailedMedia.id)
    const ovaFileAtoms = useSpecialsLocalFileAtomsByMediaId(detailedMedia.id)
    const ncFileAtoms = useNCLocalFileAtomsByMediaId(detailedMedia.id)
    const collectionEntryAtom = useAnilistCollectionEntryAtomByMediaId(detailedMedia.id)
    const status = useStableSelectAtom(collectionEntryAtom, collectionEntry => collectionEntry?.media?.status)
    const nextUpFilePath = useStableSelectAtom(toWatch[0], file => file?.path)

    const setProgressTracking = useSetAtom(progressTrackingAtom)

    const getFile = useSetAtom(getLocalFileByNameAtom)
    // Video player
    const { playFile } = useVideoPlayer({
        onTick: console.log,
        onVideoComplete: (fileName) => {
            // console.log("video complete", fileName)
            if (!!getFile(fileName)) {
                setProgressTracking(draft => {
                    draft.filesWatched.push(getFile(fileName)!)
                    return
                })
            }
        },
        onFilePlay: () => {
            setProgressTracking(draft => {
                draft.open = true
                return
            })
        },
    })

    if (!entryAtom) {
        return <div className={"space-y-10"}>
            {status !== "NOT_YET_RELEASED" ? <p>Not in your library</p> : <p>Not yet released</p>}
            <UndownloadedEpisodeList media={detailedMedia} aniZipData={aniZipData}/>
        </div>
    }

    return (
        <>
            <div>
                <div className={"mb-8 flex items-center justify-between"}>

                    <div className={"flex items-center gap-8"}>
                        <h2>{detailedMedia.format === "MOVIE" ? "Movie" : "Episodes"}</h2>
                        {watched.length > 0 && toWatch.length > 0 && !!nextUpFilePath && <>
                            <Button
                                size={"lg"}
                                intent={"white"}
                                rightIcon={<FiPlayCircle/>}
                                iconClassName={"text-2xl"}
                                onClick={() => playFile(nextUpFilePath)}
                            >
                                {detailedMedia.format === "MOVIE" ? "Watch" : "Play next episode"}
                            </Button>
                        </>}
                    </div>

                    {!!entryAtom && <div className={"space-x-4 flex items-center"}>
                        <ProgressTrackingButton/>
                        <UtilityButtons entryAtom={entryAtom}/>
                        <ToggleLockStatusButton entryAtom={entryAtom}/>
                    </div>}

                </div>

                {/*TODO: Re-watch now, Continue now, Watch now Button*/}

                <div className={"space-y-10"}>

                    <EpisodeList
                        fileAtoms={toWatch}
                        onPlayFile={playFile}
                        media={detailedMedia}
                        aniZipData={aniZipData}
                    />

                    {watched.length > 0 && <>
                        {toWatch.length > 0 && <Divider/>}
                        <h3>Watched</h3>
                        <EpisodeList
                            fileAtoms={watched}
                            onPlayFile={playFile}
                            media={detailedMedia}
                            aniZipData={aniZipData}
                        />
                    </>}

                    <UndownloadedEpisodeList media={detailedMedia} aniZipData={aniZipData}/>

                    {ovaFileAtoms.length > 0 && <>
                        <Divider/>
                        <h3>Specials</h3>

                        <EpisodeList
                            fileAtoms={ovaFileAtoms}
                            onPlayFile={playFile}
                            media={detailedMedia}
                            aniZipData={aniZipData}
                        />
                    </>}

                    {ncFileAtoms.length > 0 && <>
                        <Divider/>
                        <h3>Others</h3>

                        <EpisodeList
                            fileAtoms={ncFileAtoms}
                            onPlayFile={playFile}
                            media={detailedMedia}
                            aniZipData={aniZipData}
                        />
                    </>}

                </div>
            </div>

            <ProgressTrackingModal media={detailedMedia}/>
        </>
    )
})

interface ProgressTrackingModalProps {
    children?: React.ReactNode
    media: AnilistDetailedMedia
}

export const ProgressTrackingModal: React.FC<ProgressTrackingModalProps> = (props) => {

    const { children, media, ...rest } = props

    const [state, setState] = useAtom(progressTrackingAtom)

    const { watchedEntry } = useWatchedAnilistEntry()

    const files = _.sortBy(state.filesWatched, file => file.metadata.episode)
    const latestFile = files[files.length - 1]

    return <>
        <Modal
            isOpen={state.open}
            onClose={() => setState(draft => {
                draft.open = false
                return
            })}
            title={"Progress"}
            titleClassName={"text-center"}
            isClosable
        >
            <div className={"space-y-4 text-center"}>
                <div className={"text-center text-lg"}>
                    <p>
                        {media.format !== "MOVIE"
                            ? `You've watched ${state.filesWatched.length} episode${state.filesWatched.length === 1 ? "" : "s"}.`
                            : files.length > 0 ? `You have completed ${media.title?.userPreferred}.` : `You haven't completed ${media.title?.userPreferred} yet.`}
                    </p>
                    {media.format !== "MOVIE" && files.length > 0 && !!latestFile && (
                        <p className={"bg-[--background-color] rounded-md text-center p-4 mt-4 text-xl"}>Last episode
                            watched: <Badge size={"lg"}>{latestFile.metadata.episode}</Badge></p>
                    )}
                </div>
                <div className={"flex gap-2 justify-center items-center"}>
                    <Button
                        intent={"success"}
                        isDisabled={state.filesWatched.length === 0}
                        onClick={() => {
                            setState(draft => {
                                draft.open = false
                                draft.filesWatched = []
                                return
                            })
                            startTransition(() => {
                                watchedEntry({
                                    mediaId: media.id,
                                    episode: latestFile.metadata.episode || 1,
                                })
                            })
                        }}
                    >
                        Confirm
                    </Button>
                    <Button intent={"warning-subtle"} onClick={() => {
                        setState(draft => {
                            draft.open = false
                            draft.filesWatched = []
                            return
                        })
                    }}>Cancel</Button>
                </div>
            </div>
        </Modal>
    </>

}
export const ProgressTrackingButton = () => {

    const [state, setState] = useAtom(progressTrackingAtom)

    if (state.filesWatched.length === 0) return null

    return <Button
        intent={"white"}
        className={"animate-pulse"}
        onClick={() => {
            setState(draft => {
                draft.open = true
                return
            })
        }}
    >Progress tracking</Button>

}

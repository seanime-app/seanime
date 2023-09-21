"use server"
import { AnilistShortMedia, AnilistShowcaseMedia } from "@/lib/anilist/fragment"
import similarity from "string-similarity"
import { logger } from "@/lib/helpers/debug"
import { useAniListAsyncQuery } from "@/hooks/graphql-server-helpers"
import { AnimeByIdDocument, AnimeCollectionDocument, UpdateEntryDocument } from "@/gql/graphql"
import fs from "fs"
import { valueContainsNC, valueContainsSeason, valueContainsSpecials } from "@/lib/local-library/utils"
import { ScanLogging } from "@/lib/local-library/logs"
import { LocalFile, LocalFileWithMedia } from "@/lib/local-library/types"
import { hydrateLocalFileWithInitialMetadata } from "@/lib/local-library/local-file"

type ProspectiveLibraryEntry = {
    media: AnilistShowcaseMedia
    acceptedFiles: LocalFileWithMedia[],
    rejectedFiles: LocalFileWithMedia[]
}

/**
 * @description
 * This function inspects all the files that were grouped under a same media
 * - Rejects files with certain arbitrary parameters
 * - Hydrates file metadata (relative episode number, special status...)
 */
export const inspectProspectiveLibraryEntry = async (props: {
    media: AnilistShowcaseMedia,
    files: LocalFileWithMedia[],
    _queriedMediaCache: Map<number, AnilistShortMedia>
    _scanLogging: ScanLogging
}): Promise<ProspectiveLibraryEntry> => {

    const _aniZipCache = new Map<number, AniZipData>

    const { _queriedMediaCache, _scanLogging } = props
    const currentMedia = props.media
    const files = props.files.filter(f => f.media?.id === currentMedia?.id)

    if (files.length && files.length > 0) {

        /* 1. Rate parameters (file's anime title, parent folder's anime title,...) */

        // Return each file with a rating
        const lFilesWithRating = files.map(f => {
            // Get media titles for comparison
            const mediaTitles = [
                currentMedia?.title?.english,
                currentMedia?.title?.romaji,
                currentMedia?.title?.userPreferred,
                ...(currentMedia.synonyms?.filter(valueContainsSeason) || []),
            ].filter(Boolean).map(n => n.toLowerCase())
            // Get the file's parent folder anime title
            const fileFolderTitle = f.parsedFolderInfo.findLast(n => !!n.title)?.title
            // Get the file's anime title
            const fileTitle = f.parsedInfo?.title
            // Get the file's parent folder name
            const fileFolderOriginal = f.parsedFolderInfo.findLast(n => !!n.title)?.original

            let rating = 0
            let ratingByFolderName = 0

            /* Rate how the file's parameters compare to the actual anime title */
            _scanLogging.add(f.path, ">>> [library-entry/inspectProspectiveLibraryEntry]")
            _scanLogging.add(f.path, "Rating file's parameters")

            // Rate the file's parent folder anime title
            if (fileFolderTitle && mediaTitles.length > 0) {
                const bestMatch = similarity.findBestMatch(fileFolderTitle.toLowerCase(), mediaTitles)
                rating = bestMatch.bestMatch.rating
                _scanLogging.add(f.path, `   -> Rating title from parent folder ("${fileFolderTitle}") = ` + rating)
            }
            // Rate the file's anime title
            if (fileTitle && mediaTitles.length > 0) {
                const bestMatch = similarity.findBestMatch(fileTitle.toLowerCase(), mediaTitles)
                rating = bestMatch.bestMatch.rating > rating ? bestMatch.bestMatch.rating : rating
                _scanLogging.add(f.path, `   -> Rating title from file ("${fileTitle}") = ` + rating)
            }
            // Rate the file's parent folder original name
            if (fileFolderOriginal) {
                const bestMatch = similarity.findBestMatch(fileFolderOriginal.toLowerCase(), mediaTitles)
                ratingByFolderName = bestMatch.bestMatch.rating
                _scanLogging.add(f.path, `   -> Rating parent folder name ("${fileFolderOriginal}") = ` + ratingByFolderName)
            }

            _scanLogging.add(f.path, "   -> Final title rating = " + rating + " | Final folder name rating = " + ratingByFolderName)

            return {
                file: f,
                rating: rating,
                ratingByFolderName,
            }
        })
        // Find the highest ratings, that will be the base
        const highestRating = Math.max(...lFilesWithRating.map(item => item.rating))
        const highestRatingByFolderName = Math.max(...lFilesWithRating.map(item => item.ratingByFolderName))

        // We will keep these OVAs, NC,... files even if they don't meet all parameters
        // Why? the folder rating might be very low because they are in a folder named "Specials"
        const containsSpecialsOrNC = (file: LocalFileWithMedia) => {
            return valueContainsSpecials(file.name) || valueContainsNC(file.name)
        }

        // This is meant to filter out files that differ too much from the best matches
        // For example this can help avoid having different season episodes under the same Anime
        let mostAccurateFiles = lFilesWithRating
            // Keep files with a rating greater than 0.3 - This might be meaningless
            .filter(item => item.rating >= 0.3 || containsSpecialsOrNC(item.file))
            // If a file has a lower rating than the highest, filter it out
            .filter(item => item.rating.toFixed(3) === highestRating.toFixed(3) || containsSpecialsOrNC(item.file))
            //
            .filter(item =>
                // Keep files with the highest folder rating
                (item.ratingByFolderName.toFixed(3) === highestRatingByFolderName.toFixed(3))
                // OR files with folder rating deviation from the highest that is lower than 0.1
                || Math.abs(+item.ratingByFolderName.toFixed(3) - +highestRatingByFolderName.toFixed(3)) < 0.1 // deviation is lower than 0.1
                // OR files that are specials, ova...
                || containsSpecialsOrNC(item.file),
            )
            .map(item => item.file)

        for (let i = 0; i < mostAccurateFiles.length; i++) {
            mostAccurateFiles[i] = await hydrateLocalFileWithInitialMetadata({
                file: mostAccurateFiles[i],
                media: currentMedia,
                _cache: _queriedMediaCache,
                _aniZipCache: _aniZipCache,
                _scanLogging,
            }) as LocalFileWithMedia
        }


        const rejectedFiles = files.filter(n => !mostAccurateFiles.find(f => f.path === n.path))

        rejectedFiles.map(f => {
            _scanLogging.add(f.path, `warning - File was un-matched because its parameters were below the thresholds`)
            _scanLogging.add(f.path, `   -> Title rating = ${lFilesWithRating.find(n => n.file.path === f.path)?.rating} | Threshold = ${highestRating}`)
            _scanLogging.add(f.path, `   -> Folder name rating = ${lFilesWithRating.find(n => n.file.path === f.path)?.ratingByFolderName} | Threshold = ${highestRatingByFolderName}`)
        })
        mostAccurateFiles.map(f => {
            _scanLogging.add(f.path, `File was accepted`)
            _scanLogging.add(f.path, `   -> Media ID = ` + (f.mediaId || currentMedia.id))
        })

        _aniZipCache.clear()

        return {
            media: currentMedia, // Unused
            acceptedFiles: mostAccurateFiles,
            rejectedFiles: rejectedFiles,
        }
    }

    _aniZipCache.clear()

    return {
        media: currentMedia,
        acceptedFiles: [],
        rejectedFiles: [],
    }
}

/* -------------------------------------------------------------------------------------------------
 * Rematch
 * -----------------------------------------------------------------------------------------------*/

export async function manuallyMatchFiles(
    files: LocalFile[],
    type: "match" | "ignore",
    userName: string,
    token: string,
    mediaId?: number | undefined,
): Promise<{ error?: string, mediaId?: number, files?: LocalFile[] }> {

    const collectionQuery = await useAniListAsyncQuery(AnimeCollectionDocument, { userName })

    const filePaths = files.map(file => file.path)
    if (filePaths.some(path => !(fs.existsSync(path)))) {
        logger("library-entry/manuallyMatchFiles").error("File does not exist", filePaths.filter(path => !(fs.existsSync(path))))
        return { error: "An error has occurred. Refresh your library entries." }
    }


    if (type === "match") {

        if (mediaId && !isNaN(Number(mediaId))) {

            try {
                const _cache = new Map<number, AnilistShortMedia>
                const _scanLogging = new ScanLogging()

                const data = await useAniListAsyncQuery(AnimeByIdDocument, { id: mediaId }, token)

                if (!data.Media) {
                    return { error: "Could not find the anime on AniList" }
                }

                const animeExistsInUsersWatchList = collectionQuery.MediaListCollection?.lists?.some(list => !!list?.entries?.some(entry => entry?.media?.id === mediaId)) ?? false

                if (!animeExistsInUsersWatchList) {
                    try {
                        const mutation = await useAniListAsyncQuery(UpdateEntryDocument, {
                            mediaId: mediaId, //Int
                            status: "PLANNING", //MediaListStatus
                        }, token)
                    } catch (e) {
                        logger("library-entry/manuallyMatchFiles").error("Error while adding anime to watch list")
                        return { error: "Could not add the anime to your watch list" }
                    }
                }

                const hydratedFiles: LocalFile[] = []

                for (let i = 0; i < files.length; i++) {
                    hydratedFiles.push(await hydrateLocalFileWithInitialMetadata({
                        file: files[i],
                        media: data.Media,
                        _cache,
                        _scanLogging,
                    }))
                    console.log(hydratedFiles)
                }

                _scanLogging.clear()
                _cache.clear()

                // Return media so that the client updates the [LocalFile]s
                return { mediaId: mediaId, files: hydratedFiles }

                // return { error: animeExistsInUsersWatchList ? "Anime exists in list" : "Anime doesn't exist in list" }

            } catch (e) {

                return { error: "Could not find/add the anime on AniList" }
            }

        } else {

            return { error: "Selected anime is incorrect" }

        }

    } else {

        return { error: undefined }

    }

}

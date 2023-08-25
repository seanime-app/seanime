import { AnilistDetailedMedia, AnilistShortMedia, AnilistShowcaseMedia } from "@/lib/anilist/fragment"
import { MediaRelation } from "@/gql/graphql"

type _Edge = { relationType: MediaRelation, node: AnilistShowcaseMedia | null | undefined }

/**
 * Will not work with [AnilistShowcaseMedia]
 */
export function findMediaEdge(media: AnilistShortMedia | null | undefined, relation: MediaRelation, formats = ["TV", "TV_SHORT"], skip: boolean = false): _Edge | undefined {
    let res = (media?.relations?.edges as _Edge[])?.find(edge => {
        if (edge?.relationType === relation) {
            return formats.includes(edge?.node?.format ?? "")
        }
        return false
    })
    // this is hit-miss
    if (!res && !skip && relation === "SEQUEL") {
        res = findMediaEdge(media, relation, formats = ["TV", "TV_SHORT", "OVA"], true)
    }
    return res
}

export function getAnilistMediaTitleList(media: AnilistShortMedia | AnilistDetailedMedia) {
    // group and de-duplicate
    if (!media.title) return undefined

    const grouped = [
        ...new Set(
            Object.values(media.title)
                .concat(media.synonyms ?? [])
                .filter(name => name != null && name.length > 3),
        ),
    ]
    const titles: string[] = []
    const appendTitle = (t: string) => {
        // replace & with encoded
        const title = t.replace(/&/g, "%26").replace(/\?/g, "%3F").replace(/#/g, "%23")
        titles.push(title)

        // replace Season 2 with S2, else replace 2nd Season with S2, but keep the original title
        const match1 = title.match(/(\d)(?:nd|rd|th) Season/i)
        const match2 = title.match(/Season (\d)/i)

        if (match2) {
            titles.push(title.replace(/Season \d/i, `S${match2[1]}`))
        } else if (match1) {
            titles.push(title.replace(/(\d)(?:nd|rd|th) Season/i, `S${match1[1]}`))
        }
    }
    for (const t of grouped) {
        if (t) {
            appendTitle(t)
            if (t.includes("-")) appendTitle(t.replaceAll("-", ""))
        }
    }
    return titles
}
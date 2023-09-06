/* eslint-disable */
import * as types from "./graphql"
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    fragment media on Media {\n        siteUrl\n        id\n        idMal\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        startDate {\n            year\n            month\n            day\n        }\n        endDate {\n            year\n            month\n            day\n        }\n        bannerImage\n        season\n        description\n        type\n        format\n        status(version: 2)\n        episodes\n        duration\n        chapters\n        volumes\n        genres\n        isAdult\n        synonyms\n        averageScore\n        popularity\n        countryOfOrigin\n        mediaListEntry {\n            id\n            status\n        }\n        nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n        }\n        studios(isMain: true) {\n            nodes {\n                name\n            }\n        }\n        relations {\n            edges {\n                relationType(version: 2)\n                node {\n                    ...showcaseMedia\n                }\n            }\n        }\n        meanScore\n        rankings {\n            context\n            type\n            rank\n            year\n            format\n            allTime\n            season\n        }\n        genres\n        studios(isMain: true) {\n            edges {\n                id\n                node {\n                    name\n                    isAnimationStudio\n                }\n            }\n        }\n        recommendations(page: 1, perPage: 8, sort: RATING_DESC) {\n            edges {\n                node {\n                    mediaRecommendation {\n                        id\n                        coverImage {\n                            extraLarge\n                            large\n                            medium\n                            color\n                        }\n                        bannerImage\n                        title {\n                            romaji\n                            english\n                            native\n                            userPreferred\n                        }\n                    }\n                }\n            }\n        }\n    }\n": types.MediaFragmentDoc,
    "\n    fragment shortMedia on Media {\n        id\n        idMal\n        siteUrl\n        status(version: 2)\n        season\n        type\n        format\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        trailer {\n            id\n            site\n            thumbnail\n        }\n        streamingEpisodes {\n            title\n            thumbnail\n            url\n            site\n        }\n        bannerImage\n        genres\n        isAdult\n        episodes\n        synonyms\n        nextAiringEpisode {\n            airingAt\n            episode\n            timeUntilAiring\n        }\n        format\n        description(asHtml: false)\n        source\n        studios(isMain: true) {\n            nodes {\n                name\n            }\n        }\n        relations {\n            edges {\n                relationType(version: 2)\n                node {\n                    ...showcaseMedia\n                }\n            }\n        }\n        countryOfOrigin\n        startDate {\n            year\n            month\n            day\n        }\n    }\n": types.ShortMediaFragmentDoc,
    "\n    fragment showcaseMedia on Media {\n        id\n        idMal\n        siteUrl\n        status(version: 2)\n        season\n        type\n        format\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        bannerImage\n        episodes\n        synonyms\n        startDate {\n            year\n            month\n            day\n        }\n        nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n        }\n    }\n": types.ShowcaseMediaFragmentDoc,
    "\n    query Viewer {\n        Viewer {\n            name\n            avatar {\n                large\n                medium\n            }\n            bannerImage\n            isBlocked\n            options {\n                displayAdultContent\n                airingNotifications\n                profileColor\n            }\n        }\n    }\n": types.ViewerDocument,
    "\n    query AnimeCollection ($userName: String) {\n        MediaListCollection(userName: $userName, type: ANIME) {\n            lists {\n                entries {\n                    id\n                    score\n                    progress\n                    status\n                    notes\n                    repeat\n                    private\n                    startedAt {\n                        year\n                        month\n                        day\n                    }\n                    completedAt {\n                        year\n                        month\n                        day\n                    }\n                    media {\n                        ...shortMedia\n                    }\n                }\n            }\n        }\n    }\n": types.AnimeCollectionDocument,
    "\n    query SimpleAnimeCollection ($userName: String) {\n        MediaListCollection(userName: $userName, type: ANIME) {\n            lists {\n                entries {\n                    id\n                    media {\n                        ...showcaseMedia\n                    }\n                }\n            }\n        }\n    }\n": types.SimpleAnimeCollectionDocument,
    "\n    query SearchAnimeShortMedia($page: Int, $perPage: Int, $sort: [MediaSort], $search: String, $status: [MediaStatus]){\n        Page(page: $page, perPage: $perPage){\n            pageInfo{\n                hasNextPage\n            },\n            media(type: ANIME, search: $search, sort: $sort, status_in: $status, isAdult: false, format_not: MUSIC){\n                ...shortMedia\n            }\n        }\n    }\n": types.SearchAnimeShortMediaDocument,
    "\n    query ListAnime($page: Int, $perPage: Int, $sort: [MediaSort], $status: [MediaStatus], $format: MediaFormat){\n        Page(page: $page, perPage: $perPage){\n            pageInfo{\n                hasNextPage\n                total\n                perPage\n                currentPage\n                lastPage\n            },\n            media(type: ANIME, sort: $sort, status_in: $status, isAdult: false, format: $format, format_not: MUSIC){\n                ...shortMedia\n            }\n        }\n    }\n": types.ListAnimeDocument,
    "\n    query AnimeByMalId ($id: Int) {\n        Media(idMal: $id, type: ANIME) {\n            ...showcaseMedia\n        }\n    }\n": types.AnimeByMalIdDocument,
    "\n    query AnimeById ($id: Int) {\n        Media(id: $id, type: ANIME) {\n            ...media\n        }\n    }\n": types.AnimeByIdDocument,
    "\n    query AnimeShortMediaById ($id: Int) {\n        Media(id: $id, type: ANIME) {\n            ...shortMedia\n        }\n    }\n": types.AnimeShortMediaByIdDocument,
    "\n    query TrendingAnime {\n        Page(page: 1, perPage: 20) {\n            pageInfo {\n                hasNextPage\n            }\n            media(type: ANIME, sort: [TRENDING_DESC], isAdult: false, format_not: MUSIC) {\n                ...shortMedia\n            }\n        }\n    }\n": types.TrendingAnimeDocument,
    "\n    mutation UpdateEntry (\n        $mediaId: Int\n        $status: MediaListStatus\n        $score: Float\n        $progress: Int\n        $repeat: Int\n        $private: Boolean\n        $notes: String\n        $hiddenFromStatusLists: Boolean\n        $startedAt: FuzzyDateInput\n        $completedAt: FuzzyDateInput\n    ) {\n        SaveMediaListEntry(\n            mediaId: $mediaId\n            status: $status\n            score: $score\n            progress: $progress\n            repeat: $repeat\n            private: $private\n            notes: $notes\n            hiddenFromStatusLists: $hiddenFromStatusLists\n            startedAt: $startedAt\n            completedAt: $completedAt\n        ) {\n            id\n        }\n    }\n": types.UpdateEntryDocument,
    "\n    mutation DeleteEntry (\n        $mediaListEntryId: Int\n    ) {\n        DeleteMediaListEntry(\n            id: $mediaListEntryId\n        ) {\n            deleted\n        }\n    }\n": types.DeleteEntryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment media on Media {\n        siteUrl\n        id\n        idMal\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        startDate {\n            year\n            month\n            day\n        }\n        endDate {\n            year\n            month\n            day\n        }\n        bannerImage\n        season\n        description\n        type\n        format\n        status(version: 2)\n        episodes\n        duration\n        chapters\n        volumes\n        genres\n        isAdult\n        synonyms\n        averageScore\n        popularity\n        countryOfOrigin\n        mediaListEntry {\n            id\n            status\n        }\n        nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n        }\n        studios(isMain: true) {\n            nodes {\n                name\n            }\n        }\n        relations {\n            edges {\n                relationType(version: 2)\n                node {\n                    ...showcaseMedia\n                }\n            }\n        }\n        meanScore\n        rankings {\n            context\n            type\n            rank\n            year\n            format\n            allTime\n            season\n        }\n        genres\n        studios(isMain: true) {\n            edges {\n                id\n                node {\n                    name\n                    isAnimationStudio\n                }\n            }\n        }\n        recommendations(page: 1, perPage: 8, sort: RATING_DESC) {\n            edges {\n                node {\n                    mediaRecommendation {\n                        id\n                        coverImage {\n                            extraLarge\n                            large\n                            medium\n                            color\n                        }\n                        bannerImage\n                        title {\n                            romaji\n                            english\n                            native\n                            userPreferred\n                        }\n                    }\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    fragment media on Media {\n        siteUrl\n        id\n        idMal\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        startDate {\n            year\n            month\n            day\n        }\n        endDate {\n            year\n            month\n            day\n        }\n        bannerImage\n        season\n        description\n        type\n        format\n        status(version: 2)\n        episodes\n        duration\n        chapters\n        volumes\n        genres\n        isAdult\n        synonyms\n        averageScore\n        popularity\n        countryOfOrigin\n        mediaListEntry {\n            id\n            status\n        }\n        nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n        }\n        studios(isMain: true) {\n            nodes {\n                name\n            }\n        }\n        relations {\n            edges {\n                relationType(version: 2)\n                node {\n                    ...showcaseMedia\n                }\n            }\n        }\n        meanScore\n        rankings {\n            context\n            type\n            rank\n            year\n            format\n            allTime\n            season\n        }\n        genres\n        studios(isMain: true) {\n            edges {\n                id\n                node {\n                    name\n                    isAnimationStudio\n                }\n            }\n        }\n        recommendations(page: 1, perPage: 8, sort: RATING_DESC) {\n            edges {\n                node {\n                    mediaRecommendation {\n                        id\n                        coverImage {\n                            extraLarge\n                            large\n                            medium\n                            color\n                        }\n                        bannerImage\n                        title {\n                            romaji\n                            english\n                            native\n                            userPreferred\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment shortMedia on Media {\n        id\n        idMal\n        siteUrl\n        status(version: 2)\n        season\n        type\n        format\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        trailer {\n            id\n            site\n            thumbnail\n        }\n        streamingEpisodes {\n            title\n            thumbnail\n            url\n            site\n        }\n        bannerImage\n        genres\n        isAdult\n        episodes\n        synonyms\n        nextAiringEpisode {\n            airingAt\n            episode\n            timeUntilAiring\n        }\n        format\n        description(asHtml: false)\n        source\n        studios(isMain: true) {\n            nodes {\n                name\n            }\n        }\n        relations {\n            edges {\n                relationType(version: 2)\n                node {\n                    ...showcaseMedia\n                }\n            }\n        }\n        countryOfOrigin\n        startDate {\n            year\n            month\n            day\n        }\n    }\n"): (typeof documents)["\n    fragment shortMedia on Media {\n        id\n        idMal\n        siteUrl\n        status(version: 2)\n        season\n        type\n        format\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        trailer {\n            id\n            site\n            thumbnail\n        }\n        streamingEpisodes {\n            title\n            thumbnail\n            url\n            site\n        }\n        bannerImage\n        genres\n        isAdult\n        episodes\n        synonyms\n        nextAiringEpisode {\n            airingAt\n            episode\n            timeUntilAiring\n        }\n        format\n        description(asHtml: false)\n        source\n        studios(isMain: true) {\n            nodes {\n                name\n            }\n        }\n        relations {\n            edges {\n                relationType(version: 2)\n                node {\n                    ...showcaseMedia\n                }\n            }\n        }\n        countryOfOrigin\n        startDate {\n            year\n            month\n            day\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment showcaseMedia on Media {\n        id\n        idMal\n        siteUrl\n        status(version: 2)\n        season\n        type\n        format\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        bannerImage\n        episodes\n        synonyms\n        startDate {\n            year\n            month\n            day\n        }\n        nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n        }\n    }\n"): (typeof documents)["\n    fragment showcaseMedia on Media {\n        id\n        idMal\n        siteUrl\n        status(version: 2)\n        season\n        type\n        format\n        title {\n            userPreferred\n            romaji\n            english\n            native\n        }\n        coverImage {\n            extraLarge\n            large\n            medium\n            color\n        }\n        bannerImage\n        episodes\n        synonyms\n        startDate {\n            year\n            month\n            day\n        }\n        nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Viewer {\n        Viewer {\n            name\n            avatar {\n                large\n                medium\n            }\n            bannerImage\n            isBlocked\n            options {\n                displayAdultContent\n                airingNotifications\n                profileColor\n            }\n        }\n    }\n"): (typeof documents)["\n    query Viewer {\n        Viewer {\n            name\n            avatar {\n                large\n                medium\n            }\n            bannerImage\n            isBlocked\n            options {\n                displayAdultContent\n                airingNotifications\n                profileColor\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AnimeCollection ($userName: String) {\n        MediaListCollection(userName: $userName, type: ANIME) {\n            lists {\n                entries {\n                    id\n                    score\n                    progress\n                    status\n                    notes\n                    repeat\n                    private\n                    startedAt {\n                        year\n                        month\n                        day\n                    }\n                    completedAt {\n                        year\n                        month\n                        day\n                    }\n                    media {\n                        ...shortMedia\n                    }\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query AnimeCollection ($userName: String) {\n        MediaListCollection(userName: $userName, type: ANIME) {\n            lists {\n                entries {\n                    id\n                    score\n                    progress\n                    status\n                    notes\n                    repeat\n                    private\n                    startedAt {\n                        year\n                        month\n                        day\n                    }\n                    completedAt {\n                        year\n                        month\n                        day\n                    }\n                    media {\n                        ...shortMedia\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SimpleAnimeCollection ($userName: String) {\n        MediaListCollection(userName: $userName, type: ANIME) {\n            lists {\n                entries {\n                    id\n                    media {\n                        ...showcaseMedia\n                    }\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query SimpleAnimeCollection ($userName: String) {\n        MediaListCollection(userName: $userName, type: ANIME) {\n            lists {\n                entries {\n                    id\n                    media {\n                        ...showcaseMedia\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SearchAnimeShortMedia($page: Int, $perPage: Int, $sort: [MediaSort], $search: String, $status: [MediaStatus]){\n        Page(page: $page, perPage: $perPage){\n            pageInfo{\n                hasNextPage\n            },\n            media(type: ANIME, search: $search, sort: $sort, status_in: $status, isAdult: false, format_not: MUSIC){\n                ...shortMedia\n            }\n        }\n    }\n"): (typeof documents)["\n    query SearchAnimeShortMedia($page: Int, $perPage: Int, $sort: [MediaSort], $search: String, $status: [MediaStatus]){\n        Page(page: $page, perPage: $perPage){\n            pageInfo{\n                hasNextPage\n            },\n            media(type: ANIME, search: $search, sort: $sort, status_in: $status, isAdult: false, format_not: MUSIC){\n                ...shortMedia\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query ListAnime($page: Int, $perPage: Int, $sort: [MediaSort], $status: [MediaStatus], $format: MediaFormat){\n        Page(page: $page, perPage: $perPage){\n            pageInfo{\n                hasNextPage\n                total\n                perPage\n                currentPage\n                lastPage\n            },\n            media(type: ANIME, sort: $sort, status_in: $status, isAdult: false, format: $format, format_not: MUSIC){\n                ...shortMedia\n            }\n        }\n    }\n"): (typeof documents)["\n    query ListAnime($page: Int, $perPage: Int, $sort: [MediaSort], $status: [MediaStatus], $format: MediaFormat){\n        Page(page: $page, perPage: $perPage){\n            pageInfo{\n                hasNextPage\n                total\n                perPage\n                currentPage\n                lastPage\n            },\n            media(type: ANIME, sort: $sort, status_in: $status, isAdult: false, format: $format, format_not: MUSIC){\n                ...shortMedia\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AnimeByMalId ($id: Int) {\n        Media(idMal: $id, type: ANIME) {\n            ...showcaseMedia\n        }\n    }\n"): (typeof documents)["\n    query AnimeByMalId ($id: Int) {\n        Media(idMal: $id, type: ANIME) {\n            ...showcaseMedia\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AnimeById ($id: Int) {\n        Media(id: $id, type: ANIME) {\n            ...media\n        }\n    }\n"): (typeof documents)["\n    query AnimeById ($id: Int) {\n        Media(id: $id, type: ANIME) {\n            ...media\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AnimeShortMediaById ($id: Int) {\n        Media(id: $id, type: ANIME) {\n            ...shortMedia\n        }\n    }\n"): (typeof documents)["\n    query AnimeShortMediaById ($id: Int) {\n        Media(id: $id, type: ANIME) {\n            ...shortMedia\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TrendingAnime {\n        Page(page: 1, perPage: 20) {\n            pageInfo {\n                hasNextPage\n            }\n            media(type: ANIME, sort: [TRENDING_DESC], isAdult: false, format_not: MUSIC) {\n                ...shortMedia\n            }\n        }\n    }\n"): (typeof documents)["\n    query TrendingAnime {\n        Page(page: 1, perPage: 20) {\n            pageInfo {\n                hasNextPage\n            }\n            media(type: ANIME, sort: [TRENDING_DESC], isAdult: false, format_not: MUSIC) {\n                ...shortMedia\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateEntry (\n        $mediaId: Int\n        $status: MediaListStatus\n        $score: Float\n        $progress: Int\n        $repeat: Int\n        $private: Boolean\n        $notes: String\n        $hiddenFromStatusLists: Boolean\n        $startedAt: FuzzyDateInput\n        $completedAt: FuzzyDateInput\n    ) {\n        SaveMediaListEntry(\n            mediaId: $mediaId\n            status: $status\n            score: $score\n            progress: $progress\n            repeat: $repeat\n            private: $private\n            notes: $notes\n            hiddenFromStatusLists: $hiddenFromStatusLists\n            startedAt: $startedAt\n            completedAt: $completedAt\n        ) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateEntry (\n        $mediaId: Int\n        $status: MediaListStatus\n        $score: Float\n        $progress: Int\n        $repeat: Int\n        $private: Boolean\n        $notes: String\n        $hiddenFromStatusLists: Boolean\n        $startedAt: FuzzyDateInput\n        $completedAt: FuzzyDateInput\n    ) {\n        SaveMediaListEntry(\n            mediaId: $mediaId\n            status: $status\n            score: $score\n            progress: $progress\n            repeat: $repeat\n            private: $private\n            notes: $notes\n            hiddenFromStatusLists: $hiddenFromStatusLists\n            startedAt: $startedAt\n            completedAt: $completedAt\n        ) {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteEntry (\n        $mediaListEntryId: Int\n    ) {\n        DeleteMediaListEntry(\n            id: $mediaListEntryId\n        ) {\n            deleted\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteEntry (\n        $mediaListEntryId: Int\n    ) {\n        DeleteMediaListEntry(\n            id: $mediaListEntryId\n        ) {\n            deleted\n        }\n    }\n"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

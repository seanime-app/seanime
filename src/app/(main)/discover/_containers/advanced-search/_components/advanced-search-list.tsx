import { AnimeListItem } from "@/components/shared/anime-list-item"
import { cn } from "@/components/ui/core"
import { AiOutlinePlusCircle } from "@react-icons/all-files/ai/AiOutlinePlusCircle"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import React from "react"
import { useAnilistAdvancedSearch } from "@/app/(main)/discover/_containers/advanced-search/_lib/queries"

export function AdvancedSearchList() {

    const { isLoading, data, fetchNextPage, hasNextPage } = useAnilistAdvancedSearch()

    return <>
        {!isLoading && <div
            className={"px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-[2000px]:grid-cols-8 gap-4"}>
            {data?.pages.flatMap(n => n.Page?.media).filter(Boolean).map(media => (
                <AnimeListItem
                    key={`${media.id}`}
                    mediaId={media.id}
                    media={media}
                    showLibraryBadge={true}
                />
            ))}
            {((data?.pages.flatMap(n => n.Page?.media).filter(Boolean) || []).length > 0 && hasNextPage) &&
                <div
                    className={cn(
                        "h-full col-span-1 group/anime-list-item relative flex flex-col place-content-stretch rounded-md animate-none min-h-[348px]",
                        "cursor-pointer border border-dashed border-[--border] border-none text-[--muted] hover:text-white pt-24 items-center gap-2 transition",
                    )}
                    onClick={() => fetchNextPage()}
                >
                    <AiOutlinePlusCircle className={"text-4xl"}/>
                    <p className={"text-lg font-medium"}>Load more</p>
                </div>}
        </div>}
        {isLoading && <LoadingSpinner/>}
    </>
}

"use client"
import React, { useEffect, useRef, useState } from "react"
import { useDraggableScroll } from "@/hooks/use-draggable-scroll"
import { MdChevronLeft } from "@react-icons/all-files/md/MdChevronLeft"
import { MdChevronRight } from "@react-icons/all-files/md/MdChevronRight"

interface SliderProps {
    children?: React.ReactNode
}

export const Slider: React.FC<SliderProps> = (props) => {

    const { children, ...rest } = props

    const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
    const { events } = useDraggableScroll(ref, {
        decayRate: 0.9,
        safeDisplacement: 20,
    })

    const [isScrolledToLeft, setIsScrolledToLeft] = useState(true)
    const [isScrolledToRight, setIsScrolledToRight] = useState(false)

    const handleScroll = () => {
        const div = ref.current

        if (div) {
            const scrolledToLeft = div.scrollLeft === 0
            const scrolledToRight = div.scrollLeft + div.clientWidth === div.scrollWidth

            setIsScrolledToLeft(scrolledToLeft)
            setIsScrolledToRight(scrolledToRight)
        }
    }

    useEffect(() => {
        console.log(isScrolledToLeft, isScrolledToRight)
    }, [isScrolledToLeft, isScrolledToRight])

    function slideLeft() {
        const div = ref.current
        if (div) {
            div.scrollTo({
                left: div.scrollLeft - 500,
                behavior: "smooth",
            })
        }
    }

    function slideRight() {
        const div = ref.current
        if (div) {
            div.scrollTo({
                left: div.scrollLeft + 500,
                behavior: "smooth",
            })
        }
    }

    return (
        <div className={"relative flex items-center lg:gap-2"}>
            <div
                onClick={slideLeft}
                className={`flex items-center cursor-pointer hover:text-action absolute left-0 bg-gradient-to-r from-[--background-color] z-40 h-full w-12 hover:opacity-100 ${
                    !isScrolledToLeft ? "lg:visible" : "invisible"
                }`}
            >
                <MdChevronLeft className="w-7 h-7 stroke-2"/>
            </div>
            <div
                onScroll={handleScroll}
                className="flex max-w-full w-full space-x-3 overflow-x-scroll scrollbar-hide scroll"
                {...events}
                ref={ref}
            >
                {children}
            </div>
            <div
                onClick={slideRight}
                className={`flex items-center cursor-pointer hover:text-action absolute right-0 bg-gradient-to-l from-[--background-color] z-40 h-full w-12 hover:opacity-100 ${
                    !isScrolledToRight ? "lg:visible" : "invisible"
                }`}
            >
                <MdChevronRight className="w-7 h-7 stroke-2"/>
            </div>
        </div>
    )
}

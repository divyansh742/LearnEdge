
import React, { useState } from 'react'
import { HomePageExplore } from "../../../data/homepage-explore"
import HighlightText from './HighlightText'
import CourseCard from './CourseCard'

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

const ExploreMore = () => {

    const [currTab, setCurrTab] = useState(tabsName[0])
    const [courses, setCourses] = useState(HomePageExplore[0].courses)
    const [currCard, setCurrCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCard = (value) => {
        setCurrTab(value)
        const result = HomePageExplore.find((course) => course.tag === value)

        if (result) {
            setCourses(result.courses)
            setCurrCard(result.courses[0].heading)
        }
    }

    return (
        <div className='w-full min-w-0'>

            {/* Heading */}
            <div className='text-3xl md:text-4xl font-semibold
            px-2 md:text-center text-left'>
                Unlock the <HighlightText text={"Power of Code"}/>
            </div>

            <div className='text-base md:text-lg md:text-center
            text-left text-richblack-300 font-bold px-2 mt-2'>
                Learn to Build Anything You Can Imagine
            </div>

            {/* Tabs - Desktop only */}
            <div className='hidden md:flex rounded-full bg-richblack-800
            mt-5 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.18)]
            w-max justify-around gap-6 py-1 mx-auto px-2'>

                {tabsName.map((element, index) => (
                    <div
                        key={index}
                        className={`text-base flex items-center gap-2
                        ${currTab === element
                            ? "bg-richblack-900 text-richblack-5 font-medium"
                            : "text-richblack-200"}
                        rounded-full transition-all duration-200
                        cursor-pointer hover:bg-richblack-900
                        hover:text-white px-4 py-[7px]`}
                        onClick={() => setMyCard(element)}
                    >
                        {element}
                    </div>
                ))}
            </div>

            {/* Course Cards */}
            <div className='flex flex-col md:flex-row
            justify-between items-center md:items-stretch
            gap-6 md:gap-5 w-full min-w-0
            md:translate-y-[50%] px-2 translate-y-[15%] -mt-20'>

                {courses.map((element, index) => (
                    <CourseCard
                        key={index}
                        cardData={element}
                        currCard={currCard}
                        setCurrCard={setCurrCard}
                    />
                ))}

            </div>

        </div>
    )
}

export default ExploreMore

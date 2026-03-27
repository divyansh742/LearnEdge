import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];
const ExploreMore = () => {

    const [currTab,setCurrTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currCard , setCurrCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCard = (value) => {
        setCurrTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrCard(result[0].courses[0].heading)
    }
  return (
    <div>
        <div className='text-4xl font-semibold text-center'>
            Unlock the <HighlightText text={"Power of Code"}/>
        </div>
        <div className='text-lg text-center text-richblack-300 font-bold mt'>
            Learn to Build Anything You Can Imagine
        </div>

        <div className='flex rounded-full bg-richblack-800 mt-5 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.18)] w-max justify-around gap-10 py-1 mx-auto px-2'>
            {tabsName.map((element,index) => {
                return(
                    <div className={`text-[16px] flex items-center gap-2 ${currTab === element ? "bg-richblack-900 text-richblack-5 font-medium": "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-white px-4 py-[7px] `} key={index} onClick={() => setMyCard(element)}>
                        {element}
                    </div>

                );
            })}
        </div>
        
        {/* course card group */}
        <div className='flex justify-between gap-10 w-full translate-y-[50%] -mt-20'>
            {
                courses.map( (element,index) =>{
                    return(
                        <CourseCard key={index} cardData={element} currCard={currCard} setCurrCard={setCurrCard}/>
                    );
                })
            }
        </div>

      
    </div>
  )
}

export default ExploreMore

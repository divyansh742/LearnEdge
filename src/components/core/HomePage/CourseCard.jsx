import React from 'react'
import { HiUser } from 'react-icons/hi'
import { ImTree } from 'react-icons/im'

const CourseCard = (
    {cardData,currCard,setCurrCard}
) => {
  return (
    <div className={`flex flex-col justify-between  cursor-pointer bg-richblack-800 w-[360px] lg:w-[30%] h-[300px] mr-4 ${currCard === cardData.heading ?  "bg-white shadow-[12px_12px_0_0] shadow-yellow-50" : "bg-richblack-800"}` } onClick={() => setCurrCard(cardData?.heading)}>
        <div className='p-4 flex flex-col'>
            <h1 className={`font-inter font-semibold text-[20px] pb-3 ${
            currCard === cardData?.heading && "text-richblack-800"
          } `}>{cardData?.heading}</h1>
            <p className='text-richblack-300 text-[16px] font-normal'>{cardData.description}</p>
        </div>
        <div className={`flex justify-between  text-[16px] font-normal p-5 border-dashed  border-t-[2px] item-end border-richblack-400 border-opacity-50 ${currCard === cardData.heading ? "text-blue-200 " : "text-richblack-200 "}`}>
            <div className='flex gap-2 items-center'>
                <HiUser/>
                <div className='pt-1'>{cardData.level}</div>
            </div>
            <div className='flex gap-2 items-center '>
                <ImTree/>
                <div className='pt-1'>{cardData.lessionNumber} Lessons</div>
            </div>
        </div>
      
    </div>
  )
}

export default CourseCard

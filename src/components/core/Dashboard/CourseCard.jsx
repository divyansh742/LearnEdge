import React from 'react'

import truncateWords from '../../../utils/truncateWords'
const CourseCard = ({image,name,description,duration,progress}) => {
  return (
    <div className='flex  p-4 items-center font-semibold'>
      <div className='flex w-[45%] gap-3 items-center'>
        <img src={image} alt="thumbnail" className='aspect-square w-14 rounded-lg'/>
        <div className='gap-3'>
            <p className='font-bold'>{name}</p>
            <p className='text-richblack-300 text-sm'>{truncateWords(4,description)}</p>
        </div>
      </div>
      <div className='w-[35%] text-sm text-richblack-100'>{duration}</div>
      <div className='w-[20%] flex flex-col gap-1'>
        <div className='text-sm text-richblack-100'>{`${progress === 100 ? "Completed": `Progress ${progress}%`}`}</div>
        <div className='w-full h-2  bg-richblack-700 rounded-full'> 
            <div className={`h-full ${progress === 100 ?"bg-caribbeangreen-100" : "bg-blue-100"} rounded-full`} style={{ width: `${progress}%` }}></div>           
        </div>
      </div>
    </div>
  )
}

export default CourseCard

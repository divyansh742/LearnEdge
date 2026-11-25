import React from 'react'

import truncateWords from '../../../utils/truncateWords'
const CourseCard = ({image,name,description,duration,progress}) => {
  return (
    <div className='flex  p-4 items-center font-semibold'>
      <div className='flex sm:flex-row flex-col w-[45%] gap-3 md:items-center'>
        <img src={image} alt="thumbnail" className='sm:aspect-square sm:w-14 rounded-lg w-fit'/>
        <div className='gap-3 '>
            <p className='font-bold sm:text-base text-sm '>{name}</p>
            <p className='text-richblack-300 sm:text-sm text-xs'>{truncateWords(4,description)}</p>
        </div>
      </div>
      <div className='w-[35%] sm:text-sm text-xs text-richblack-100 text-center sm:text-left'>{duration}</div>
      <div className='w-[20%] flex flex-col gap-1'>
        <div className='sm:text-sm text-xs text-richblack-100 sm:text-left text-center'>{`${progress === 100 ? "Completed": `Progress ${progress}%`}`}</div>
        <div className='w-full h-2  bg-richblack-700 rounded-full'> 
            <div className={`h-full ${progress === 100 ?"bg-caribbeangreen-100" : "bg-blue-100"} rounded-full`} style={{ width: `${progress}%` }}></div>           
        </div>
      </div>
    </div>
  )
}

export default CourseCard

import React from 'react'

const TopStatsCards = ({title,value,text,Icon,iconCol,iconBg}) => {
  return (
    <div className='flex bg-richblack-800 border border-richblack-500 rounded-md p-3 gap-3 w-full'>
      <div className={`p-2 aspect-square ${iconBg} h-fit w-fit rounded-full`}>
        <Icon className={`${iconCol}`} size={20}/>
      </div>
      
      <div className='flex flex-col gap-2'>
        <p className='text-sm text-richblack-200'>{title}</p>
        <p className='font-semibold text-xl text-richblack-5'>{value}</p>
        <p className='text-xs text-richblack-300'>{text}</p>
      </div>

      
    </div>
  )
}

export default TopStatsCards

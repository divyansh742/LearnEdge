import React from 'react'
import { IoIosStar } from "react-icons/io";


const CoursesTable = ({courses}) => {
  return (
    <div className='border border-richblack-600 rounded-md bg-richblack-800'>
        <div className='w-full border-b border-richblack-600 flex bg-richblack-700 p-2 rounded-t-md text-richblack-300'>
            <p className='w-[60%]'>Course</p>
            <p className='w-[10%] text-center'>Students</p>
            <p className='w-[10%] text-center'>Earnings</p>
            <p className='w-[10%] text-center'>Ratings</p>
            <p className='w-[10%] text-center'>Reviews</p>
        </div>
    {
        courses?.map((course,index) => {
            const avgRating = course?.ratingAndReviews?.reduce((sum,element) =>  sum + (element?.rating || 0) , 0)/course?.ratingAndReviews?.length;
            const totalReviews = course?.ratingAndReviews?.length || 0;
            return (
                <div className={`w-full flex p-2 border-richblack-600 ${index === courses?.length -1 ? "rounded-b-md": "border-b"}`} key={index}>
                    <div className='flex gap-4 items-center w-[60%]'>
                        <img src={course?.thumbnail} alt="thumbnail" className='aspect-[2/1] w-28 rounded-lg' />
                        <div className='flex flex-col gap-2'>
                            <p className='font-semibold'>{course?.courseName}</p>
                            <p className='text-richblack-400 text-sm'>{course?.category?.name}</p>
                        </div>
                    </div>
                    <div className='w-[10%] text-center my-auto text-richblack-100'>{course?.totalStudentsEnrolled}</div>
                    <div className='w-[10%] text-center my-auto text-richblack-100'>{"₹"+course?.totalAmountGenerated.toLocaleString()}</div>
                    <div className='w-[10%] text-center my-auto text-richblack-100'><span className='flex items-center gap-1 justify-center'><IoIosStar className='text-yellow-100 ' size={16}/> {avgRating.toFixed(1)}</span></div>
                    <div className='w-[10%] text-center my-auto text-richblack-100'>{totalReviews.toLocaleString()}</div>
                </div>
            )
        })
    }
    {courses?.length === 0 && (<div className='text-center text-richblack-300 my-3'>No Data Available</div>)}

      
    </div>
  )
}

export default CoursesTable

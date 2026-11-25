import React from 'react'
import { IoIosStar } from "react-icons/io";


const CoursesTable = ({courses}) => {
  return (
    <div className='border overflow-x-auto border-richblack-600 rounded-md bg-richblack-800'>
        <div className='min-w-[650px]'>
            <div className='w-full border-b border-richblack-600 flex bg-richblack-700 p-2 rounded-t-md text-richblack-300'>
                <p className='md:w-[60%] w-[25%] sticky left-2 z-10 bg-richblack-700'>Course</p>
                <p className='md:w-[10%] w-[19%] text-center'>Students</p>
                <p className='md:w-[10%] w-[19%] text-center'>Earnings</p>
                <p className='md:w-[10%] w-[19%] text-center'>Ratings</p>
                <p className='md:w-[10%] w-[18%] text-center'>Reviews</p>
            </div>
            {
                courses?.map((course,index) => {
                    const avgRating = course?.ratingAndReviews?.reduce((sum,element) =>  sum + (element?.rating || 0) , 0)/course?.ratingAndReviews?.length;
                    const totalReviews = course?.ratingAndReviews?.length || 0;
                    return (
                        <div className={`w-full flex p-2 bg-richblack-800 border-richblack-600 ${index === courses?.length -1 ? "rounded-b-md": "border-b"}`} key={index}>
                            <div className='flex md:flex-row flex-col md:gap-4 md:items-center md:w-[60%] w-[25%] sticky left-2 z-10 '>
                                <img src={course?.thumbnail} alt="thumbnail" className='aspect-[2/1] w-28 rounded-lg' />
                                <div className='flex flex-col md:gap-2'>
                                    <p className='font-semibold md:text-base text-sm'>{course?.courseName}</p>
                                    <p className='text-richblack-400 text-sm'>{course?.category?.name}</p>
                                </div>
                            </div>
                            <div className='md:w-[10%] w-[19%] text-center my-auto text-richblack-100'>{course?.totalStudentsEnrolled}</div>
                            <div className='md:w-[10%] w-[19%] text-center my-auto text-richblack-100'>{"₹"+course?.totalAmountGenerated.toLocaleString()}</div>
                            <div className='md:w-[10%] w-[19%] text-center my-auto text-richblack-100'><span className='flex items-center gap-1 justify-center'><IoIosStar className='text-yellow-100 ' size={16}/> {avgRating.toFixed(1)}</span></div>
                            <div className='md:w-[10%] w-[18%] text-center my-auto text-richblack-100'>{totalReviews.toLocaleString()}</div>
                        </div>
                    )
                })
            }
            {courses?.length === 0 && (<div className='text-center text-richblack-300 my-3'>No Data Available</div>)}
        </div>
    </div>
  )
}

export default CoursesTable

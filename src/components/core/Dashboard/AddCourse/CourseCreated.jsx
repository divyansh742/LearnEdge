import React from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowBack } from 'react-icons/io';
import { MdCelebration } from "react-icons/md";
import CTAButton from '../../HomePage/CTAButton';

const CourseCreated = ({course,setStep}) => {
    const published = course?.status === "Published";
  return (
    <div>
        <div className='bg-richblack-800 border rounded-md text-richblack-5 border-richblack-700 mb-16 font-inter p-4 flex flex-col gap-6'>
            <h1 className=' text-2xl flex gap-2 items-center font-semibold text-green-400'><FaCheckCircle className='text-green-400' size={30}/> {published ? "Your Course is Live !" : "Your Course Has Been Saved as a Draft"}</h1>
            <p className='flex gap-1 items-center text-richblack-5 font-inter text-lg'>Congratulations <MdCelebration/></p>
            <p className='text-richblack-300 mb-4'>{
                published ? "Your course has been successfully Published and is now available for students to explore and enroll in." : "Your course has been saved successfully. You can continue editing it anytime and publish it when you're ready"
            }</p>
        </div>
        <div>

        </div>
        <div className='flex justify-between'>
            <button className= "text-center text-[16px] px-4 py-3 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center bg-richblack-800 transition-all duration-200 h-fit shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={() => setStep(3)}><IoIosArrowBack/> Back</button>
            <div className='flex gap-4'>
                <CTAButton linkTo="/dashboard/instructor">Go To Dashboard</CTAButton>
                <CTAButton active={true} linkTo={"/dashboard/my-courses"} >View My Courses</CTAButton>
            </div>
        </div>
        

      
    </div>
  )
}

export default CourseCreated

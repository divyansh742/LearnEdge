import React from 'react'
import InstructorImage from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'
const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex gap-20 items-center'>
            <div className='w-[50%]'>
                <img src={InstructorImage} alt="InstructorImage" 
                    className='shadow-white shadow-[-10px_-10px_0px_0px]'
                />

            </div>
            <div className='w-[50%] flex flex-col gap-10 items-start'>
                <div className='text-4xl font-semibold w-[50%] '>
                    Become an <HighlightText text={"instructor"}/>
                </div>
                <div className='font-semibold text-[16px] w-[90%] text-richblack-300 text-justify'>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </div>
                <CTAButton active={true} linkTo={"/signup"}>
                    <div className='flex gap-2 w-fit items-center'>
                        Start Teaching Today <FaArrowRight/>
                    </div>
                </CTAButton>
            </div>

        </div>
      
    </div>
  )
}

export default InstructorSection

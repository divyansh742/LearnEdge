import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import CourseInformation from './AddCourse/CourseInformation';
import CourseBuilder from './AddCourse/CourseBuilder';
import CoursePublish from './AddCourse/CoursePublish';
import CourseCreated from './AddCourse/CourseCreated';


const courseUploadTips = [
    "Set the Course Price option or make it free.",
    "Standard size for the course thumbnail is 1024x576.",
    "Video section controls the course overview video.",
    "Course Builder is where you create & organize a course.",
    "Add Topics in the Course Builder section to create lessons, quizzes, and assignments.",
    "Information from the Additional Data section shows up on the course single page.",
    "Make Announcements to notify any important",
    "Notes to all enrolled students at once."
]

const AddCourse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [courseData,setCourseData] = useState(location?.state?.course || null);
    const [step,setStep] = useState(1);

    //scroll to top when page loads
    useEffect(() => {
      window.scrollTo(0,0);
    }, [step])
    

  return (
    <div className="text-richblack-5 font-inter flex gap-8">
        {/* step box + forms */}
        <div className='w-[66%] flex flex-col '>
            <div className='flex items-center gap-1 text-richblack-300 cursor-pointer mb-8' onClick={() => navigate("/dashboard/my-courses")}><IoIosArrowBack/> Back to My Courses</div>
            {/* horizontal-dashed-line  */}
            <div className='border-t border-dashed w-[68%] mx-auto translate-y-5 z-[10]'></div>
            {/* course step */}
            <div className='flex mb-8'>
                <div className='flex flex-col  items-center w-[33%] gap-2'>
                    <p className={` ${step === 1 && "aspect-square border border-yellow-50 bg-yellow-900  rounded-full p-1 "}  text-center rounded-full z-[100]  text-yellow-50 text-lg font-semibold bg-richblack-900`}>{step > 1 ? <FaCheckCircle size={35} /> : 1}</p>
                    <p className={`font-extralight text-richblack-5 `}>Course Information</p>
                </div>
                <div className='flex flex-col  items-center w-[33%] z-[100] gap-2'>
                    <p className={` text-center rounded-full z-[100] text-lg font-semibold  ${step === 2 && "border-yellow-50 bg-yellow-900 text-yellow-50 p-1 aspect-square border "} ${step < 2 && "border-richblack-700 bg-richblack-800 text-richblack-300 p-1 aspect-square border " } ${step > 2 &&"text-yellow-50 bg-richblack-900"} `}>{step > 2 ? <FaCheckCircle size={35}/> : 2}</p>
                    <p className={`font-extralight ${step >= 2 ? "text-richblack-5": "text-richblack-500"}`}>Course Builder</p>
                </div>
                <div className='flex flex-col  items-center w-[33%] gap-2'>
                    <p className={`text-center rounded-full z-[100] text-lg font-semibold  ${step === 3 && "border-yellow-50 bg-yellow-900 text-yellow-50 aspect-square border p-1 "} ${step < 3 && "border-richblack-700 bg-richblack-800 text-richblack-300 aspect-square border p-1 "} ${step > 3 && "text-yellow-50 bg-richblack-900"}  `}>{step > 3 ? <FaCheckCircle size={35}/> : 3}</p>
                    <p className={`font-extralight ${step >= 3 ? "text-richblack-5": "text-richblack-500"}`}>Publish</p>
                </div>

            </div>
            {step === 1 && (
            <div>
                <CourseInformation course={courseData} setCourse={setCourseData} setStep={setStep}/>
            </div>
            )}
            {step === 2 && (
            <div>
                <CourseBuilder course={courseData} setCourse={setCourseData} setStep={setStep}/>
            </div>
            )}
            {step === 3 && (
                <div>
                    <CoursePublish course={courseData} setCourse={setCourseData} setStep={setStep}/>
                </div>
            )}
            {step === 4 && (
                <div>
                    <CourseCreated course={courseData} setStep={setStep}/>
                </div>

            )}


        </div>
        {/* tips box */}
        <div className='w-[33%] h-fit border border-richblack-700 bg-richblack-800 p-6 rounded-md flex flex-col gap-3'>
            <p className='text-xl font-semibold flex gap-2 items-start'><MdTipsAndUpdates/> Course Upload Tips</p>
            <div className='flex flex-col gap-2'>
                {courseUploadTips.map((element,index) => {
                    return (<li key={index} className='ml-4 text-xs text-richblack-5'>{element}</li>)
                })}
            </div>

        </div>
      
    </div>
  )
}

export default AddCourse

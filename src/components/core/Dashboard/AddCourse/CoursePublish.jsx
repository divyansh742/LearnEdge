import React, { useState } from 'react'
import { IoIosArrowBack ,IoMdCheckbox} from 'react-icons/io'
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { editCourseStatus } from '../../../../services/Operations/CourseApi';


const CoursePublish = ({course,setCourse,setStep}) => {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const dispatch = useDispatch();
    const [isPublic,setIsPublic] = useState(course?.status === "Published");
    const handleDraft = () => {
        if(isPublic){
            setError(true);
            return;
        }
        if(!isPublic && course?.status === "Draft"){
            setStep(4);
            return;
        }
        dispatch(editCourseStatus("Draft",course,setLoading,setCourse,setStep));
    }
    const handlePublish = () => {
        if(!isPublic){
            setError(true);
            return;
        }
        if(isPublic && course?.status === "Published"){
            setStep(4);
            return;
        }
        dispatch(editCourseStatus("Published",course,setLoading,setCourse,setStep));
    }
    if(loading){
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex gap-2 items-center rounded-md bg-richblack-100 px-3 py-2">
            <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>
    }
  return (
    <div>
        <div className='bg-richblack-800 border rounded-md text-richblack-5 border-richblack-700 mb-20 font-inter p-4 flex flex-col gap-6'>
            <h1 className='text-richblack-5 text-2xl'>Publish Settings</h1>
            <div className='flex gap-1 text-richblack-400 cursor-pointer items-center' onClick={() => {setError(false); setIsPublic(!isPublic)}}>
                {isPublic ? (<IoMdCheckbox size={25} className={`${error && "border-red-500 border"}`}/>) : (<MdCheckBoxOutlineBlank size={25} className={`${error && "border-red-500 border"}`}/>) }
                <p>Make this Course Public</p>
            </div>
        </div>
        <div className='flex  justify-between'>
            <button className= "text-center text-[16px] px-4 py-3 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center bg-richblack-800 transition-all duration-200 h-fit shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={() => setStep(2)}><IoIosArrowBack/> Back</button>
            <div className='flex gap-4'>
                <button className= "text-center text-[16px] px-4 py-3 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center bg-richblack-800 transition-all duration-200 h-fit shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={handleDraft}>Save as a Draft</button>
                <button className= "text-center text-[16px] px-4 py-3 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center h-fit bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={handlePublish}>Save and Publish</button>
            </div>
        </div>


    </div>
  )
}

export default CoursePublish

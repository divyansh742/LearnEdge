import React, { useEffect, useState } from 'react'
import IconBtn from '../../common/IconBtn'
import { IoIosAddCircleOutline } from "react-icons/io";
import toast from 'react-hot-toast';
import {apiConnector} from "../../../services/apiConnector"
import { FaCheckCircle } from "react-icons/fa";
import { TbClockHour3Filled } from "react-icons/tb";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import truncateWords from "../../../utils/truncateWords"
import {instructorEndpoints} from "../../../services/api"
import ConfirmationModal from '../../common/ConfirmationModal';
import secToDuration from "../../../utils/secToDuration"
import { Link } from 'react-router-dom';
const {GET_INSTRUCTOR_COURSE_API,DELETE_COURSE_API} = instructorEndpoints

const InstructorCourses = () => {
  const [loading,setLoading] = useState(false);
  const [courses,setCourses] = useState(null);
  const [confirmationModalData,setConfirmationModalData] = useState(null)
  useEffect(() => {
    window.scrollTo(0,0);
    const fetchCourse = async () => {
      toast.dismissAll();
      setLoading(true);
      const toastId = toast.loading("Loading...");
      try {
        const response = await apiConnector("GET",GET_INSTRUCTOR_COURSE_API);
        if(!response?.data?.success){
          throw Error(response?.data?.message);
        }
        setCourses(response?.data?.coursesDetails);
        
      } catch (error) {
        const message = error?.response?.data?.message || error.message;
        toast.error(message);            
      }
      setLoading(false);
      toast.dismiss(toastId);
    }
    fetchCourse();
  }, [])
  const handleDelete = async (courseId) => {
    setLoading(true);
    const toastId = toast.loading("Loading...")
    setConfirmationModalData(null)
    try {
      const response = await apiConnector("DELETE",DELETE_COURSE_API,{courseId})
      if(!response.data.success){
        throw new Error(response?.data?.message)
      }
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId))
      toast.success("Course Deleted Successfully")     
    } catch (error) {
      const message = error?.response?.data?.message || error?.message;
      toast.error(message);      
    }
    setLoading(false);
    toast.dismiss(toastId);
  }

  return (
    <div className="mx-auto w-11/12 max-w-full py-10 text-richblack-5 font-inter">
      <div className='flex w-full justify-between items-center'>
        <h1 className='text-3xl'>My Courses</h1>
        <Link to="/dashboard/add-course"><IconBtn icon={true} ><IoIosAddCircleOutline/> New</IconBtn></Link>
      </div>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex gap-2 items-center rounded-md bg-richblack-100 px-3 py-2">
            <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
      {courses?.length === 0 && (<p className='text-center mt-20 text-xl '>No Courses Available!</p>)}
      {courses?.length > 0 && 
      (<div className='border border-richblack-700 rounded-md text-richblack-100 mt-10'>
          <div className='border-b border-richblack-700'>
            <div className='flex w-full text-sm p-3'>
              <p className='w-[70%]'>COURSES</p>
              <p className='w-[10%] text-center'>DURATION</p>
              <p className='w-[10%] text-center'>PRICE</p>
              <p className='w-[10%] text-center'>ACTION</p>
            </div>
          </div>
        {courses?.map((element,index) => {
          return (<div className='flex w-full p-2 my-4' key={index}>
            <div className='w-[70%] flex gap-4 '>
              <img src={element?.thumbnail} alt="thumbnail" className='w-[33%] rounded-lg aspect-[3/2] object-fill'/>
              <div className='flex flex-col justify-between h-full'>
                <p className='text-richblack-5 text-lg font-semibold'>{element?.courseName}:</p>
                <p className='text-sm'>{truncateWords(18,element?.courseDescription)}</p>
                <p className='text-xs text-richblack-25'>Created: {new Date(element?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',',' |')}
                </p>
                <div className='w-fit bg-richblack-700  rounded-3xl text-xs'>
                  {element?.status === "Published" && (<span className='flex text-yellow-100 items-center gap-1 py-1 px-2'>
                    <FaCheckCircle/> Published
                  </span>)}
                  {element?.status === "Draft" && (<span className='flex text-pink-100 items-center gap-1 py-1 px-2'>
                    <TbClockHour3Filled size={14}/> Drafted
                  </span>)}
                </div>
              </div>
            </div>
            <div className='w-[10%] text-center my-auto text-richblack-100'>{secToDuration(element?.totalDuration)}</div>
            <div className='w-[10%] text-center my-auto text-richblack-100'>₹{(element?.price).toLocaleString()}</div>
            <div className='w-[10%] flex justify-center my-auto text-2xl gap-2 text-richblack-100 cursor-pointer'><Link to="/dashboard/add-course" state={{course:element}}><MdEdit title='Edit'
            /> </Link>
            <MdDelete 
            title="Delete" 
            onClick={() => setConfirmationModalData({
              text1: "Are You Sure",
              text2: "This will Delete the Course along with its associated users",
              btn1text: "Delete",
              btn2text: "Cancel",
              btn1Handler: () => handleDelete(element?._id),
              btn2Handler: () => setConfirmationModalData(null),
            })}/></div>
          </div>)
        })}
      </div>)}
      {confirmationModalData && (<ConfirmationModal modalData={confirmationModalData}/>)}
    </div>
  )
}

export default InstructorCourses

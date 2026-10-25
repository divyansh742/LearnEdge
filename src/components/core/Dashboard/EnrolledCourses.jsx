import React, { useState,useEffect, useMemo } from 'react'
import Tab from "../../common/Tab"
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../../services/apiConnector'
import { profileEndpoints } from '../../../services/api'
import CourseCard from './CourseCard'
import { useNavigate } from 'react-router-dom'

const COURSE_FILTER = {
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed"
}
const tabData = [
  {
    id: 1,
    tabName: "All",
    tabType: COURSE_FILTER.ALL,
  },
  {
    id: 2,
    tabName: "Pending",
    tabType: COURSE_FILTER.PENDING,
  },
  {
    id: 3,
    tabName: "Completed",
    tabType: COURSE_FILTER.COMPLETED,
  }
]
const EnrolledCourses = () => {
  const navigate = useNavigate();
  const {token} = useSelector((state) => state.auth);
  const {GET_ALL_ENROLLED_COURSES} = profileEndpoints;
  const [loading,setLoading] = useState(false);
  const [enrolledCourses,setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      toast.dismissAll();
      const toastId = toast.loading("Loading...");
      setLoading(true);
      try {
        const response = await apiConnector("GET",GET_ALL_ENROLLED_COURSES);
        if(!response.data.success){
          throw new Error(response.data.message);
        }
        setEnrolledCourses(response.data.allCourses);
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      }finally{
        setLoading(false);
        toast.dismiss(toastId);
      }
    }
    fetchCourses();
  }, [GET_ALL_ENROLLED_COURSES,token])
  const [selectedTab,setSelectedTab] = useState(COURSE_FILTER.ALL);

  const filteredCourses = useMemo(() => {
    switch (selectedTab) {
      case COURSE_FILTER.PENDING:
        return enrolledCourses.filter(
          (course) => course.progressPercentage < 100
        );

      case COURSE_FILTER.COMPLETED:
        return enrolledCourses.filter(
          (course) => course.progressPercentage === 100
        );

      default:
        return enrolledCourses;
    }
  }, [selectedTab, enrolledCourses]
  )
  return (
    <div className="mx-auto w-11/12 max-w-full py-10 text-richblack-5" >
      <p className="mb-14 text-3xl font-medium text-richblack-5">Enrolled Courses</p>
      <Tab tabData={tabData} field={selectedTab} setField={setSelectedTab}></Tab>
      {/* loading */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex gap-2 items-center rounded-md bg-richblack-100 px-3 py-2">
            <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}    
      {/* courseCard */}
      {
        filteredCourses.map((element,index) => {
          return (
            <div key={index}>
              {index === 0 && 
                <div className='flex  p-4 bg-richblack-700 rounded-t-lg text-richblack-200 text-sm font-semibold'>
                  <div className='w-[45%]'>Course Name</div>
                  <div className='w-[35%]'>Durations</div>
                  <div className='w-[20%]'>Progress</div>
                </div>
              }
              <div className={`border border-t-0 border-richblack-700 ${index === filteredCourses.length - 1 ? "rounded-b-lg": ""} cursor-pointer`} key={index} onClick={() => navigate(`/course-content/${element._id}`)}>
                <CourseCard image={element.thumbnail} name={element.courseName} description={element.courseDescription} duration={element.duration} progress={element.progressPercentage} />
              </div>
            </div>
          )
        })
      } 
      {/* No courses */}
      {
        !loading && filteredCourses.length === 0 && (
          <p className="text-center text-richblack-300 mt-20">
            No courses found.
          </p>
        )
      }
    </div>
  )
}

export default EnrolledCourses

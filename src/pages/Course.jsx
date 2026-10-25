import React, { useEffect, useState } from 'react'
import { courseEndpoints } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import {addToCart} from "../slices/cartSlice"
import Footer from "../components/common/Footer"
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'
import ReviewSection from '../components/core/HomePage/ReviewSection'
import { IoInformationCircleOutline } from "react-icons/io5";

import ConfirmationModal from "../components/common/ConfirmationModal"
const {GET_COURSE_DETAILS} = courseEndpoints

const Course = () => {
  const {user} = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {courseId} = useParams();
  const userEnrolled = user?.courses?.includes(courseId);
  const [loading,setLoading] = useState(false);
  const [courseDetails,setCourseDetails] = useState(null);
  const [confirmationModalData,setConfirmationModalData] = useState(null);

  const [activeSections,setActiveSections] = useState(Array(0));
  const handleActive = (id) => {
    setActiveSections(
      !activeSections.includes(id) ? activeSections.concat([id]): activeSections.filter((e) => e !== id)
    )
  }
  const handleBuy = () => {
    if(user){
      navigate("/dashboard/checkout",{
        state:{courses: [cartCourse],fromCart:false}
      })
    }
    else{
      setConfirmationModalData({
        text1: "You are not logged in",
        text2: "Please Login to Purchase Course.",
        btn1text: "Login",
        btn2text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModalData(null),
      })
    }
  }

  useEffect(() => {
    const findCourseDetails = async () => {
      toast.dismiss()
      setLoading(true);
      const toastId = toast.loading("Loading...");
      try {
        const response = await apiConnector("GET",`${GET_COURSE_DETAILS}/${courseId}`);
        if(!response.data.success){
          throw new Error(response.data.message);
        }
        setCourseDetails({...response.data.data,
          totalDuration: response.data.totalDuration});

      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);      
      }
      setLoading(false);
      toast.dismiss(toastId);

    }
    findCourseDetails();
  }, [courseId])


  const handleShare = async () => {
    const shareData = {
      title: `LearnEdge Course - ${courseDetails?.courseName}`,
      url: window.location.href,
    }
    try{
      if(navigator.share){
        await navigator.share(shareData);
      }
      else{
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied!");
      }
    }catch(error){
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }

  }

  if(loading){
      return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="flex gap-2 items-center rounded-md bg-richblack-100 px-3 py-2">
          <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }
  

  const totalRating = (Math.ceil((courseDetails?.ratingAndReviews?.length > 0
    ? courseDetails.ratingAndReviews.reduce((sum, curr) => sum + curr.rating,0) / courseDetails.ratingAndReviews.length: 0)*2)/2).toFixed(1);
  const subSectionLengthTotal = courseDetails?.courseContent?.length > 0
    ? courseDetails.courseContent.reduce((sum, curr) => sum + curr?.subSection?.length,0): 0;

 const cartCourse = courseDetails? {
    _id: courseDetails?._id,
    courseName: courseDetails?.courseName,
    thumbnail: courseDetails?.thumbnail,
    instructorName: courseDetails?.instructor?.firstName+" "+courseDetails?.instructor?.lastName,
    rating : totalRating,
    reviewCount: courseDetails?.ratingAndReviews?.length ? courseDetails?.ratingAndReviews?.length : 0,
    subSectionLengthTotal: subSectionLengthTotal,
    totalDuration: courseDetails?.totalDuration,
    categoryName: courseDetails?.Category?.name,
    price: courseDetails?.price,
  }: null;

  return (
    <div>
      <section className='bg-richblack-800 relative'>
        <div className='w-11/12 max-w-maxContent text-white mx-auto flex  flex-col justify-between gap-8'>
          <div className='flex my-10 relative'>
            <div className='w-[65%] border-r-richblack-700 border-r flex flex-col gap-4'>
              <h1 className='text-4xl font-inter font-semibold'>{courseDetails?.courseName}</h1>
              <p className='text-richblack-200 font-medium'>{courseDetails?.courseDescription}</p>
              <div className='flex gap-1 items-center '>
                <p className='font-semibold text-md text-yellow-100'>{totalRating}</p>
                <div className='text-lg flex gap-1'>
                    <span className={`${(totalRating > 0 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                    <span className={`${(totalRating > 1 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                    <span className={`${(totalRating > 2 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                    <span className={`${(totalRating > 3 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                    <span className={`${(totalRating > 4 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                </div>
                <p className='text-md text-richblack-5'>({courseDetails?.ratingAndReviews?.length ? courseDetails.ratingAndReviews.length.toLocaleString() : 0} ratings)</p>
                <p className='text-md text-richblack-5'>{courseDetails?.studentsEnrolled?.length ? courseDetails.studentsEnrolled.length.toLocaleString() : 0} students</p>
              </div>
              <p className='text-base text-richblack-200'>Created By <span className='underline'><Link to={`/instructor/${courseDetails?.instructor?._id}`}>{courseDetails?.instructor?.firstName+" "+courseDetails?.instructor?.lastName}</Link></span></p>
              <p className='text-base text-richblack-200 flex items-center gap-1'><IoInformationCircleOutline size={20}/> Created at { new Date(courseDetails?.createdAt).toLocaleDateString()}</p>
            </div>
            {/* courseCard */}
            <div className='w-[35%] absolute right-0 pl-4'>
              <div className='bg-richblack-700 rounded-lg'>
                <img src={courseDetails?.thumbnail} alt="thumbnail"className='rounded-t-lg w-full'  />
                <div className='flex flex-col p-6 gap-3'>
                  <p className='text-3xl font-semibold'>Rs. {courseDetails?.price.toLocaleString()}</p>
                  {/* Go to Course */}
                  {userEnrolled && (<Link to={`/course-content/${courseId}`} ><button className='text-center text-[16px] px-6 py-3 rounded-md font-bold hover:scale-95 bg-yellow-50 w-full text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none'>Go To Course</button></Link>)
                  }
                  {!userEnrolled && (<button className='text-center text-[16px] px-6 py-3 rounded-md font-bold hover:scale-95 bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none' onClick={() => dispatch(addToCart(cartCourse))}>Add To Cart</button>)}
                  {!userEnrolled && (<button className='text-center text-[16px] px-6 py-3 rounded-md font-bold hover:scale-95 bg-richblack-800 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none' onClick={handleBuy}>Buy Now</button>)}
                  <p className='text-base text-center text-richblack-100'>30-Day Money-Back Guarantee</p>
                  {courseDetails?.instructions && (<p>Requirements / Instructions:</p>)}
                  {
                    courseDetails?.instructions.map((element,index) => {
                      return (
                        <p className='text-sm text-caribbeangreen-100' key={index}>{index+1}. {element}</p>
                      )
                    })
                  }
                  <button className='text-yellow-100  text-md' onClick={handleShare}>Share</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='w-11/12 max-w-maxContent text-white mx-auto flex  flex-col justify-between my-10 gap-12'>
        <div className='flex flex-col p-4 w-[65%] border border-richblack-600 gap-2'>
          <p className='text-2xl font-semibold'>What you'll learn</p>
          <p className='text-md text-richblack-200'>{courseDetails?.whatYouWillLearn}</p>
        </div>
        {/* Course content */}
        <div className='w-[65%] flex flex-col gap-2'>
          <p className='text-2xl'>Course content</p>
          <div className='flex justify-between'>
            <p className='text-base text-richblack-200'>{`${courseDetails?.courseContent?.length} sections • ${subSectionLengthTotal} Lectures • ${courseDetails?.totalDuration} total length`}</p>
            <button className='text-yellow-50 text-base' onClick={() => setActiveSections([])}>Collapse all sections</button>
          </div>
          {courseDetails?.courseContent.length === 0 && (<div className='text-center mt-2 text-sm text-richblack-100'>No Content Yet...</div>)}
          <div>
          {
            courseDetails?.courseContent.map((element,index) => {
              return(
                <CourseAccordionBar course={element} key={index} isActive={activeSections} handleActive={handleActive}/>
              )
            })
          }
          </div>

        </div>
        {/* Author */}
        <div className='w-[65%] flex flex-col gap-2'>
          <p className='text-2xl mb-2'>Author</p>
          <Link to={`/instructor/${courseDetails?.instructor._id}`}>
            <div className='flex items-center gap-2'>
              <img src={courseDetails?.instructor?.image} alt="dp" className='w-12 h-12 aspect-square rounded-full'/>
              <p className='text-base '>{courseDetails?.instructor?.firstName+" "+courseDetails?.instructor?.lastName}</p>
            </div>
          </Link>
          
          <p className='text-sm text-richblack-100'>{courseDetails?.instructor?.additionalDetails?.about}</p>
        </div>
        {/* reviewSection */}
        <div>
          <h1 className='text-center text-3xl font-semibold mt-10'>Review from other learners</h1>
          <ReviewSection reviewData={courseDetails?.ratingAndReviews}/>
        </div>
      </div>

      <Footer/>
      {confirmationModalData && (<ConfirmationModal modalData={confirmationModalData}/>)}
    </div>
  )
}

export default Course

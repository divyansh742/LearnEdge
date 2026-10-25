import React, { useState, useEffect } from 'react'
import {  useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { LuWallet } from "react-icons/lu";
import { MdOutlinePeopleOutline, MdPeopleOutline } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { FaRegStar,FaArrowRight } from "react-icons/fa";
import TopStatsCards from './InstructorDashboard/TopStatsCards';
import { MdWavingHand } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { GrDocumentPerformance } from "react-icons/gr";
import { instructorDashboard } from '../../../services/Operations/instructor';
import BarCharts from './InstructorDashboard/BarCharts';
import CoursesTable from './InstructorDashboard/CoursesTable';
import RatingReviewCard from './InstructorDashboard/RatingReviewCard';



const InstructorDashboard = () => {
    const {user} = useSelector((state) => state.profile);
    const [courses,setCourses] = useState([]);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(instructorDashboard(setCourses,setLoading));
    }, [dispatch])

    let totalEarning = 0;
    let totalStudents = 0;
    let totalCourse = 0;
    let pubCourse = 0;
    let draftCourse = 0;
    let totalRating = 0;
    let totalReview = 0;

    for(const course of courses){
        totalCourse++;
        if(course?.status === "Published") pubCourse++;
        if(course?.status === "Draft") draftCourse++;
        totalEarning += course?.totalAmountGenerated;
        totalStudents += course?.totalStudentsEnrolled;
        for(const ratingReview of course?.ratingAndReviews){
            totalRating += ratingReview?.rating;
        }
        totalReview += course?.ratingAndReviews?.length;
    }
    const BarChartEarningData = courses?.map(course => {return {"name": course?.courseName ,"value": course?.totalAmountGenerated}})
    const BarChartEnrolledData = courses?.map(course => {return {"name": course?.courseName ,"value": course?.totalStudentsEnrolled}})

    if(loading){
        return (<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex gap-2 items-center rounded-md bg-richblack-100 px-3 py-2">
            <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>)
    }
    
    
  return (
    <div className="mx-auto w-11/12 max-w-full py-10 text-richblack-5 font-inter">
        <h1 className='flex items-center text-2xl gap-1 font-semibold'>Hi, {user?.firstName} <MdWavingHand className='text-yellow-50'/></h1>
        <p className='text-richblack-300 text-sm mb-6'>Here's what's happening with your courses today.</p>

        <div className='flex gap-3 w-full mb-6'>
            <TopStatsCards Icon={LuWallet} title="Total Earnings" value={"₹" + totalEarning.toLocaleString()} text="From all Courses" iconBg="bg-violet-800" iconCol="text-violet-300"/>
            <TopStatsCards Icon={MdOutlinePeopleOutline} title="Total Students" value={totalStudents} text="Enrolled in all Courses" iconBg="bg-blue-600" iconCol="text-blue-100"/>
            <TopStatsCards Icon={IoBookOutline} title="Published Courses" value={totalCourse} text={`${pubCourse} Published · ${draftCourse} Drafted`} iconBg="bg-green-800" iconCol="text-green-300"/>
            <TopStatsCards Icon={FaRegStar} title="Average Rating" value={totalRating/5+" / 5"} text={`Based on ${totalReview} reviews`} iconBg="bg-brown-700" iconCol="text-brown-200"/>
        </div>
        {/* Barchart */}
        <div className='flex w-full gap-3 mb-6'>
            <BarCharts data={BarChartEarningData} Icon={FaIndianRupeeSign} iconColor="#049069" text="Earnings Overview"/>
            <BarCharts data={BarChartEnrolledData} Icon={MdPeopleOutline} iconColor="#0C6A87" text="Students Enrolled"/>
        </div>
        {/* coursesTable */}
        <div className='bg-richblack-800 border  border-richblack-600 rounded-md p-3 mb-6'>
            <div className='flex justify-between mb-3'>
                <div className='flex gap-2 items-center'>
                    <GrDocumentPerformance size={23} className='text-violet-500'/>
                    <p className='text-richblack-100 font-semibold'>Course Performance</p>
                </div>
                <button className='flex gap-1 items-center text-violet-400 text-sm cursor-pointer font-semibold' to="/dashboard/my-courses" onClick={() => navigate("/dashboard/my-courses")}>
                    <p>View All Courses</p>
                    <FaArrowRight/>
                </button> 
            </div>
           <CoursesTable courses={courses}/> 
        </div>
        {/* Review */}
        <div className='bg-richblack-800 border  border-richblack-600 rounded-md p-3'>
            <RatingReviewCard courses={courses}/>
        </div>


      
    </div>
  )
}

export default InstructorDashboard

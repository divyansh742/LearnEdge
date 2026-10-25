import React, { useEffect, useState } from 'react'
import { apiConnector } from '../services/apiConnector'
import toast from 'react-hot-toast'
import { categoryEndpoints } from '../services/api'
import { useParams } from 'react-router-dom'
import { Swiper ,SwiperSlide} from 'swiper/react'
import {Navigation} from "swiper/modules"
import Footer from "./../components/common/Footer"
import { Link } from 'react-router-dom'
import truncateWords from '../utils/truncateWords'
import {FaAngleRight} from "react-icons/fa"
import {FaAngleLeft} from "react-icons/fa"

import "swiper/css"
import "swiper/css/navigation"
const Category = () => {
    const {categoryId} = useParams();
    const {GET_CATEGORY_PAGE_DETAILS} = categoryEndpoints;
    const [loading,setLoading] = useState(false);
    const [allDetails,setAllDetails] = useState({});

    

    useEffect(() => {
        const fetchCategoryPageDetails = async () => {
            toast.dismissAll();
            setLoading(true);
            const toastId = toast.loading("Loading...");
            try {
                const response = await apiConnector("GET",`${GET_CATEGORY_PAGE_DETAILS}/${categoryId}`);
                if(!response.data.success){
                    throw new Error(response.data.message);
                }
                setAllDetails(response.data);
            } catch (error) {
                const message = error.response?.data?.message || error.message;
                toast.error(message);
            }
            toast.dismiss(toastId);
            setLoading(false);
        }
      fetchCategoryPageDetails();
    },[GET_CATEGORY_PAGE_DETAILS,categoryId])
    

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
  return (
    <div className='bg-richblack-900 text-white'>
        <section className='bg-richblack-800'>
            <div className="w-11/12 max-w-maxContent text-white mx-auto flex  flex-col justify-between gap-8">
                <div className=' w-full pt-24 pb-24 flex flex-col gap-6'>
                    <h1 className='text-3xl font-semibold'>{allDetails.categoryName}</h1>
                    <p className='text-richblack-200 font-inter text-base'>{allDetails.categoryDescription}</p>
                </div>
            </div>
        </section>
        <div className="w-11/12 max-w-maxContent text-white mx-auto flex  flex-col justify-between gap-16 my-14">
            <div>
                <p className='text-2xl font-semibold mb-10 '>All {allDetails.categoryName} Courses</p>
                {
                    allDetails?.selectedCourses?.length === 0 && (
                        <div className='text-richblack-500 text-base text-center my-28'>
                            No Couses listed under this Category yet.
                        </div>
                    )
                }
                <div>
                {
                    allDetails?.selectedCourses?.length > 0  && (
                        <div className='relative'>
                        <button className='prev-btn p-2 bg-richblack-600 rounded-full w-fit h-fit absolute top-[50%] -ml-12'><FaAngleLeft/></button>
                        <Swiper
                            spaceBetween={25}
                            slidesPerView={3}
                            slidesPerGroup={1}
                            navigation = {{
                                prevEl: ".prev-btn",
                                nextEl: ".next-btn"
                            }}
                            modules={[Navigation]}
                        >{
                            allDetails.selectedCourses.map((element,index) => {
                                const totalRating = (Math.ceil((element?.ratingAndReviews?.length > 0
                                    ? element.ratingAndReviews.reduce((sum, curr) => sum + curr.rating,0) / element.ratingAndReviews.length: 0) * 2)/2).toFixed(1);
                                return (
                                    <SwiperSlide key={index}>
                                        <div className='h-full hover:scale-95'>
                                            <div className=' flex flex-col  justify-between gap-1 h-full flex-1'>
                                                <Link to={`/courses/${element._id}`}>
                                                    <img src={element?.thumbnail} alt="thumbnail" className='rounded-lg h-44 w-full' />
                                                </Link>
                                                <Link to={`/courses/${element._id}`}>
                                                    <p className='font-inter text-base text-richblack-5 font-medium cursor-pointer h-12 flex items-center'>{truncateWords(12,element?.courseName)}</p>
                                                </Link>
                                                <span className='text-sm text-richblack-300 cursor pointer z-30'><Link to={`/instructor/${element?.instructor?._id}`}>{element.instructor?.firstName+" "+element?.instructor?.lastName}</Link></span>
                                                <div>
                                                    <div className='flex gap-1 items-center '>
                                                    <p className='font-semibold text-sm text-yellow-100'>{totalRating}</p>
                                                    <div className='text-md flex gap-1'>
                                                        <span className={`${(totalRating > 0 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                        <span className={`${(totalRating > 1 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                        <span className={`${(totalRating > 2 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                        <span className={`${(totalRating > 3 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                        <span className={`${(totalRating > 4 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                    </div>
                                                    <p className='text-sm text-richblack-300'>({element?.ratingAndReviews?.length ? element.ratingAndReviews.length : 0})</p>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-md text-richblack-5 font-semibold'>Rs. {element.price.toLocaleString()}</p>
                                                    <p className='text-sm'>{new Date(element?.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }
                        </Swiper>
                        <button className='next-btn p-2 bg-richblack-600 rounded-full w-fit h-fit absolute right-0 -mr-12 top-[50%] '><FaAngleRight/></button>
                        </div>
                    )

                }
                </div>
            </div>
            <div>
                <p className='text-2xl font-semibold mb-10 '>Courses othen than {allDetails.categoryName}</p>
                {
                    allDetails?.differentCourses?.length === 0 && (
                        <div className='text-richblack-500 text-base text-center mt-10'>
                            No Courses listed under this Category yet.
                        </div>
                    )
                }
                <div>
                {
                    allDetails?.differentCourses?.length > 0  && (
                        <div className='relative'>
                            <button className='prev-btn-2 p-2 bg-richblack-600 rounded-full w-fit h-fit absolute top-[50%] -ml-12 '><FaAngleLeft/></button>
                            <Swiper
                                spaceBetween={25}
                                slidesPerView={3}
                                slidesPerGroup={1}
                                navigation = {{
                                    prevEl: ".prev-btn-2",
                                    nextEl: ".next-btn-2"
                                }}
                                modules={[Navigation]}
                            >{
                                allDetails.differentCourses.map((element,index) => {
                                    const totalRating = (Math.ceil((element?.ratingAndReviews?.length > 0
                                    ? element.ratingAndReviews.reduce((sum, curr) => sum + curr.rating,0) / element.ratingAndReviews.length: 0) * 2)/2).toFixed(1);
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className='h-full hover:scale-95'>
                                                <div className=' flex flex-col  justify-between gap-1 h-full flex-1'>
                                                    <Link to={`/courses/${element._id}`}>
                                                        <img src={element?.thumbnail} alt="thumbnail" className='rounded-lg h-44 w-full' />
                                                    </Link>
                                                    <Link to={`/courses/${element?._id}`}>
                                                        <p className='font-inter text-base text-richblack-5 font-medium cursor-pointer h-12 flex items-center'>{truncateWords(12,element?.courseName)}</p>
                                                    </Link>
                                                    <span className='text-sm text-richblack-300 cursor pointer z-30'><Link to={`/instructor/${element?.instructor?._id}`}>{element.instructor?.firstName+" "+element?.instructor?.lastName}</Link></span>
                                                    <div>
                                                        <div className='flex gap-1 items-center '>
                                                        <p className='font-semibold text-sm text-yellow-100'>{totalRating}</p>
                                                        <div className='text-md flex gap-1'>
                                                            <span className={`${(totalRating > 0 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 1 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 2 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 3 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 4 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                        </div>
                                                        <p className='text-sm text-richblack-300'>({element?.ratingAndReviews?.length ? element.ratingAndReviews.length : 0})</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between items-center'>
                                                        <p className='text-md text-richblack-5 font-semibold'>Rs. {element.price.toLocaleString()}</p>
                                                        <p className='text-sm'>{new Date(element?.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                            }
                            </Swiper>
                            <button className='next-btn-2 p-2 bg-richblack-600 rounded-full w-fit h-fit absolute top-[50%] right-0 -mr-12'><FaAngleRight/></button>
                        </div>
                    )

                }
                </div>
            </div>
            <div>
                <p className='text-2xl font-semibold mb-10'>Most Selling Courses</p>
                {
                    allDetails?.mostSellingCourses?.length === 0 && (
                        <div className='text-richblack-500 text-base text-center mt-10'>
                            No Courses Available.
                        </div>
                    )
                }
                <div>
                {
                    allDetails?.mostSellingCourses?.length > 0  && (
                        <div className='relative'>
                            <button className='prev-btn-3 p-2 bg-richblack-600 rounded-full w-fit h-fit  absolute top-[50%] -ml-12 '><FaAngleLeft/></button>
                            <Swiper
                                spaceBetween={25}
                                slidesPerView={3}
                                slidesPerGroup={1}
                                navigation = {{
                                    prevEl: ".prev-btn-3",
                                    nextEl: ".next-btn-3"
                                }}
                                modules={[Navigation]}
                            >{
                                allDetails.mostSellingCourses.map((element,index) => {
                                    const totalRating = (Math.ceil((element?.ratingAndReviews?.length > 0
                                    ? element.ratingAndReviews.reduce((sum, curr) => sum + curr.rating,0) / element.ratingAndReviews.length: 0) * 2)/2).toFixed(1);
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className='h-full hover:scale-95'>
                                                <div className=' flex flex-col  justify-between gap-1 h-full flex-1'>
                                                    <Link to={`/courses/${element?._id}`}>
                                                        <img src={element?.thumbnail} alt="thumbnail" className='rounded-lg h-44 w-full' />
                                                    </Link>
                                                    <Link to={`/courses/${element._id}`}>
                                                        <p className='font-inter text-base text-richblack-5 font-medium cursor-pointer h-12 flex items-center'>{truncateWords(12,element?.courseName)}</p>
                                                    </Link>
                                                    <span className='text-sm text-richblack-300 cursor pointer z-30'><Link to={`/instructor/${element?.instructor?._id}`}>{element.instructor?.firstName+" "+element?.instructor?.lastName}</Link></span>
                                                    <div>
                                                        <div className='flex gap-1 items-center '>
                                                        <p className='font-semibold text-sm text-yellow-100'>{totalRating}</p>
                                                        <div className='text-md flex gap-1'>
                                                            <span className={`${(totalRating > 0 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 1 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 2 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 3 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                            <span className={`${(totalRating > 4 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                                        </div>
                                                        <p className='text-sm text-richblack-300'>({element?.ratingAndReviews?.length ? element.ratingAndReviews.length : 0})</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between items-center'>
                                                        <p className='text-md text-richblack-5 font-semibold'>Rs. {element.price.toLocaleString()}</p>
                                                        <p className='text-sm'>{new Date(element?.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                            }
                            </Swiper>
                            <button className='next-btn-3 p-2 bg-richblack-600 rounded-full w-fit h-fit absolute top-[50%] right-0 -mr-12'><FaAngleRight/></button>
                        </div>
                    )

                }
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default Category

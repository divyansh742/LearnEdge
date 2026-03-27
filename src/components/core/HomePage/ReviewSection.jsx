import  { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import truncateWords from '../../../utils/truncateWords'
import { apiConnector } from '../../../services/apiConnector';
import { reviewEndpoints } from '../../../services/api';

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../../App.css"

import { Autoplay, Pagination } from "swiper/modules"


const ReviewSection = () => {

  const [review,setReview] = useState([]);

  const fetchReviews = async () =>{
    try {
      const result = await apiConnector("GET",reviewEndpoints.GET_ALL_RATING_REVIEWS);
      setReview(result.data.allRatingAndReview)
    } catch (error) {
      console.log("could not fetch reviews")
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])


  return (
    <div className='w-full my-10'>
      <Swiper
        spaceBetween={25}
        slidesPerView={4}
        slidesPerGroup={1}
        loop={review.length > 4}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
      >
        {
          review.map((element, index) => {
            return (
              <SwiperSlide key={index}>
                <div className='flex flex-col bg-richblack-800 p-3 gap-2'>
                  <div className='flex gap-4 items-center'>
                    <img className='h-[36px] w-[36px] rounded-full ' src={`${element.user ? element.user.image : "http://api.dicebear.com/5.x/initials/svg?seed=A N"}`} alt="dp" />
                    <div className='flex flex-col text-richblack-5 font-semibold'>
                      <p>{`${element.user ? element.user.firstName : "Anonymous"}`}</p>
                      <p className='text-richblack-600 font-semibold text-sm'>{element.course.courseName}</p>
                    </div>
                  </div>
                  <div className='font-medium text-sm line-clamp-3'>
                    {truncateWords(25,element.review)}
                  </div>
                  <div className='flex gap-3 items-center '>
                    <h3 className='font-semibold text-[18px]  text-yellow-5'>{element.rating.toFixed(1)}</h3>
                    <div className='text-2xl flex gap-1'>
                      <span className={`${(element.rating > 0 ) ?"text-yellow-5": "text-richblack-300"}`}>★</span>
                      <span className={`${(element.rating > 1 ) ?"text-yellow-5": "text-richblack-300"}`}>★</span>
                      <span className={`${(element.rating > 2 ) ?"text-yellow-5": "text-richblack-300"}`}>★</span>
                      <span className={`${(element.rating > 3 ) ?"text-yellow-5": "text-richblack-300"}`}>★</span>
                      <span className={`${(element.rating > 4 ) ?"text-yellow-5": "text-richblack-300"}`}>★</span>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            )
          })
        }
      </Swiper>


      
    </div>
  )
}

export default ReviewSection

import React, { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { FaStar  } from "react-icons/fa";
import toast from 'react-hot-toast';
import { apiConnector } from '../../../services/apiConnector';
import { reviewEndpoints } from '../../../services/api';
const {CREATE_REVIEW_API} = reviewEndpoints

const ReviewModal = ({reviewData,setReviewData,setCourse}) => {
    const [loading,setLoading] = useState(false);
    const [formData,setFormData] = useState({
        review: reviewData?.review,
        rating: reviewData?.rating,
        courseId: reviewData?.courseId,
    });
    const handleChange = (e) =>{
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    }
    const changeRating = (rating) => {
        setFormData((prevData) => (
            {
                ...prevData,
                rating : rating,
            }
        ))
    }
    const submitReview = async () =>{
        if(formData?.review === ""){
            toast.error("Review is required");
            return;
        }
        const toastId = toast.loading("Updating...")
        setLoading(true);
        try {
            const response = await apiConnector("POST",CREATE_REVIEW_API,formData);
            if(!response.data.success){
                throw new Error(response?.data.message);
            }
            setCourse(response?.data?.updatedCourse);
            toast.success(response.data.message);
            setReviewData(null);
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);        
        }
        setLoading(false);
        toast.dismiss(toastId);
    }
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="w-11/12 max-w-[450px] bg-richblack-800  flex flex-col gap-2">
            <div className='flex bg-richblack-700 justify-between p-3 border-b border-richblack-100  font-semibold'>
                <p>Add Review</p>
                <IoIosClose size={25} className='cursor-pointer' onClick={() => setReviewData(null)}/>
            </div>
            {/* userSection */}
            <div className='py-3'>
                <div className='flex justify-center items-center gap-2'>
                    <img src={reviewData?.userImg} alt="img" className='w-12 h-12 rounded-full '/>
                    <div className='flex flex-col '>
                        <p className='font-semibold text-richblack-5'>{reviewData?.userName}</p>
                        <p className='text-xs font-normal text-richblack-5'>Posting Publicly</p>
                    </div>
                </div>
            </div>
            {/* ratings */}
            <div className='flex gap-1 justify-center mb-4 cursor-pointer'>
                <FaStar className={formData?.rating > 0 ? "text-yellow-100":""}onClick={() => changeRating(1)}/>
                <FaStar className={formData?.rating > 1 ? "text-yellow-100":""}
                    onClick={() => changeRating(2)}/>
                <FaStar className={formData?.rating > 2 ? "text-yellow-100":""}
                    onClick={() => changeRating(3)}/>
                <FaStar className={formData?.rating > 3 ? "text-yellow-100":""}
                    onClick={() => changeRating(4)}/>
                <FaStar className={formData?.rating > 4 ? "text-yellow-100":""}
                    onClick={() => changeRating(5)}/>
            </div>
            {/* Review */}
            <label className='px-4'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Add Your Experience<sup className='text-pink-200'> *</sup></p>
              <textarea name="review" value={formData?.review} onChange={handleChange} rows={3} required placeholder='Share Details of your own experience for this course'
              className='w-full text-sm rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
            </label>
            {/* buttonSection */}
            <div className='flex  justify-end p-4 mb-2 '>
                <div className='flex gap-2 '>
                    <button className={`text-center text-sm px-4 py-2 w-fit h-fit rounded-md font-bold hover:scale-95 bg-richblack-700 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none`} onClick={() => setReviewData(null)}>Cancel</button>
                    <button className={`text-center text-sm px-4 py-2 w-fit h-fit  rounded-md font-bold hover:scale-95 bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,249,112)] hover:shadow-none`} disabled={loading} onClick={submitReview}>Save Edits</button>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default ReviewModal

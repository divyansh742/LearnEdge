import React, { useState ,useEffect} from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { instructorEndpoints } from '../services/api';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import truncateWords from '../utils/truncateWords';
import Footer from '../components/common/Footer';
const {GET_INSTRUCTOR_PAGE_API} = instructorEndpoints
const InstructorPage = () => {
    const {instructorId} = useParams();
    const [loading,setLoading] = useState(false)
    const [instructorDetails,setInstructorDetails] = useState(null);
    const [courses,setCourses] = useState(null);
    useEffect(() => {
      const fetchInstructorPage = async () => {
        setLoading(true);
        toast.dismissAll();
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("GET",`${GET_INSTRUCTOR_PAGE_API}/${instructorId}`);
            if(!response.data.success){
                console.log("instide error")
                console.log("error",response.data.message);
                throw new Error(response?.data?.message);
            }
            setInstructorDetails(response?.data?.instructorDetails);
            setCourses(response?.data?.courses);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);            
        }
        toast.dismiss(toastId);
        setLoading(false)
      }
      fetchInstructorPage()
    }, [instructorId])

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
                <div className=' w-full pt-10 pb-10 flex flex-col gap-6'>
                    <div className='flex items-center gap-4'>
                        <img src={instructorDetails?.image} alt="imageprofile" className='w-28 aspect-square rounded-full' />
                        <h1 className='text-3xl font-semibold'>{instructorDetails?.firstName+" "+ instructorDetails?.lastName}</h1>
                    </div>
                    <p className='text-richblack-200 font-inter text-base'>{instructorDetails?.additionalDetails?.about}</p>
                </div>
            </div>
        </section>
        <div className="w-11/12 max-w-maxContent text-white mx-auto flex  flex-col justify-between gap-16 my-14">
            <div>
                <p className='text-2xl font-semibold mb-10 '>Courses</p>
                {
                    courses?.length === 0 && (
                        <div className='text-richblack-500 text-base text-center my-28'>
                            No Course listed Yet.
                        </div>
                    )
                }
                <div className='grid grid-cols-3 gap-6'>
                    {courses?.map((element,index) => {
                        const totalRating = (Math.ceil((element?.ratingAndReviews?.length > 0
                        ? element.ratingAndReviews.reduce((sum, curr) => sum + curr.rating,0) / element.ratingAndReviews.length: 0) * 2)/2).toFixed(1);
                        return (
                            <div className='h-full hover:scale-95' key={index}>
                                <Link to={`/courses/${element?._id}`}>
                                    <div className=' flex flex-col  justify-between gap-1 h-full flex-1'>
                                        <img src={element?.thumbnail} alt="thumbnail" className='rounded-lg h-44 w-full' />
                                        <p className='font-inter text-base text-richblack-5 font-medium cursor-pointer  flex items-center'>{truncateWords(12,element?.courseName)}</p>
                                        <span className='text-sm text-richblack-300'>{truncateWords(10,element?.courseDescription)}</span>
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
                                            <p className='text-sm text-richblack-300'>({element?.ratingAndReviews?.length ? element.ratingAndReviews.length : 0} reviews)</p>
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p className='text-md text-richblack-5 font-semibold'>Rs. {element.price.toLocaleString()}</p>
                                            <p className='text-sm'>{new Date(element?.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )

                    })}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default InstructorPage

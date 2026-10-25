
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { courseEndpoints } from '../services/api';
import toast from 'react-hot-toast';
import VideoDetailsSidebar from '../components/core/VideoDetails/VideoDetailsSidebar';
import Footer from '../components/common/Footer';
import VideoPlayer from "../components/core/VideoDetails/VideoPlayer"
const {GET_COURSE_CONTENT_API} = courseEndpoints;

const VideoDetails = () => {
    const {courseId} = useParams();
    const [loading,setLoading] = useState(false);
    const [course,setCourse] = useState(null);
    const [currVideo,setCurrVideo] = useState(null);
    const [progress,setProgress] = useState(null);
    useEffect(() => {
      const fetchCourseContent  = async () => {
        toast.dismissAll();
        const toastId = toast.loading("Loading...");
        setLoading(true);
        try {
            const response = await apiConnector("GET",`${GET_COURSE_CONTENT_API}/${courseId}`);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            setCourse(response?.data?.courseContent);
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);            
        }
        toast.dismiss(toastId);
        setLoading(false);
      }
      fetchCourseContent();
    }, [courseId])


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
    <div className='text-white'>
      <div className='flex'>
        <div className='w-[20%] '>
          {course && <VideoDetailsSidebar course={course} setCourse={setCourse} currVideo={currVideo} setCurrVideo={setCurrVideo} progress={progress} setProgress={setProgress}/>}
        </div>
        <div className='mx-auto w-[80%]'>

          <VideoPlayer currVideo={currVideo} setCurrVideo={setCurrVideo} sections={course?.courseContent} course={course} progress={progress} setProgress={setProgress}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default VideoDetails

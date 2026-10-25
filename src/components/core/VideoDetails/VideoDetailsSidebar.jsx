import React, { useEffect,useState } from 'react'
import { apiConnector } from '../../../services/apiConnector';
import toast from 'react-hot-toast';
import { progressEndpoints } from '../../../services/api';
import IconBtn from '../../common/IconBtn';
import SectionAccordion from './SectionAccordion';
import { useSelector } from 'react-redux';
import ReviewModal from './ReviewModal';
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const {GET_COURSE_PROGRESS_API} = progressEndpoints;

const VideoDetailsSidebar = ({course,setCourse,currVideo,setCurrVideo,progress,setProgress}) => {
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.profile);
    const userReview = course?.ratingAndReviews?.find(element => element?.user === user?._id);
    const [reviewData,setReviewData] = useState(null);
    const [activeSections,setActiveSections] = useState(Array(0));
    const handleActive = (id) => {
        setActiveSections(
            !activeSections.includes(id) ? activeSections.concat([id]): activeSections.filter((e) => e !== id)
        )
    }
    //expand curr video section
    useEffect(() => {
      if(!currVideo) return
      const currSection = course?.courseContent?.find((section) => section?.subSection?.some((subSection) => subSection?._id === currVideo?._id));
      if(!currSection) return 
      setActiveSections((prev) => {
        if(prev.includes(currSection._id))
            return prev
        return [...prev,currSection._id]
      })
    }, [currVideo,course?.courseContent])
    
    useEffect(() => {
      const fetchProgress = async () => {
        setLoading(true);
        try {
            const response = await apiConnector("GET",`${GET_COURSE_PROGRESS_API}/${course._id}`);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            setProgress(response.data);
        } catch (error) {
            toast.error("Progress loading failed");            
        }
        setLoading(false);
      }
      fetchProgress();
    }, [course._id,setProgress])
    
    const [hasSelectedInitialVideo, setHasSelectedInitialVideo] = useState(false);

    useEffect(() => {
        const allVideos = course?.courseContent?.flatMap(section => section?.subSection || []) || [];
        if (hasSelectedInitialVideo || !allVideos?.length || !progress) return 
        const resumeVideo = allVideos.find((video) => !progress.completedVideos.includes(video._id)) || allVideos[0];
        setCurrVideo(resumeVideo);
        setHasSelectedInitialVideo(true);
    }, [progress, hasSelectedInitialVideo,course?.courseContent,setCurrVideo]);
    const openReviewModal = () => {
        setReviewData({
            userImg: user?.image,
            userName: user?.firstName +" "+ user?.lastName,
            rating: userReview?.rating || 4,
            review: userReview?.review || "",
            courseId: course?._id,
        })
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
    
  return (
    <div className='bg-richblack-800 pt-4 h-[120vh] overflow-y-auto custom-scrollbar'>
        <div className='text-center border-b flex flex-col border-richblack-400 m-4 gap-4'>
            <div className='flex justify-between items-center mb-3'>
                <IoChevronBackCircle onClick={() => navigate(-1)} size={30} className='cursor-pointer text-richblack-200'/>
                <IconBtn text={userReview ? "Edit Review" : "Add Review"} icon={true} customClasses={"w-fit"} onClick={openReviewModal}/>
            </div>
            <div className='flex flex-col justify-start mb-4 text-left'>
                <p className='font-semibold text-lg'>{course.courseName}</p>
                {progress && (<p className='text-caribbeangreen-100 text-sm font-semibold'>{`${progress?.completed}/${progress?.total} Completed`}</p>)}
            </div>
        </div>
        <div className='mt-2 flex flex-col gap-2'>
            {
                course?.courseContent?.map((element,index) => {
                    return (
                        <SectionAccordion course={element} courseId={course?._id} key={index} isActive={activeSections} handleActive={handleActive} progress={progress} setProgress={setProgress} currVideo={currVideo} setCurrVideo={setCurrVideo}/>
                    )
                })
            }
        </div>
        {reviewData && (<ReviewModal reviewData={reviewData} setReviewData={setReviewData} setCourse={setCourse}/>)}  
    </div>
  )
}

export default VideoDetailsSidebar

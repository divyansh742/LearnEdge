import React, { useRef, useState } from 'react'
import { Player } from 'video-react';
import IconBtn from "../../common/IconBtn"
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdOutlineReplay } from "react-icons/md";
import { GiNextButton } from "react-icons/gi";
import { GiPreviousButton } from "react-icons/gi";
import { apiConnector } from '../../../services/apiConnector';
import toast from 'react-hot-toast';
import { progressEndpoints } from '../../../services/api';
import 'video-react/dist/video-react.css';
import { Link } from 'react-router-dom';
const {UPDATE_PROGRESS_API} = progressEndpoints

const VideoPlayer = ({currVideo,setCurrVideo,sections,course,progress,setProgress}) => {
  const playerRef = useRef();
  const videoQueue = sections?.flatMap(section => section?.subSection || []) || [];
  const isCompleted = progress?.completedVideos?.includes(currVideo?._id);
  const firstVideo = videoQueue.length > 0 ? videoQueue[0] : null;
  const lastVideo = videoQueue.length > 0 ? videoQueue[videoQueue.length -1] : null;
  const currVideoIndex = videoQueue.findIndex(subSection => subSection._id === currVideo?._id);
  const [isHovered,setIsHovered] = useState(false);
  const [isEnded,setIsEnded] = useState(false);
  const showButton = isHovered || isEnded;
  const [playing,setPlaying] = useState(false);
  const handlePlay = () => {
    if(isEnded){
      playerRef.current.play();
      setPlaying(true);
      setIsEnded(false);
    }
    else if(playing){
      playerRef.current.pause();
      setPlaying(false);
      setIsEnded(false);
    }
    else{
      playerRef.current.play();
      setPlaying(true);
    }
  }
  const handleUpdateProgress = async (id) =>{
    if(progress.completedVideos.includes(id)) return
    try {
        const response = await apiConnector("PUT",UPDATE_PROGRESS_API,{
            courseId: course?._id,
            subSectionId: id,
        })
        if(!response?.data?.success){
            throw new Error(response?.data?.message);
        }
        const completedVideos = response?.data?.completedVideos;

        setProgress((prevData) => (
            {
                completed: completedVideos.length,
                completedVideos: completedVideos,
                total: prevData.total,  
                progress: Math.round((prevData.total/prevData.completed)*100),                
            }
        ))
        toast.success("Completed");
    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        toast.error(message);
    }
  }
  return (
    <div className='text-lg flex flex-col text-center text-white p-8'>
        {!currVideo && (<div className='mt-20'>
          No Videos Found!
        </div>)}
        {currVideo && (<div className='w-full self-start border-2  border-richblack-400 relative [&_.video-react-big-play-button]:!hidden '
        >
          <Player
            ref={playerRef}
            aspectRatio='16:9'
            src={currVideo?.videoUrl}
            onPlay={() => {
              setPlaying(true);
              setIsEnded(false)
            }}
            onEnded={() => setIsEnded(true)}
          >
            {/* <BigPlayButton style={{display : "none"}}/> */}
            <div className=' z-50  absolute top-[50%] w-full h-[20%]'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
                {showButton && currVideo?._id !== firstVideo?._id && (<button className=' text-white  text-2xl' onClick={() => {
                if(currVideoIndex !== -1){
                  setCurrVideo(videoQueue[currVideoIndex-1]);
                  setPlaying(false)
                  setIsEnded(false)
                }
                }} ><GiPreviousButton size={50}/></button>)}
                {(showButton || !playing) && (<button className='text-2xl justify-center mx-8' onClick={handlePlay}>{isEnded ? <MdOutlineReplay size={50}/> : playing ? <FaPause size={50}/>: <FaPlay size={50}/>}</button>)}  
                {showButton && currVideo?._id !== lastVideo?._id && (<button className=' text-white  text-2xl ' onClick={() => {
                  if(currVideoIndex !== -1){
                    setCurrVideo(videoQueue[currVideoIndex+1]);
                    setIsEnded(false);
                    setPlaying(false);
                  }
                }} ><GiNextButton size={50}/></button>)}
                {isEnded && !isCompleted && (<IconBtn text="Mark as Complete" customClasses={"mx-auto mt-10 text-base"} icon={true} onClick={() => handleUpdateProgress(currVideo?._id)} />)}
            </div>
          </Player>
        </div>)}
        <div className='flex justify-between mt-2 items-center'>
          <div className='flex items-start flex-col  gap-2'>
            <p className='text-2xl text-inter font-semibold text-richblack-5'>{currVideo?.title}</p>
            <p className='text-sm text-richblack-50'>{currVideo?.description}</p>
            {currVideo?.updatedAt && (<p className='text-sm text-richblack-50'>{new Date(currVideo?.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</p>)}
          </div>
          <Link to={`/courses/${course?._id}`}><IconBtn text="More Details" customClasses={"text-sm w-fit h-fit"} icon={true}/></Link>          
        </div>
    </div>
  )
}

export default VideoPlayer

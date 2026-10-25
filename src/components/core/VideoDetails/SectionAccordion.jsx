import { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import secToDuration from "../../../utils/secToDuration"
import { IoIosTv,IoIosCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { apiConnector } from "../../../services/apiConnector";
import toast from "react-hot-toast";
import { progressEndpoints } from "../../../services/api";
const {UPDATE_PROGRESS_API} = progressEndpoints;


const SectionAccordion = ({ course, isActive, handleActive ,progress,setProgress,courseId,currVideo,setCurrVideo}) => {
  const contentEl = useRef(null)
  // Accordian state
  const [active, setActive] = useState(false)
  useEffect(() => {
    setActive(isActive?.includes(course._id))
  }, [isActive,course])
  const [sectionHeight, setSectionHeight] = useState(0)

  useEffect(() => {
    setSectionHeight(active ? contentEl.current.scrollHeight : 0)
  }, [active])

  const handleUpdateProgress = async (id) =>{
    if(progress.completedVideos.includes(id)) return
    try {
        const response = await apiConnector("PUT",UPDATE_PROGRESS_API,{
            courseId: courseId,
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
    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        toast.error(message);
    }
  }

  const sectionDuration = course?.subSection?.length > 0 ? course.subSection.reduce((sum,element) => sum + Number(element?.timeDuration),0) : 0;
  return (
    <div className="overflow-hidden bg-richblack-700 text-richblack-5 last:mb-0 text-sm font-semibold">
      <div>
        <div
          className={`flex cursor-pointer items-start justify-between bg-opacity-20 p-4 transition-[0.3s] border-b border-solid border-richblack-500`}
          onClick={() => {
            handleActive(course._id)
          }}
        >
            <p>{course?.sectionName}</p>
          <div className="space-x-2 flex items-center">
            <span className="text-richblack-5">
              {`${secToDuration(sectionDuration)}`}
            </span>
            <i
              className={
                isActive.includes(course._id) ? "rotate-180" : "rotate-0"
              }
            >
              <AiOutlineDown size={15}/>
            </i>
          </div>
        </div>
      </div>
      <div
        ref={contentEl}
        className={`relative h-0 overflow-hidden bg-richblack-800 transition-[height] duration-[0.35s] ease-[ease]`}
        style={{
          height: sectionHeight,
        }}
      >
        <div className="text-textHead flex flex-col gap-2 p-4 font-semibold">
          {course?.subSection?.length === 0 && (<div>No Videos Yet</div>)}
          {course?.subSection?.map((subSec, i) => {
            const isCompleted = progress?.completedVideos.includes(subSec._id);
            const isPlaying = currVideo?._id === subSec._id;
            return(
                <div className="flex gap-2 items-center text-richblack-400 font-normal transition-all duration-200 ease-in " key={i}>
                    <span className={`${isPlaying ? "text-blue-100": ""}`}
                        onClick={() => handleUpdateProgress(subSec._id)}
                    >{isPlaying ? <FaPlay/> : (isCompleted ? (<IoIosCheckbox size={20}/>): (<MdCheckBoxOutlineBlank size={20}/>)) }</span>
                    <p className={`${isPlaying ? "text-blue-100" : (isCompleted ? "line-through" : "")} cursor-pointer`}
                        onClick={() => setCurrVideo(subSec)}
                    >{subSec?.title}</p>
                    <IoIosTv size={18}/>
                </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default SectionAccordion

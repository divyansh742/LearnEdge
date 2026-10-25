import React, { useEffect, useRef, useState } from 'react'
import {HiOutlineVideoCamera} from "react-icons/hi"
import { AiOutlineDown } from 'react-icons/ai'
import secToDuration from '../../../utils/secToDuration'
const CourseSubSectionAccordion = ({subSec,isActiveSubSec,handleActiveSubSec}) => {
    const contentEl = useRef(null);
    const [activeSubSec,setActiveSubSec] = useState(false);
    useEffect(() => {
      setActiveSubSec(isActiveSubSec?.includes(subSec._id))
    }, [isActiveSubSec,subSec])
    const [subSectionHeight,setSubSectionHeight] = useState(null);
    useEffect(() => {
        setSubSectionHeight(activeSubSec ? contentEl.current.scrollHeight: 0)
    },[activeSubSec])
  return (
    <div>
        <div className='flex justify-between p-2'>
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2 cursor-pointer'onClick={() => handleActiveSubSec(subSec?._id)}>
                    <span><HiOutlineVideoCamera/></span>
                    <p>{subSec?.title}</p>
                    <i className={isActiveSubSec.includes(subSec._id) ? "rotate-180" : "rotate-0"}>
                        <AiOutlineDown />
                    </i>
                </div> 
                <p ref={contentEl} className="relative h-0 overflow-hidden bg-richblack-900  text-richblack-200 font-normal transition-[height] duration-[0.35s] ease-[ease]" style={{ height: subSectionHeight}}>
                    {subSec?.description}
                </p>
            </div>                
            <p>{secToDuration(subSec?.timeDuration)}</p>
        </div>      
    </div>
  )
}

export default CourseSubSectionAccordion

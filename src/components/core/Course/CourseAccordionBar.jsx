import { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import CourseSubSectionAccordion from "./CourseSubSectionAccordion"
import secToDuration from "../../../utils/secToDuration"

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null)

  // Accordian state
  const [active, setActive] = useState(false)
  useEffect(() => {
    setActive(isActive?.includes(course._id))
  }, [isActive,course])
  const [sectionHeight, setSectionHeight] = useState(0)

  //sub section accordian state
  const [isActiveSubSec,setIsActiveSubSec] = useState(Array(0));
  const handleActiveSubSec = (id) => {
    setIsActiveSubSec(
      !isActiveSubSec.includes(id) ? isActiveSubSec.concat([id]): isActiveSubSec.filter((e) => e !== id)
    )
  }
  useEffect(() => {
    setSectionHeight(active ? contentEl.current.scrollHeight : 0)
  }, [active,isActiveSubSec])

  const sectionDuration = course?.subSection?.length > 0 ? course.subSection.reduce((sum,element) => sum + Number(element?.timeDuration),0) : 0;
  return (
    <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0 text-sm font-semibold">
      <div>
        <div
          className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7  py-4 transition-[0.3s]`}
          onClick={() => {
            handleActive(course._id)
          }}
        >
          <div className="flex items-center gap-2">
            <i
              className={
                isActive.includes(course._id) ? "rotate-180" : "rotate-0"
              }
            >
              <AiOutlineDown />
            </i>
            <p>{course?.sectionName}</p>
          </div>
          <div className="space-x-4">
            <span className="text-yellow-25">
              {`${course.subSection.length || 0} lecture(s)`}
            </span>
            <span className="text-richblack-5">
              {`${secToDuration(sectionDuration)}`}
            </span>
          </div>
        </div>
      </div>
      <div
        ref={contentEl}
        className={`relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
        style={{
          height: sectionHeight,
        }}
      >
        <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
          {course?.subSection?.length === 0 && (<div>No Videos Yet</div>)}
          {course?.subSection?.map((subSec, i) => {
            return <CourseSubSectionAccordion subSec={subSec}  key={i} isActiveSubSec={isActiveSubSec} handleActiveSubSec={handleActiveSubSec} />
          })}
        </div>
      </div>
    </div>
  )
}
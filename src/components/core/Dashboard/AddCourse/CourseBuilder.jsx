import React, { useState , useEffect} from 'react'
import { IoMdAddCircleOutline ,IoIosArrowForward,IoIosArrowBack} from "react-icons/io";
import { MdFormatListBulletedAdd ,MdFormatListBulleted,MdEdit,MdDelete} from "react-icons/md";
import { FaCaretDown,FaCaretUp ,FaPlus} from "react-icons/fa";
import IconBtn from '../../../common/IconBtn';
import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { addSection, deleteSection, deleteSubSection, editSection } from '../../../../services/Operations/CourseApi';
import ConfirmationModal from '../../../common/ConfirmationModal';
import EditLecture from './EditLecture';

const CourseBuilder = ({course,setCourse,setStep}) => {
  const [loading,setLoading] = useState(false);
  const [sections,setSections] = useState(course?.courseContent || []);
  const [confirmationModalData,setConfirmationModalData] = useState(null);
  const [lectureData,setLectureData] = useState(null);
  const [editingSection,setEditingSection] = useState(null);
  const [editSectionName,setEditSectionName] = useState("");
  const dispatch = useDispatch();
  const [openSections,setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  //open first section 
  useEffect(() => {
    if (sections.length > 0 && Object.keys(openSections).length === 0) {
      setOpenSections({
          [sections[0]._id]: true
      });
    }
  }, [sections,openSections]);

  const [currSectionName,setCurrSectionName] = useState("");

  const handleCreateNewSection = () => {
    const sectionName = currSectionName?.trim();
    if(!sectionName)
      return;
    setCurrSectionName("");
    dispatch(addSection(sectionName,course?._id,setLoading,setSections,setCourse,setOpenSections))
  }

  const handleDeleteSection = (sectionId) => {
    if(!sectionId) return;
    setConfirmationModalData({
      text1: "Are You Sure ?",
      text2: "This will delete all lectures of this section",
      btn1text: "Delete",
      btn2text: "Cancel",
      btn1Handler: () => {dispatch(deleteSection(sectionId,course?._id,setSections,setCourse)); setConfirmationModalData(null)},
      btn2Handler: () => setConfirmationModalData(null),
    })
  }
  const handleEditSection = (section) => {
    setEditingSection(section?._id);
    setEditSectionName(section?.sectionName);
  }
  const handleEditSectionApi = (section) => {
    const newSectionName = editSectionName?.trim();
    if(!newSectionName || newSectionName === section?.sectionName){
      setEditingSection(null);
      setEditSectionName("");
      return;
    }
    dispatch(editSection(newSectionName,course?._id,section?._id,setLoading,setSections,setCourse,setEditingSection,setEditSectionName));
  }
  const handleLecture = (section,subsection) => {
    setLectureData({
      edit: subsection ? true : false,
      section: section,
      subsectionId : subsection ? subsection?._id : "",
      lectureUrl : subsection?.videoUrl || "",
      title: subsection?.title || "",
      duration: subsection?.timeDuration || "",
      description: subsection?.description || "",
    })
  }
  const handleDeleteSubSection = (sectionId,subSectionId) => {
    if(!subSectionId || !sectionId) return;
    console.log("courseId",course?._id)
    setConfirmationModalData({
      text1: "Are You Sure ?",
      text2: "This will delete the lecture video and all its data",
      btn1text: "Delete",
      btn2text: "Cancel",
      btn1Handler: () => {dispatch(deleteSubSection(sectionId,subSectionId,course,setLoading,setCourse,setSections)); setConfirmationModalData(null)},
      btn2Handler: () => setConfirmationModalData(null),
    })
  }


  return (
    <div>
      <div className='bg-richblack-800 border rounded-md text-richblack-5 border-richblack-700 mb-20 font-inter p-4 flex flex-col gap-6'>
        <h1 className='text-richblack-5 text-2xl  '>Course Builder</h1>
        {/* sections list */}
        {sections?.length > 0 && (<div className='bg-richblack-700 border rounded-md border-richblack-600 p-4'>
          {
            sections.map((section,index) => {
              return (
              <div key={index} className='flex flex-col'>
                {/* section name div */}
                <div className='flex justify-between items-center py-2 border-b border-richblack-600'>
                  {editingSection === section?._id ? 
                    (<div className='flex items-end gap-2 '>
                      <MdFormatListBulletedAdd className='text-richblack-400' size={24}/>
                      <span className='text-richblack-50 font-semibold'>{index+1}.</span>
                      <input type="text" autoFocus value={editSectionName} onChange={(e) => setEditSectionName(e.target.value)} className='bg-transparent text-richblack-50 font-semibold px-1 border-b border-richblack-200'/>

                      <TiTick size={25} className='text-richblack-400 cursor-pointer' onClick={() => handleEditSectionApi(section)}/>
                      <MdCancel size={25} className='text-richblack-400 cursor-pointer' onClick={() => {setEditingSection(null); setEditSectionName(null)}}/>                    
                    </div>) 
                      : 
                    (<div className='flex items-end gap-2 '>
                      <MdFormatListBulletedAdd className='text-richblack-400' size={24}/>
                      <span className='text-richblack-50 font-semibold'>{index+1}. {section?.sectionName}</span>
                    </div>)
                  }
                  <div className='flex text-richblack-400 items-center cursor-pointer gap-2'>
                    <div className='flex gap-2 border-r pr-2 border-richblack-600'>{editingSection !== section?._id &&(<MdEdit size={22} onClick={() => handleEditSection(section)}/>)}
                    <MdDelete size={22} onClick={() => handleDeleteSection(section?._id)}/></div>
                    {openSections[section._id] ? <FaCaretUp size={22} onClick={() => toggleSection(section?._id)}/>: <FaCaretDown size={22} onClick={() => toggleSection(section?._id)}/>}
                  </div>
                </div>
                {/* subsection names div */}
                {
                  openSections[section._id] && (
                  <div>{
                    section?.subSection?.map((subSection,subSecindex) => {
                      return (
                      <div key={subSecindex} className='flex justify-between items-center py-2 border-b border-richblack-600 pl-6'>
                        <div className='flex items-end gap-2 '>
                          <MdFormatListBulleted className='text-richblack-400' size={20}/>
                          <span className='text-richblack-50 text-sm'>{index+1}.{subSecindex+1}. {subSection?.title}</span>
                        </div>
                        <div className='flex text-richblack-400 items-center gap-2 cursor-pointer'>
                            <MdEdit size={22} onClick={() => handleLecture(section,subSection)}/>
                            <MdDelete size={22} onClick={ () => handleDeleteSubSection(section?._id,subSection?._id)}/> 
                        </div>
                      </div>)
                    })}
                    <span className='flex items-center gap-2 py-3 w-fit text-yellow-50 cursor-pointer' onClick={() => handleLecture(section,null)}><FaPlus size={12}/> Add Lecture</span>
                  </div>)
                }
              </div>
            )})

          }

        </div>)}

        {/* new section input */}
        <input type="text" name='newSection'onChange={(e) => {setCurrSectionName(e.target.value)} } value={currSectionName} placeholder={(sections.length > 0) ? 'Add a new section' : 'Add a section to build your course'} 
        className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>

        {!loading && (<IconBtn icon={true} customClasses={"w-fit"} outline={true}
        onClick={handleCreateNewSection}><IoMdAddCircleOutline size={25} className='font-semibold'/> Create Section</IconBtn>)}
        {
          loading && (<IconBtn icon={true} customClasses={"w-fit"} outline={true} text="Adding...."/>)
        }        
      </div>
      {/* prev next button */}
      <div className='flex gap-4 justify-end'>
          <button className= "text-center text-[16px] px-4 py-2 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center bg-richblack-800 transition-all duration-200 h-fit shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={() => setStep(1)}><IoIosArrowBack/> Back</button>
          <button className= "text-center text-[16px] px-4 py-2 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center h-fit bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={() => setStep(3)}>Next <IoIosArrowForward/></button>
      </div>
        
      {confirmationModalData && (<ConfirmationModal modalData={confirmationModalData}/>)}
      {lectureData && (<EditLecture course={course} setCourse={setCourse} lectureData={lectureData} setLectureData={setLectureData} setSections={setSections}/>)}
    </div>
  )
}

export default CourseBuilder

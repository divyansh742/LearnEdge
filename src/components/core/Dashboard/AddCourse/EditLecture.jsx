import React,{useRef, useState} from 'react'
import { IoIosClose } from 'react-icons/io'
import {toast} from "react-hot-toast"
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { addSubSection, editSubSection } from '../../../../services/Operations/CourseApi'
import { useDispatch } from 'react-redux'
const EditLecture = ({course,setCourse,setSections,lectureData,setLectureData}) => {
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const {edit,section,subsectionId,lectureUrl,title,duration,description} = lectureData
    const {register,handleSubmit,formState:{errors}} = useForm({
        defaultValues:{
            title: title,
            description: description,
            hours: edit ? Math.floor(parseInt(duration)/3600) : "",
            minutes: edit ? Math.floor((parseInt(duration) % 3600)/60) : "",
            seconds: edit ? duration % 60 : "",
        }
    })
    const [thumbnail,setThumbnail] = useState(null);
    const [previewSource,setPreviewSource] = useState(lectureUrl || null);
    
    const thumbnailInputRef = useRef();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            if(file.size <= 20*1024*1024){
                setThumbnail(file);
                const previewUrl = URL.createObjectURL(file);
                setPreviewSource(previewUrl)
            }
            else{
                toast.error("File size exceeds 20MB limit!");
            }
        }
    }

    // image drag and drop
    const [isDragging,setIsDragging] = useState(false);
    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }
    const onDragLeave = (e) => {
        setIsDragging(false);
    }
    const onDrop = (e) => {
        setIsDragging(false);
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if(file && (file.type === "video/mp4")){
            if(file.size <= 20*1024*1024){
                setThumbnail(file);
                const previewUrl = URL.createObjectURL(file);
                setPreviewSource(previewUrl)
            }
            else{
                toast.error("File size exceeds 6MB limit!");
            }
        }
        else{toast.error("File must be in MP4 Format")}
    }

    const submitForm = (data) => {
        if(!edit && !thumbnail){
            toast.error("Thumnail is required")
            return;
        }
        const updatedDuration = Number(data?.seconds) + Number((data?.minutes*60)) + Number((data?.hours*3600));
        const formData = new FormData();
        if(data.title?.trim() !== title.trim())
            formData.append("title",data.title?.trim());
        if(data.description?.trim() !== description.trim())
            formData.append("description",data.description?.trim());
        if(updatedDuration !== parseInt(duration)){
            formData.append("duration",String(updatedDuration))
        }
        if(thumbnail)
            formData.append("videoFile",thumbnail)
        // console.log("formdata inside lecture-> ",Object.fromEntries(formData));
        if(!edit){
            formData.append("sectionId",section?._id);
            formData.append("courseId",course?._id);
            dispatch(addSubSection(formData,section,setLoading,setCourse,setSections,setLectureData))
            return;
        }
        //edit mode but nothing to update
        if(edit && (formData.keys().next().done)){
            setLectureData(null);
            return;
        }
        if(edit && !(formData.keys().next().done)){
            formData.append("subSectionId",subsectionId);
            formData.append("courseId",course?._id);
            dispatch(editSubSection(formData,section,subsectionId,setLoading,setCourse,setSections));
            return;            
        }
    }
  return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <form onSubmit={handleSubmit(submitForm)}>
                <div className="w-11/12 max-w-[450px] bg-richblack-800 flex flex-col gap-2 rounded-lg">
                    <div className='flex bg-richblack-700 justify-between p-3 border-b border-richblack-100  font-semibold rounded-t-lg'>
                        <p>{edit ? "Editing Lecuture" : "Add Lecture"}</p>
                        <IoIosClose size={25} className='cursor-pointer' onClick={() => setLectureData(null)}/>
                    </div>
                    <div className='p-4 flex flex-col gap-3'>
                        {/* Thumbnail */}
                        <label onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                            <p className='mb-1 text-sm text-richblack-5 font-medium'>Lecture Video<sup className='text-pink-200'> *</sup></p>
                            {previewSource && (
                                <div className={`w-full h-44 rounded-lg bg-richblack-600 text-richblack-5 ${isDragging ? "border-4 border-yellow-50": "border-2 border-richblack-400"}  border-dashed  relative`}>
                                    <video src={previewSource} alt="lectureVideo" className='object-fill h-full w-full rounded-lg opacity-60 '/>
                                    <div className='flex gap-3 absolute bottom-0 right-0 p-2'>
                                        <button type='button' className='flex items-center bg-yellow-50 text-richblack-900 border border-yellow-5 p-2 rounded-lg font-semibold text-sm'
                                            onClick={() => thumbnailInputRef.current.click()}
                                        ><FaEdit size={20}/> Change</button>
                                        <button type='button' className='flex items-center bg-richblack-800 border border-richblack-400 text-richblack-50 p-2 rounded-lg font-semibold text-sm'
                                            onClick={() => {setPreviewSource(null); setThumbnail(null);}}
                                        ><MdDelete size={20}/> Delete</button>
            
                                    </div>                        
                                </div>
                            )}
                            {!previewSource && (<div className={`w-full h-44 rounded-lg bg-richblack-600 p-3 text-richblack-5 ${isDragging ? "border-4 border-yellow-50": "border-2 border-richblack-400"} border-dashed text-center flex flex-col gap-2 justify-center items-center`}>
                                <div className='text-yellow-50 bg-pure-greys-800 w-fit p-2 rounded-full'><IoCloudUploadOutline size={30}/></div>
                                <p className='text-richblack-200 text-sm w-[55%] text-center'>Drag and drop a video, or <span className='text-yellow-50'>Browse</span> Max 6MB , Type - MP4</p>
                                <div className='flex gap-10 text-richblack-400 font-semibold text-sm justify-center'>
                                    <li>Aspect ratio 16:9</li>
                                    <li>Recommended size 1024x576</li>
                                </div>
                            </div>)}
                            <input type="file" ref={thumbnailInputRef} onChange={handleFileChange}  className='hidden' accept="video/mp4"/>
                        </label>
                        {/* title */}
                        <label className='w-full'>
                            <p className='mb-1 text-sm text-richblack-5 font-medium'>Lecture Title<sup className='text-pink-200'> *</sup></p>
                            <input type="text" name='title' placeholder='Enter Lecture Title' 
                            {...register("title",{required:true})}
                            className='w-full rounded-lg bg-richblack-600 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                            { errors.title && (<span className='text-sm text-red-600'>Please Enter Course Title</span>)}
                        </label>
                        {/* playback time */}
                        <div className='w-full'>
                            <p className='mb-1 text-sm text-richblack-5 font-medium'>Video Playback Time<sup className='text-pink-200'> *</sup></p>
                            {/* durations inputs */}
                            <div className='flex gap-4'>
                                <label>
                                    <input type="number" name='hour' placeholder='HH' 
                                    {...register("hours",{required:true})}
                                className='w-full rounded-lg bg-richblack-600 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                                    <p className='text-richblack-300 text-sm'>Hours</p>
                                </label>
                                <label>
                                    <input type="number" name='minute' placeholder='MM' 
                                    {...register("minutes",{required:true})}
                                className='w-full rounded-lg bg-richblack-600 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                                    <p className='text-richblack-300 text-sm'>Minutes</p>
                                </label>
                                <label>
                                    <input type="number" name='seconds' placeholder='SS' 
                                    {...register("seconds",{required:true})}
                                className='w-full rounded-lg bg-richblack-600 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                                    <p className='text-richblack-300 text-sm'>Seconds</p>
                                </label>
                            


                            </div>
                            { errors.duration && (<span className='text-sm text-red-600'>Please Enter Duration</span>)}
                        </div>
                        {/* Description */}
                        <label>
                            <p className='mb-1 text-sm text-richblack-5 font-medium'>Lecture Description<sup className='text-pink-200'> *</sup></p>
                            <textarea name="description"  rows="2" placeholder='Enter Lecture Description' {...register("description",{required:true})}
                            className='w-full rounded-lg bg-richblack-600 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                            { errors.description && (<span className='text-sm text-red-600'>Please Enter Description</span>)}
                        </label>
                    </div>
                    <div className='flex gap-4 justify-end mb-3 pr-4'>
                        <button type='button' className= "text-center text-[16px] px-4 py-2 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center bg-richblack-700 transition-all duration-200 h-fit shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" onClick={() => setLectureData(null)} >Cancel</button>
                        <button disabled={loading} type="submit" className= "text-center text-[16px] px-4 py-2 rounded-md font-bold hover:scale-95 w-fit flex gap-1 items-center h-fit bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none" >{loading ? "Saving..." : "Save Edits"}</button>
                    </div>
                </div>   
            </form>  
    </div>
  )
}

export default EditLecture

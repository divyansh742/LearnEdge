import React, { useEffect, useRef, useState } from 'react'
import { categoryEndpoints } from '../../../../services/api';
import toast from 'react-hot-toast';
import {apiConnector} from "../../../../services/apiConnector"
import { FaRupeeSign,FaEdit  } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { IoIosCloseCircle ,IoIosAddCircle,IoIosArrowForward } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import IconBtn from "../../../common/IconBtn"
import { useDispatch } from 'react-redux';
import { createCourse, editCourse } from '../../../../services/Operations/CourseApi';
const {GET_ALL_CATEGORIES} = categoryEndpoints

const CourseInformation = ({course,setCourse,setStep}) => {
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch()
    const [categories,setCategories] = useState(null);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await apiConnector("GET",GET_ALL_CATEGORIES)
                if(!response?.data?.success){
                    throw new Error(response?.data?.message);
                }
                setCategories(response?.data?.allCategory);                
            } catch (error) {
                toast.error("Category Loading Failed!");                                
            }
        }
        fetchCategory();
    }, [])
    const [tagsArray,setTagArray] = useState(course?.tagsArray || []);
    const [currTag,setCurrTag] = useState("");
    const [instructionArray,setInstructionsArray] = useState(course?.instructions || []);
    const [currInstructions,setCurrInstructions] = useState("");
    const {register,handleSubmit,reset,formState:{errors}} = useForm({defaultValues:{
        title: course?.courseName || "",
        description: course?.courseDescription || "",
        price: course?.price || "",
        Category: course?.Category || "",
        whatYouWillLearn: course?.whatYouWillLearn || "",
        tags: tagsArray,
    }})
    useEffect(() => {
      if(course){
        setTagArray(course.tags || []);
        setInstructionsArray(course.instructions || []);
      }
      const selectedCategory = categories?.find(category => category?._id === course?.Category);
      reset({
        title: course?.courseName || "",
        description: course?.courseDescription || "",
        price: course?.price || "",
        Category: selectedCategory ? selectedCategory?._id : "",
        whatYouWillLearn: course?.whatYouWillLearn || "",
      })
    }, [course,reset,categories])
    
    const [thumbnail,setThumbnail] = useState(null);
    const [previewSource,setPreviewSource] = useState(course?.thumbnail || null);

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
        if(file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")){
            if(file.size <= 6*1024*1024){
                setThumbnail(file);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setPreviewSource(reader.result);
                }
            }
            else{
                toast.error("File size exceeds 6MB limit!");
            }
        }
        else{toast.error("File must be in (PNG,JPEG or JPG) Format")}
    }

    const thumbnailInputRef = useRef();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setThumbnail(file);
            setPreviewSource(file);
        }
    }
    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreviewSource(reader.result)
        }
    }
    useEffect(() => {
        if(thumbnail){
            previewFile(thumbnail);
        }
    },[thumbnail])

    const submitForm = (data) => {
        if(!course && !thumbnail){
            toast.error("Thumbnail is required");
            return;
        }
        const formData = new FormData();
        
        if(data.title.trim() !== course?.courseName.trim())
            formData.append("courseName",data.title.trim())
        if(data.description.trim() !== course?.courseDescription.trim())
            formData.append("courseDescription",data.description)
        if(Number(data.price) !== course?.price)
            formData.append("price",isNaN(data.price) ? 0 : Number(data.price))
        if(data?.Category !== course?.Category)
            formData.append("Category",data.Category)
        if(data.whatYouWillLearn.trim() !== course?.whatYouWillLearn.trim())
            formData.append("whatYouWillLearn",data.whatYouWillLearn)
        if(JSON.stringify(tagsArray) !== JSON.stringify(course?.tags || []))
            formData.append("tags",JSON.stringify(tagsArray))
        if(JSON.stringify(instructionArray) !== JSON.stringify(course?.instructions || []))
            formData.append("instructions",JSON.stringify(instructionArray))
        if(thumbnail)
            formData.append("thumbnailImage",thumbnail);
        
        // console.log("formdate -> ",JSON.stringify(Object.fromEntries(formData)));
        //new course
        if(!course){
            dispatch(createCourse(formData,setLoading,setCourse,setStep))
            return;
        }
        //edit course nothing to edit 
        if(course && (formData.keys().next().done)){
            setStep(2);
            return;
        }
        if(course && !(formData.keys().next().done)){
            formData.append("courseId",course?._id);
            dispatch(editCourse(formData,setLoading,setCourse,setStep))
            return;
        }
    };


  return (
    <form onSubmit={handleSubmit(submitForm)} >
    <div className='bg-richblack-800 border rounded-md text-richblack-5 border-richblack-700 mb-20'>
        <div className='flex flex-col gap-6 p-4'>
            {/* title */}
            <label className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Course Title<sup className='text-pink-200'> *</sup></p>
                <input type="text" name='title' placeholder='Enter Course Title' 
                {...register("title",{required:true})}
                className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                { errors.title && (<span className='text-sm text-red-600'>Please Enter Course Title</span>)}
            </label>
            {/* Description */}
            <label>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Course Short Description<sup className='text-pink-200'> *</sup></p>
                <textarea name="description"  rows="4" placeholder='Enter Description' {...register("description",{required:true})}
                className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                { errors.description && (<span className='text-sm text-red-600'>Please Enter Description</span>)}
            </label>
            {/* price */}
            <label className='w-full relative'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Price<sup className='text-pink-200'> *</sup></p>
                <FaRupeeSign className='top-[50%] absolute ml-3 rounded-full text-richblack-300 border-2 border-richblack-300 p-1' size={25}/>
                <input type="text" inputMode='numeric' name='price'  placeholder='Enter Price' 
                {...register("price",{required:true})}
                className='w-full rounded-lg pl-12 bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
            </label>
            { errors.price && (<span className='text-sm text-red-600'>Please Enter Course Price</span>)}
            {/* Thumbnail */}
            <label onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Course Thumbnail<sup className='text-pink-200'> *</sup></p>
                {previewSource && (
                    <div className={`w-full h-44 rounded-lg bg-richblack-700 text-richblack-5 ${isDragging ? "border-4 border-yellow-50": "border-2 border-richblack-400"}  border-dashed  relative`}>
                        <img src={previewSource} alt="thumbnail" className='object-fill h-full w-full rounded-lg opacity-60 '/>
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
                {!previewSource && (<div className={`w-full h-44 rounded-lg bg-richblack-700 p-3 text-richblack-5 ${isDragging ? "border-4 border-yellow-50": "border-2 border-richblack-400"} border-dashed text-center flex flex-col gap-2 justify-center items-center`}>
                    <div className='text-yellow-50 bg-pure-greys-800 w-fit p-2 rounded-full'><IoCloudUploadOutline size={30}/></div>
                    <p className='text-richblack-200 text-sm w-[43%] text-center'>Drag and drop an image, or <span className='text-yellow-50'>Browse</span> Max 6MB , Type - PNG , JPEG , JPG</p>
                    <div className='flex gap-10 text-richblack-400 font-semibold text-sm justify-center'>
                        <li>Aspect ratio 16:9</li>
                        <li>Recommended size 1024x576</li>
                    </div>
                </div>)}
                <input type="file" ref={thumbnailInputRef} onChange={handleFileChange}  className='hidden' accept="image/png, image/jpg, image/jpeg"/>
            </label>
            {/* category */}
            <label>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Category<sup className='text-pink-200'> *</sup></p>
                <select  name="category" className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] ' 
                {...register("Category",{required:true})}>
                    <option value="" disabled hidden>Choose a Category</option>
                {
                    categories?.map((element,index) => {
                    return(
                        <option className='max-w-fit' value={element?._id} key={index} >
                            {element?.name}                            
                        </option>
                    )
                    })
                }
                </select>
                {errors.Category && (<span className='text-sm text-red-600'>Please Select a Category</span>)}
            </label>
            {/* whatYouWillLearn */}
            <label>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>What Will Students Learn<sup className='text-pink-200'> *</sup></p>
                <textarea name="whatYouWillLearn"  rows="4" placeholder='Enter Learning' {...register("whatYouWillLearn",{required:true})}
                className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                { errors.whatYouWillLearn && (<span className='text-sm text-red-600'>Please Enter Students Learning</span>)}
            </label>
            {/* Tags */}
            <div className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Tags</p>
                <div className='flex gap-2 mb-2 flex-wrap'>
                    {tagsArray?.map((element,index) => {
                        return(<div key={index} className='rounded-lg bg-richblack-700 p-1 text-sm text-richblack-50 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] flex items-center gap-2'>
                            {element}
                            <button type='button' onClick={() => {setTagArray(prev => prev.filter((_,i) => i !== index))}}><IoIosCloseCircle size={18}/></button>
                        </div>)
                    })}
                </div>
                <div className='relative'>
                    <input type="text" onChange={(e) => {setCurrTag(e.target.value)} } value={currTag} placeholder='Add a Tag'
                    className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] pr-12'/>
                    <button type="button" onClick={() => {
                        const tag = currTag?.trim();
                        if(!tag) return;
                        setCurrTag("")
                        if(tagsArray.some(element => element.toLowerCase() === tag.toLowerCase() )) return 
                        setTagArray(prev => [...prev,tag]);
                        }}><IoIosAddCircle className='absolute right-[2%] top-[20%]' size={30}/></button>
                </div>
            </div>
            {/* Instructions */}
            <div className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Requirements/Instructions</p>
                <div className='flex gap-2 flex-col mb-2'>
                    {instructionArray?.map((element,index) => {
                        return(<div key={index} className='rounded-lg bg-richblack-700 p-3 text-sm text-richblack-50 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] flex items-center justify-between gap-2'>
                            <p>{index+1}. {element}</p>
                            <button type='button' onClick={() => {setInstructionsArray(prev => prev.filter((_,i) => i !== index))}}><IoIosCloseCircle size={25}/></button>
                        </div>)
                    })}
                </div>
                <div className='relative'>
                    <input type="text" onChange={(e) => {setCurrInstructions(e.target.value)} } value={currInstructions} placeholder='Add a Requirement/Instruction'
                    className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] pr-12'/>
                    <button type="button" onClick={() => {
                        const instruction = currInstructions?.trim();
                        if(!instruction) return;
                        setCurrInstructions("")
                        if(instructionArray.some(element => element.toLowerCase() === instruction.toLowerCase())) return;
                        setInstructionsArray(prev => [...prev,instruction]);
                        }}><IoIosAddCircle className='absolute right-[2%] top-[20%]' size={30}/></button>
                </div>
            </div>
        </div>
    </div>
    {!loading && (<IconBtn customClasses={"place-self-end"} icon={true}>Next <IoIosArrowForward/></IconBtn>)}
    {loading && (<IconBtn text="Loading..." customClasses={"disabled place-self-end"} icon={true}/>)}
    </form>
  )
}

export default CourseInformation

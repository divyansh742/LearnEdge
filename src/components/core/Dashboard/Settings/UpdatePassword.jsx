import React from 'react'
import { AiOutlineEye,AiOutlineEyeInvisible } from 'react-icons/ai'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updatePassword } from '../../../../services/Operations/settingsApi';

const UpdatePassword = () => {
  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showCurrentPassword,setShowCurrentPassword] = useState(false);
  const [showNewPassword,setShowNewPassword] = useState(false);
  const [showConfirmNewPassword,setShowConfirmNewPassword] = useState(false);
  // const [currentPassword,setCurrentPassword] = useState("");
  // const [newPassword,setNewPassword] = useState("");
  // const [confirmNewPassword,setConfirmNewPassword] = useState("");
  const [formData,setFormData] = useState({
    email: user?.email,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "", 
  })

  const {currentPassword,newPassword,confirmNewPassword} = formData;

  const handleOnChange =  (e) => {
    setFormData((prevData) => (
      {
        ...prevData,
        [e.target.name] : e.target.value,
      }
    ))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if(newPassword !== confirmNewPassword){
      toast.error("New Passwords Do Not Match");
      return
    }
    dispatch(updatePassword(formData,token));
    setFormData({
      email: user?.email,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    })
  }
  return (
    <form onSubmit={handleOnSubmit}>
      <div className="flex  justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 mb-10 flex-col gap-6">
        <p className='text-white font-semibold text-lg'>Change Password</p>
        <div className='flex justify-between gap-10'>
            <label className='relative w-full'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>Current Password<sup className='text-pink-200'>*</sup></p>
            <input type={showCurrentPassword ? "text" : "password"} name='currentPassword' value={currentPassword} onChange={handleOnChange} placeholder='Enter Current Password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
            <span
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className='absolute  cursor-pointer z-[10] top-9 right-3'
            >{showCurrentPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
          </label>
          <label className='relative w-full'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>New Password <sup className='text-pink-200'>*</sup></p>
            <input type={showNewPassword ? "text" : "password"} name='newPassword' value={newPassword} onChange={handleOnChange} placeholder='Enter New Password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className='absolute cursor-pointer z-[10] top-9 right-3'
            >{showNewPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
          </label>
          <label className='relative w-full'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>Confirm New Password <sup className='text-pink-200'>*</sup></p>
            <input type={showConfirmNewPassword ? "text" : "password"} name='confirmNewPassword' value={confirmNewPassword} onChange={handleOnChange} placeholder='Enter New Password Again' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
            <span
              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
              className='absolute cursor-pointer z-[10] top-9 right-3'
            >{showConfirmNewPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
          </label>
        </div>
        <button className='text-center text-[16px] px-5 py-2 rounded-md font-bold hover:scale-95 bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none w-fit self-end' type='submit'>Save</button>
      </div>
    </form>
  )
}

export default UpdatePassword

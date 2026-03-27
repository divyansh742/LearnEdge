import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import { login } from '../../../services/Operations/authApi'
import { Link } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData,setFormData] = useState({
    email : "",
    password: ""
  })
  const [showPassword,setShowPassword] = useState(false)
  const {email,password} = formData
  const handleOnChange = (e)=>{
    setFormData((prevData)=>({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email,password,navigate));
  }


  return (
    <form className='mt-6 flex w-full flex-col gap-y-4' onSubmit={handleOnSubmit}>
      <label className='w-full'>
        <p className='mb-1 text-sm text-richblack-5 font-medium'>Email Address <sup className='text-pink-200'> *</sup></p>
        <input type="text" required name='email' value={email} onChange={handleOnChange} placeholder='Enter email address' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
      </label>
      <label className='relative'>
          <p className='mb-1 text-sm text-richblack-5 font-medium'>Password <sup className='text-pink-200'>*</sup></p>
          <input type={showPassword ? "text" : "password"} name='password' value={password} onChange={handleOnChange} placeholder='Enter password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute  cursor-pointer z-[10] top-9 right-3'
          >{showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
          <Link to="/forgot-password" >
            <p className='mt-1 ml-auto  max-w-max text-xs text-blue-100'>Forgot Password</p>
          </Link>
      </label>
      <button type='submit' className='mt-6 rounded-md bg-yellow-50 py-2 px-3 font-medium text-richblack-900 text-lg'>
        Log In
      </button>
    </form>
  )
}

export default LoginForm

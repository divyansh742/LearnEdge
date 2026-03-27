import React, { useState } from 'react'
import { ACCOUNT_TYPE } from '../../../utils/constant'
import Tab from '../../common/Tab';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AiOutlineEye,AiOutlineEyeInvisible } from 'react-icons/ai';
import { setSignUpData } from '../../../slices/authSlice';
import { sendOtp } from '../../../services/Operations/authApi';
import toast from 'react-hot-toast';

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  //student or instructor
  const [accountType,setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData,setFormData] = useState({
    firstName : "",
    lastName : "",
    email : "",
    password : "",
    confirmPassword : "",

  })

  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const {firstName,lastName,email,password,confirmPassword} = formData;

  const handleOnChange = (e) =>{
    setFormData((prevData) =>({
      ...prevData,
      [e.target.name] : e.target.value, 
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      toast.error("Passwords Do Not Match");
      return
    }
    const signUpData = {
      ...formData,
      accountType,
    }

    //store signup data in state used after otp verification
    dispatch(setSignUpData(signUpData));
    //send otp to user
    dispatch(sendOtp(formData.email,navigate));
    //reset from
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)

  }

  //tab data
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      tabType: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      tabType: ACCOUNT_TYPE.INSTRUCTOR,
    }
  ]


  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType}/>
      <form className='flex w-full flex-col gap-y-4' onSubmit={handleOnSubmit}>
        <div className='flex gap-x-4'>
          <label className='w-full'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>First Name <sup className='text-pink-200'> *</sup></p>
            <input type="text" required name='firstName' value={firstName} onChange={handleOnChange} placeholder='Enter First Name' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
          </label>
          <label className='w-full'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>Last Name <sup className='text-pink-200'> *</sup></p>
            <input type="text" required name='lastName' value={lastName} onChange={handleOnChange} placeholder='Enter Last Name' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
          </label>
        </div>
        <label className='w-full'>
          <p className='mb-1 text-sm text-richblack-5 font-medium'>Email Address <sup className='text-pink-200'> *</sup></p>
          <input type="text" required name='email' value={email} onChange={handleOnChange} placeholder='Enter email address' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
        </label>
        <div className='flex gap-x-4'>
          <label className='relative'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>Create Password <sup className='text-pink-200'>*</sup></p>
            <input type={showPassword ? "text" : "password"} name='password' value={password} onChange={handleOnChange} placeholder='Enter Password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute  cursor-pointer z-[10] top-9 right-3'
            >{showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
          </label>
          <label className='relative'>
            <p className='mb-1 text-sm text-richblack-5 font-medium'>Confirm Password <sup className='text-pink-200'>*</sup></p>
            <input type={showConfirmPassword ? "text" : "password"} name='confirmPassword' value={confirmPassword} onChange={handleOnChange} placeholder='Confirm Password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]'/>
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className='absolute cursor-pointer z-[10] top-9 right-3'
            >{showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
          </label>
        </div>
        <button type='submit' className='mt-6 rounded-md bg-yellow-50 py-2 px-3 font-medium text-richblack-900 text-lg'>
          Create Account
        </button>
      </form>
      
      
    </div>
  )
}

export default SignUpForm

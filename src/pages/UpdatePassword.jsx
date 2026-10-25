import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineEye,AiOutlineEyeInvisible,AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../services/Operations/authApi";
import toast from "react-hot-toast";

const UpdatePassword = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const {loading} = useSelector((state) => state.auth);
    const [resetComplete,setResetComplete] = useState(false);
    const [email,setEmail] = useState("");
    const [formData,setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const {password,confirmPassword} = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name] : e.target.value,
        }))
    }
    const handleOnSubmit = (e) =>{
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Passwords Do Not Match");
            return
        }
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token,setEmail,setResetComplete));
    }

  return (
    <div className="grid place-items-center min-h-[calc(100vh-3.5rem)] font-inter">
        { loading ? (          
            <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
                <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
                <div>Loading...</div>
          </div>
          ) : (
        <div className="text-white flex justify-center flex-col max-w-[500px] p-4 gap-y-6">
            <h1 className="font-semibold text-3xl">{ !resetComplete ? "Choose new password" : "Reset Complete!" }</h1>
            <p className="text-lg text-richblack-100">{ !resetComplete ? "Almost done. Enter your new password and youre all set." : `All done! We have sent an email to ${email} to confirm` }</p>
            {!resetComplete ? (
                <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
                    <label className='relative'>
                    <p className='mb-1 text-sm text-richblack-5 font-medium'>New Password <sup className='text-pink-200'>*</sup></p>
                    <input type={showPassword ? "text" : "password"} name='password' value={password} onChange={handleOnChange} placeholder='Enter Password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute  cursor-pointer z-[10] top-9 right-3'
                    >{showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
                    </label>
                    <label className='relative'>
                    <p className='mb-1 text-sm text-richblack-5 font-medium'>Confirm new password <sup className='text-pink-200'>*</sup></p>
                    <input type={showConfirmPassword ? "text" : "password"} name='confirmPassword' value={confirmPassword} onChange={handleOnChange} placeholder='Confirm Password' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                    <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className='absolute cursor-pointer z-[10] top-9 right-3'
                    >{showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>): (<AiOutlineEye fontSize={24} fill="#AFB2BF" />) }</span>
                    </label>
                    <button type='submit' className='mt-6 rounded-md bg-yellow-50 py-2 px-3 font-medium text-richblack-900 text-lg w-full'>
                        Reset Password
                    </button>
                </form>
            )  : 
            (
                <Link to= "/login">
                    <div className="className='mt-6 rounded-md bg-yellow-50 py-2 px-3 font-medium text-richblack-900 text-lg w-full flex justify-center">
                        Return to Login
                    </div>
                </Link>
            )
            }
            <div className="font-inter font-semibold text-richblack-5">
              <Link to="/login" className="flex items-center gap-x-2">
                <AiOutlineArrowLeft/> Back to Login
              </Link>
            </div>
        </div>
        )
        }
    </div>
  )
}

export default UpdatePassword

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { sendPasswordResetToken } from "../services/Operations/authApi";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [emailSent,setEmailSent] = useState(false);
  const [email,setEmail] = useState("");
  const {loading} = useSelector((state) => state.auth)

  const handleOnSubmit = (e) =>{
    e.preventDefault();
    dispatch(sendPasswordResetToken(email,setEmailSent));    
  }

  return (
    <div className="grid place-items-center min-h-[calc(100vh-3.5rem)] font-inter">
      {
        loading ? (
          <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
            <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
            <div>Loading...</div>
          </div>
        ):(
          <div className="text-white flex justify-center flex-col max-w-[500px] p-4 gap-y-6">
            <h1 className="font-semibold text-3xl">
              {!emailSent ?  "Reset Your Password" : "Check Your Email"}
            </h1>
            <p className="text-lg text-richblack-100">{!emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : `We have sent the reset email to ${email}`}</p>
            <form onSubmit={handleOnSubmit}>
              {
                !emailSent && (
                  <label className='w-full'>
                    <p className='mb-1 text-sm text-richblack-5 font-medium'>Email Address <sup className='text-pink-200'> *</sup></p>
                    <input type="text" required name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter email address' className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.50)]'/>
                  </label>
                )
              }
              <button type='submit' className='w-full mt-6 rounded-md bg-yellow-50 py-2 px-3 font-medium text-richblack-900 text-lg'>
                { !emailSent ? "Reset Password" : "Resend Email"}
              </button>
            </form>
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

export default ForgotPassword

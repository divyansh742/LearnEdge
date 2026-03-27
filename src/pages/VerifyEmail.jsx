import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdHistory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { useState } from "react";
import { sendOtp, signUp } from "../services/Operations/authApi";

const VerifyEmail = () => {
    const {loading, signUpData} = useSelector((state) => state.auth);
    const [otp,setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if(!signUpData)
        navigate("/signup")


    const handleOnSubmit = (e) =>  {
        e.preventDefault();
        const {accountType,firstName,lastName,email,password,confirmPassword,} = signUpData;
        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate));
    }
  return (
    <div className="grid place-items-center min-h-[calc(100vh-3.5rem)] font-inter">
    {
        loading ? (
            <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
                <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
                <div>Loading...</div>
            </div>
        ) : (
            <div className="text-white flex justify-center flex-col max-w-[500px] p-4 gap-y-6">
                <h1 className="font-semibold text-3xl">Verify Email</h1>
                <p className="text-lg text-richblack-100">A verification code has been sent to you. Enter the code below</p>
                <form onSubmit={handleOnSubmit}>
                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                            <input {...props} placeholder="-" style={{}}//this helps in working tailwind classname
                            className="w-[60px] h-[48px] border-0 text-2xl bg-richblack-800 rounded-lg text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]"
                            />
                        )}
                        containerStyle={"justify-between"}
                    />
                    
                    <button type='submit' className='w-full mt-6 rounded-md bg-yellow-50 py-2 px-3 font-medium text-richblack-900 text-lg'>
                        Verify Email
                    </button>
                    
                </form>

                <div className="flex justify-between px-2">
                    <Link to="/login" className="flex items-center gap-x-2 font-inter font-semibold text-richblack-5">
                        <AiOutlineArrowLeft/> Back to Login
                    </Link>
                    <button onClick={() => dispatch(sendOtp(signUpData.email,navigate))}className="flex text-blue-100 gap-x-1 items-center">
                        <MdHistory fontSize={20}/> Resend it
                    </button>
                </div> 

            </div>

        )
    }
      
    </div>
  )
}

export default VerifyEmail

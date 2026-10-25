import {apiConnector} from "../apiConnector"
import {setLoading, setToken} from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";
import {authEndpoints} from "../api"
import {toast} from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utils/constant";

const {LOGIN_API,SIGNUP_API,SEND_OTP_API,RESET_PASSWORD_TOKEN_API,RESET_PASSWORD_API,LOGOUT_API} = authEndpoints;


export function sendOtp(email,navigate){
  return async (dispatch)=>{
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST",SEND_OTP_API,{
        email
      })
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("OTP sent successfully")
      navigate("/verify-email");
    } catch (error) {
      const message = error.response?.status === 401 ? "User Already Exist with this email" : "Could Not Send OTP"
      toast.error(message)
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }


}

export function signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate){
  return async(dispatch)=>{
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST",SIGNUP_API,{
        accountType,firstName,lastName,email,password,confirmPassword,otp
      }) 
      if(!response.data.success)      {
        throw new Error(response.data.message);
      }
      toast.success("SignUp Successfull")
      navigate("/login")
    } catch (error) {
      const message = error.response?.data?.message || "SignUp Failed"
      toast.error(message);
      if(!message.includes("OTP"))
        navigate("/signup")      
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }

}

export function login(email,password,navigate) {
  return async (dispatch) =>{
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST",LOGIN_API,{
        email,
        password,
      })
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser({...response.data.user}))
      // localStorage.setItem("token",JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if(response?.data?.user?.accountType === ACCOUNT_TYPE.STUDENT)
        navigate("/dashboard/enrolled-courses")
      if(response?.data?.user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
        navigate("/dashboard/instructor");
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login Failed"
      toast.error(message)
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
  
}

export function logout(navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loggin Out....");
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("rzp_checkout_anon_id")
    localStorage.removeItem("rzp_device_id")
    localStorage.removeItem("rzp_stored_checkout_id")
    try {
      const response = await apiConnector("POST",LOGOUT_API);
      if(!response.data.success)
        throw new Error(response.data.message);
      toast.success("Logged Out")
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login Failed"
      toast.error(message)
    }
    navigate("/")
    toast.dismiss(toastId);
  }
}

export function sendPasswordResetToken(email,setEmailSent){
  return async(dispatch) =>{
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API,{email});
      if(!response.data.success)
        throw new Error(response.data.message);
      toast.success("Password Reset Email Sent Succesfully");
      setEmailSent(true);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Reset Email Sending Failed";
      toast.error(message);      
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}
export function resetPassword(password,confirmPassword,token,setEmail,setResetComplete){
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST",RESET_PASSWORD_API,{
        password,
        confirmPassword,
        token
      })
      if(!response.data.success)
        throw new Error(response.data.message);
      setEmail(response.data.email)
      setResetComplete(true);
      toast.success("Password has been reset successfully");
    } catch (error) {
      const message = error.response.data.message || error.message || "Password reset failed";
      toast.error(message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }

}
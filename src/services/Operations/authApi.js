import {apiConnector} from "../apiConnector"
import {setLoading, setToken} from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice";
import {authEndpoints} from "../api"
import {toast} from "react-hot-toast";

const {LOGIN_API,SIGNUP_API,SEND_OTP_API,RESET_PASSWORD_TOKEN_API,RESET_PASSWORD_API} = authEndpoints;


export function sendOtp(email,navigate){
  return async (dispatch)=>{
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST",SEND_OTP_API,{
        email
      })
      console.log("Send otp api response ", response);
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("OTP sent successfully")
      navigate("/verify-email");
    } catch (error) {
      console.log("Send OTP API error....",error.message);
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
      console.log("Signup api response ........",response);
      if(!response.data.success)      {
        throw new Error(response.data.message);
      }
      toast.success("SignUp Successfull")
      navigate("/login")
    } catch (error) {
      console.log("SignUp Api error...",error);
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
      console.log("Login Api response...",response)
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser({...response.data.user}))
      localStorage.setItem("token",JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("Login Api Error ", error)
      const message = error.response?.data?.message || error.message || "Login Failed"
      toast.error(message)
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
  
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    // dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
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
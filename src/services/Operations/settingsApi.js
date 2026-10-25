import toast from "react-hot-toast";
import { settingsEndpoints } from "../api";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authApi";

const {UPDATE_DISPLAY_PICTURE_API,UPDATE_PROFILE_API,UPDATE_PASSWORD_API,DELETE_ACCOUNT_API} = settingsEndpoints;

export function updateDisplayPicture(token,formData){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "PUT",UPDATE_DISPLAY_PICTURE_API,formData,{
                    Authorization : `Bearer ${token}`,
                }
            )
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Display Picture Updated Sucessfully");
            localStorage.setItem("user", JSON.stringify(response.data.updatedProfile));
            dispatch(setUser(response.data.updatedProfile));
            
        } catch (error) {
            toast.error(error.message);
            
        }
        toast.dismiss(toastId);
    }

}

export function updatedProfile(data){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("PUT",UPDATE_PROFILE_API,data);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Profile Updated Succesfully");
            dispatch(setUser(response.data.updateUserDetails));
            localStorage.setItem("user", JSON.stringify(response.data.updateUserDetails));
            
        } catch (error) {
            toast.error(error.message);
        }
        toast.dismiss(toastId);
    }
}

export function updatePassword(data,token){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("POST",UPDATE_PASSWORD_API,data,{
                Authorization: `Bearer ${token}`,
            })
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Password Changed Sucessfully");

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        }
        toast.dismiss(toastId);
    }
}
export function deleteAccount(navigate,token){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("DELETE",DELETE_ACCOUNT_API,{},{
                Authorization: `Bearer ${token}`,
            })
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Account Deleted Succesfully");
            dispatch(logout(navigate));
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
        }
        toast.dismiss(toastId);
    }
}
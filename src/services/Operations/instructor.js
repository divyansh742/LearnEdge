import { instructorEndpoints } from "../api";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
const {GET_INSTRUCTOR_DASHBOARD_API} = instructorEndpoints
export function instructorDashboard(setCourses,setLoading){
    return async (dispatch) => {
        setLoading(true);
        try {
            const response = await apiConnector("GET",GET_INSTRUCTOR_DASHBOARD_API)
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }
            setCourses(response?.data?.courses);            
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
        }
        setLoading(false);
    }
}
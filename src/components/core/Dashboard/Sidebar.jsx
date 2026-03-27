
import { useSelector } from "react-redux";
import {sidebarLinks} from "../../../data/dashboard-links";
import { logout } from "../../../services/Operations/authApi";
import { Link } from "react-router-dom";


const Sidebar = () => {

    const {user,loading:profileLoading} = useSelector((state) => state.profile); 
    const {loading:authLoading} = useSelector((state)=> state.auth);

    if (profileLoading || authLoading) {
        return (
            <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
                <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
                <div>Loading...</div>
            </div>
        );
    }
  return (
    <div>
        <div className="flex min-w-[200px] flex-col border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10">
            <div>
                {
                    sidebarLinks.map((element,index) =>{
                        if(element?.type !== user?.accountType) return null;
                        

                    })
                }
            </div>


        </div>  
    </div>
  )
}

export default Sidebar

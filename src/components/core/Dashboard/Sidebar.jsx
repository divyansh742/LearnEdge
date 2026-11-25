
import { useDispatch, useSelector } from "react-redux";
import {sidebarLinks} from "../../../data/dashboard-links";
import { logout } from "../../../services/Operations/authApi";
import {useNavigate } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user,loading:profileLoading} = useSelector((state) => state.profile); 
    const {loading:authLoading} = useSelector((state)=> state.auth);

    const [ConfirmationModalData,setConfirmationModalData] = useState(null);

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
        <div className="flex md:min-w-[200px] w-full md:flex-col md:border-r-richblack-700 h-full items-center md:border-r bg-richblack-800 md:py-10">
            <div className="flex md:flex-col mx-auto w-full justify-between">
                {
                    sidebarLinks.map((element) =>{
                        if(element.type != null &&  element?.type !== user?.accountType) return null;
                        return (<SidebarLink key={element.id} link={element} iconName={element.icon}/>)
                    })
                }
                <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700 hidden md:block" />
                <div className="flex md:flex-col">
                    <SidebarLink 
                        link={{name:"Settings" , path: "/dashboard/settings"}}
                        iconName="VscSettingsGear"
                    />
                    <button 
                        onClick={() => {
                            setConfirmationModalData({
                                text1 : "Are you Sure",
                                text2 : "You will be logged out of your account",
                                btn1text : "Logout",
                                btn2text : "Cancel",
                                btn1Handler : () => dispatch(logout(navigate)),
                                btn2Handler : () => setConfirmationModalData(null)
                            })
                        }}
                        className="px-8 py-2 w-full text-sm font-medium text-richblack-300"
                    >
                        <div className="flex  items-center md:gap-x-3" title="Logout"> 
                            <VscSignOut className="text-lg"/>
                            <span className="hidden md:block">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
        </div> 
        {ConfirmationModalData && <ConfirmationModal modalData={ConfirmationModalData}/>} 
    </div>
  )
}

export default Sidebar

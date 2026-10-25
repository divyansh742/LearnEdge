import { useSelector } from "react-redux"
import IconBtn from "../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import truncateWords from "../../../utils/truncateWords";



const MyProfile = () => {
  

  const {user} = useSelector((state) => state.profile);
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-11/12 max-w-full py-10 text-richblack-5" >
          <p className="mb-14 text-3xl font-medium text-richblack-5">My Profile</p>
          <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 mb-10">
            <div className="flex gap-x-4 items-center">
              <img src={user?.image} className="rounded-full object-cover aspect-square w-20" alt="profile"/>
              <div className="flex flex-col space-y-1">
                <p className="text-lg font-semibold text-richblack-5">{user?.firstName + " " + user?.lastName}</p>
                <p className="text-sm text-richblack-300">{user?.email}</p>
              </div>
            </div>
            <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            </IconBtn>
          </div>
          <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 mb-10">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-richblack-5">About</p>
              <p className="text-sm text-richblack-300">{user?.additionalDetails?.about ?  truncateWords(30,user.additionalDetails.about) : "Write Something about Yourself" }</p>
            </div>
            <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            </IconBtn>
          </div>
          <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="space-y-8">
              <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
              <div className="flex justify-between gap-x-32">
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-1">
                    <span  className="text-sm text-richblack-300">First Name</span>
                    <span className="text-sm">{user?.firstName}</span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-sm text-richblack-300">Email</span>
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span  className="text-sm text-richblack-300">Gender</span>
                    <span className="text-sm">{user?.additionalDetails?.gender ? user.additionalDetails.gender : "Add your Gender"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-1">
                    <span  className="text-sm text-richblack-300">Last Name</span>
                    <span className="text-sm">{user?.lastName}</span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-sm text-richblack-300">Phone Number</span>
                    <span className="text-sm">{user?.additionalDetails?.contactNumber ? user.additionalDetails.contactNumber : "Add Phone Number"}</span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span  className="text-sm text-richblack-300">Date of Birth</span>
                    <span className="text-sm">{user?.additionalDetails?.dateOfBirth ? user.additionalDetails.dateOfBirth : "Add your Date of Birth"}</span>
                  </div>
                </div>
                </div>
            </div>
            <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            </IconBtn>
          </div>
    </div>
  )
}

export default MyProfile

import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom"; 
import Sidebar from "../components/core/Dashboard/Sidebar";
import Footer from "../components/common/Footer";

const Dashboard = () => {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  if (profileLoading || authLoading) {
    return (
      <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
        <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] font-inter">
        <Sidebar />
        <div className=" overflow-auto flex-1">
          <div className="mx-auto w-11/12 max-w-maxContent py-10">
              <Outlet/>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Dashboard;

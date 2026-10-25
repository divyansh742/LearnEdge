import "./App.css";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard"
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import Category from "./pages/Category";
import Course from "./pages/Course";
import Checkout from "./components/core/Dashboard/Checkout";
import VideoDetails from "./pages/VideoDetails";
import { ACCOUNT_TYPE } from "./utils/constant";
import { useSelector } from "react-redux";
import InstructorCourses from "./components/core/Dashboard/InstructorCourses";
import InstructorPage from "./pages/InstructorPage";
import AddCourse from "./components/core/Dashboard/AddCourse";
import InstructorDashboard from "./components/core/Dashboard/InstructorDashboard";
function App() {
  const {user} = useSelector((state) => state.profile);
  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblack-900 font-inter custom-scrollbar">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route 
          path="login"
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />
        <Route 
          path="signup"
          element={
            <OpenRoute>
              <SignUp/>
            </OpenRoute>
          }
        />
        <Route 
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
        />
        <Route 
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
        />
        <Route 
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />
        <Route path="about" element={<About/>}/>
        <Route path="contact" element={<Contact/>}/>
        <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          <Route path="dashboard/my-profile" element={<MyProfile/>}/>
          <Route path="dashboard/settings" element={<Settings/>}/>
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (<>
            <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
            <Route path="dashboard/cart" element={<Cart/>}/>
            <Route path="dashboard/checkout" element={<Checkout/>}/>
          </>)}
          { user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/my-courses" element={<InstructorCourses/>}/>
              <Route path="dashboard/Instructor" element={<InstructorDashboard/>}/>
              <Route path="dashboard/add-course" element={<AddCourse/>}/>
            </>
          )

          }
        </Route>
        {user?.accountType === ACCOUNT_TYPE.STUDENT && (<><Route path="course-content/:courseId" element={<VideoDetails/>}/></>)}
        <Route path="catalog/:categoryId" element={<Category/>}/>
        <Route path="courses/:courseId" element={<Course/>}/>
        <Route path="instructor/:instructorId" element={<InstructorPage/>}/>
        {/* //always place this route at last */}
        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;

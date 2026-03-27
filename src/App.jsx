import "./App.css";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import OpenRoute from "./components/core/Auth/OpenRoute";
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
function App() {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblack-900 font-inter">
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
        <Route path="dashboard/my-profile" element={<MyProfile/>}/>
        {/* //always place this route at last */}
        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;

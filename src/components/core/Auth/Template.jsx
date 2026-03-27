import { useSelector } from "react-redux"
import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignUpForm from "./SignUpForm"
const Template = (
        {title,description1, description2,image,formType}
) => {
  const {loading} = useSelector((state)=>state.auth)
  return (
    <div className="grid place-items-center font-inter min-h-[calc(100vh-3.5rem)] mt-8">
      {loading ? (
        //spinnerloading
        <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
          <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
          <div>Loading...</div>
        </div>
      ) : (
        //main-div
        <div className="mx-auto flex w-11/12 max-w-maxContent justify-between gap-y-12 py-12 gap-x-12">
          {/* leftbox */}
          <div className="w-11/12 max-w-[450px]">
            <h1 className="font-semibold text-richblack-5 leading-9 text-3xl max-w-[450px]">{title}</h1>
            <p className="mt-4 text-[1.225rem] leading-7">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="text-blue-100  font-edu-sa font-bold italic">{description2}</span>
            </p>
            {formType === "signup" ? <SignUpForm/> : <LoginForm/>}
          </div>
          {/* rightbox */}
          <div className="relative w-11/12 max-w-[450px]">
            <img src={frameImg} alt="Pattern" loading="lazy" width={558} height={504}/>
            <img src={image} alt="Students" loading="lazy" width={558} height={504} className="absolute -top-4 right-4 z-10"/> 
          </div>

          
        </div>

      )
      }
        
      
    </div>
  )
}

export default Template

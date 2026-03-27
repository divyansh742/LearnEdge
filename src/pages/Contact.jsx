import { MdMessage } from "react-icons/md";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import ContactForm from "../components/common/ContactForm";
import ReviewSection from "../components/core/HomePage/ReviewSection";
import Footer from "../components/common/Footer";



const Contact = () => {
  return (
    <div>
        <div className="w-11/12 max-w-maxContent text-white mx-auto flex justify-between gap-8 mt-24">
            <div className="bg-richblack-800 max-h-max p-14 flex flex-col gap-8 w-[50%] rounded-lg">
                <div>
                    <div className="flex  items-center gap-3 text-2xl font-semibold">
                        <MdMessage/>
                        <p className="text-xl">Chat on us</p>
                    </div>
                    <p className="text-richblack-200 text-sm ml-9">Our friendly team is here to help.</p>
                    <p className="text-richblack-100 text-base font-normal ml-9">info@studynotion.com</p>
                </div>
                <div>
                    <div className="flex  items-center gap-3 text-2xl font-semibold">
                        <FaGlobeAmericas/>
                        <p className="text-xl">Visit us</p>
                    </div>
                    <p className="text-richblack-200 text-sm ml-9">Come and say hello at our office HQ.</p>
                    <p className="text-richblack-100 text-base font-normal ml-9">Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                </div>
                <div>
                    <div className="flex items-center gap-3 text-2xl font-semibold">
                        <IoCall/>
                        <p className="text-xl">Call us</p>
                    </div>
                    <p className="text-richblack-200 text-sm ml-9">Mon - Fri From 8am to 5pm</p>
                    <p  className="text-richblack-100 text-base font-normal ml-9">+91 1234567890</p>
                </div>
            </div>
            <div className="text-richblack-400 flex flex-col gap-5 border-richblack-700 border rounded-xl p-16">
                <h1 className="text-richblack-5 text-4xl font-semibold leading-10">Got a Idea? We've got the skills. Let's team up</h1>
                <p className="text-lg font-medium mb-7">Tell us more about yourself and what you're got in mind.</p>
                <ContactForm/>
            </div>
        </div>
        <div className='mx-auto w-11/12 items-center text-white max-w-maxContent bg-richblack-900 gap-8'>
            <h2 className='text-center text-4xl font-semibold mt-32'>Review from other Learners</h2>
                {/* Review slider */}
                <ReviewSection/>
        </div>
        <Footer/>

    </div>

  )
}

export default Contact

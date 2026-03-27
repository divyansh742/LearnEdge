import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import {Link} from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/CTAButton';
import banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore';
import Footer from '../components/common/Footer';
import ReviewSection from '../components/core/HomePage/ReviewSection';
const Home = () => {
  return (
    <div>
      {/* Section - 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 items-center text-white  justify-between max-w-maxContent'>

        <Link to={"/signup"} className='mt-16'>
          <div className='group  p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.18)] hover:shadow-none '>
            <div className='flex items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                <p>Become an Instructor</p>  
                <FaArrowRight/>
            </div>
          </div>
        </Link>

        <div className='text-center text-4xl font-semibold mt-7 '>
            Empower Your Future With <HighlightText text={"Coding Skills"}/>
        </div>

        <div className='mt-4 font-bold text-lg text-center text-richblack-300 w-[90%]'> 
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        <div className='flex gap-7 mt-8'>
            <CTAButton active={true} linkTo={"/signup"}>Learn More</CTAButton>
            <CTAButton active={false} linkTo={"/login"}>Book a demo</CTAButton>
        </div>

        <div className='mx-3 my-14 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>    
            <video muted loop autoPlay className='shadow-[20px_20px_rgba(255,255,255)]'>
                <source src={banner} type='video/mp4'/>
            </video>
        </div>

        <div>
            <CodeBlocks 
                position={"lg:flex-row"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock your <HighlightText text={"coding potential"}/> with our online courses
                    </div>
                }
                subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        text: "Try it Yourself",
                        linkTo: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        text: "Learn More",
                        linkTo: "/login",
                        active: false,
                    }
                }
                codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</\ntitle><link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</\na><a href="three/">Three</a>\n</nav>\n</body>\n</html>`}
                codeColor={"text-yellow-25"}
                bgGradient={"bg-gradient-1"}
            />
            <CodeBlocks 
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Start <HighlightText text={"coding in seconds"}/>
                    </div>
                }
                subheading={
                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctabtn1={
                    {
                        text: "Continue Lesson",
                        linkTo: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        text: "Learn More",
                        linkTo: "/login",
                        active: false,
                    }
                }
                codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</\ntitle><link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</\na><a href="three/">Three</a>\n</nav>\n</body>\n</html>`}
                codeColor={"text-blue-25"}
                bgGradient={"bg-gradient-2"}
            />
        </div> 

        <ExploreMore/>
      </div>

      {/* Section - 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='bg-[url("./assets/Images/bghome.svg")] h-[310px]'>{/*div used to give background*/}
            <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto justify-between'>
                <div className='h-[180px]'></div> {/*div used to give margin*/}
                <div className='flex gap-7 text-white'>
                    <CTAButton active={true} linkTo={"/signup"}>
                        <div className='flex gap-3 items-center'>
                            Explore Full Catalog
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={false} linkTo={"/signup"}>
                        <div>
                            Learn More
                        </div>
                    </CTAButton>


                </div>
            </div>

        </div>
        <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-7 mx-auto justify-between'>
            <div className='flex mb-10 mt-20 justify-center gap-6'>
                <div className='text-4xl font-semibold w-[45%]'>
                    Get the skills you need for a <HighlightText text={"job that is in demand"}/>
                </div>
                <div className='flex flex-col gap-10 w-[45%] items-start'>
                    <div className='text-[16px]'>
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkTo={"/signup"}>
                        <div>
                            Learn More
                        </div>
                    </CTAButton>


                </div>

            </div>

            <TimelineSection/>
            <LearningLanguageSection/>

        </div>
      </div>

      {/* Section - 3 */}
      <div className='mx-auto flex flex-col w-11/12 items-center text-white  justify-between max-w-maxContent bg-richblack-900 gap-8'>
        <InstructorSection/>
        <h2 className='text-center text-4xl font-semibold mt-32'>Review from other Learners</h2>
        {/* Review slider */}

        <ReviewSection/>

      </div>


      {/* Footer */}
      <Footer/>

    </div>
  )
}

export default Home

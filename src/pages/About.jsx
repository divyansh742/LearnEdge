import HighlightText from "../components/core/HomePage/HighlightText"
import image1 from "../assets/Images/aboutus1.webp"
import image2 from "../assets/Images/aboutus2.webp"
import image3 from "../assets/Images/aboutus3.webp"
import foundingImage from "../assets/Images/FoundingStory.png"
import CTAButton from "../components/core/HomePage/CTAButton"
import ContactForm from "../components/common/ContactForm"
import ReviewSection from "../components/core/HomePage/ReviewSection"
import Footer from "../components/common/Footer"



const section4Data = [
    { title: "Active Students", value: "5K",},
    { title: "Mentors", value: "10+",},
    { title: "Courses", value: "200+",},
    { title: "Awards", value: "50+",},
]
const section5Data = [
    { title: "Curriculum Based on Industry Needs", description : "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."},
    { title: "Our Learning Methods", description : "Studynotion partners with more than 275+ leading universities and companies to bring"},
    { title: "Certification", description : "Studynotion partners with more than 275+ leading universities and companies to bring"},
    { title: "Rating", description : "Studynotion partners with more than 275+ leading universities and companies to bring"},
    { title: "Curriculum Based on Industry Needs", description : "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."},
]
const About = () => {
  return (
    <div>
        {/* section-1  image-section*/}
        <section className="bg-richblack-700">
            <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent text-center text-white font-inter pt-14 gap-y-20">
            <header className="mx-auto w-[64%] text-center">                
                <h1 className="font-semibold text-4xl">Driving Innovation in Online Education for a <HighlightText text={"Brighter Future"}/></h1>
                <p className="mt-3 mb-10 text-base font-semibold text-richblack-300">Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </header>
            {/* //div to place images absolute thus margin*/}
            <div className="h-[150px]"></div>
                <div className="flex gap-3 w-full justify-between absolute top-[55%]">
                    <img src={image1} alt="about-1" />
                    <img src={image2} alt="about-2" />
                    <img src={image3} alt="about-3" />

                </div>
            </div>
        </section>

        {/* section-2 highlight text*/}
        <section className="border-b border-richblack-700">
            <div className="mx-auto w-11/12 max-w-maxContent flex flex-col gap-10">
                <div className="h-[100px]"></div>
                    <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
                    We are passionate about revolutionizing the way we learn. Our
                    innovative platform <HighlightText text={"combines technology"} />,{" "}
                    <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
                        {" "}
                        expertise
                    </span>
                    , and community to create an
                    <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
                        {" "}
                        unparalleled educational
                    experience.
                    </span> 
                </div>
            </div>
        </section>

        {/* section-3 founding-story */}
        <section>
            <div className="mx-auto flex flex-col w-11/12 max-w-maxContent text-richblack-500 gap-y-36 my-24 ">
                <div className="flex gap-48 items-center">
                    <div className="flex flex-col gap-6">
                        <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent">Our Founding Story</h1>
                        <p className="text-base font-semibold text-richblack-300">Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>
                        <p className="text-base font-semibold text-richblack-300">As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                    </div>
                    <img src={foundingImage} alt="founding-story" className="shadow-[0_0_20px_0] shadow-[#FC6767]"/>
                </div>
                <div className="flex gap-48">
                    <div className="flex flex-col gap-6">
                        <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent">Our Vision</h1>
                        <p className="text-base font-semibold text-richblack-300">With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h1  className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold ">Our Mission</h1>
                        <p className="text-base font-semibold text-richblack-300">Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* section-4 stats-section*/}
        <section className="bg-richblack-700">
            <div className="w-11/12 max-w-maxContent flex justify-around py-9 text-center mx-auto">
                {
                    section4Data.map((element,index) =>{
                        return(
                        <div key={index} >
                            <h1 className="text-3xl font-bold text-richblack-5">{element.value}</h1>
                            <p className="text-base font-semibold text-richblack-500">{element.title}</p>
                        </div>
                    )})
                    
                }
            </div>
        </section>

        {/* section-5 LearningGrid-section*/}
        <section>
            <div className="grid grid-cols-4 font-inter mx-auto w-11/12 max-w-maxContent mt-10">
                <div className="col-span-2 flex flex-col p-6 gap-7 w-[90%]">
                    <h1 className="text-4xl text-richblack-5 font-bold ">World-Class Learning for <HighlightText text={"Anyone, Anywhere"}/></h1>
                    <p className="text-richblack-5">Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.</p>
                    <div className="w-fit">
                    <CTAButton active={true} linkTo="/">Learn More</CTAButton></div>
                </div>
                {
                    section5Data.map((element,index) => {
                        return(
                            <div key={index} className={`${index % 2 === 0 ? "bg-richblack-700": "bg-richblack-800"} ${index === 2 && "col-start-2"}   flex flex-col p-7 gap-8`}>
                                <h1 className="text-richblack-5 text-lg">{element.title}</h1>
                                <p className="text-richblack-300 text-medium">{element.description}</p>
                            </div>
                        )
                    }) 
                }

            </div>

        </section>

        {/* contact-form-section */}
        <div className="mx-auto w-11/12 items-center text-white max-w-maxContent bg-richblack-900 gap-8 flex flex-col">
            <div className="text-center flex flex-col gap-3">
                <h1 className="text-4xl font-semibold mt-32">Get in Touch</h1>
                <p className="text-richblack-300 text-medium">We'd love to hear for you, Please fill out this form.</p>
            </div>
            <div className="w-[40%] mx-auto">
                <ContactForm/>
            </div>
        </div>

        {/* Review Section */}
        <div className='mx-auto w-11/12 items-center text-white max-w-maxContent bg-richblack-900 gap-8'>
            <h2 className='text-center text-4xl font-semibold mt-32'>Review from other Learners</h2>
            {/* Review slider */}
            <ReviewSection/>
        </div>

        <Footer/>
        
    </div>
  )
}

export default About

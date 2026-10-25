import React from 'react'
import logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timeLineImage from '../../../assets/Images/TimelineImage.png'
const timeLine = [
    {
        logo: logo1,
        heading: "Leadership",
        desc: "Fully committed to the success company",
    },
    {
        logo: logo2,
        heading: "Responsibility",
        desc: "Students will always be our top priority",
    },
    {
        logo: logo3,
        heading: "Flexibility",
        desc: "The ability to switch is an important skills",
    },
    {
        logo: logo4,
        heading: "Solve the problem",
        desc: "Code your way to a solution",
    },
]
const TimelineSection = () => {
  return (
    <div>
        <div className='flex gap-20 items-center mb-20'>
            <div className='w-[45%] flex flex-col gap-5'>
                {
                    timeLine.map((element,index) => {
                        return(
                            <div className='flex gap-6' key={index}>
                                <div className='flex flex-col items-center'>
                                    <div className='w-[50px] h-[50px] bg-white flex items-center rounded-full justify-center'>
                                        <img src={element.logo} alt='logo'/>
                                    </div>
                                    <div className={`${(index === 3) ? "hidden": ""} w-[42px] border-dashed border border-richblack-100 rotate-90 self-center mt-8  mb-5 opacity-90 `}>
                                    </div>
                                </div>
                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.desc}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='relative w-[55%] shadow-blue-200 shadow-[0px_0px_30px_0px] '> 
                 <img src={timeLineImage} alt='timelineimg' className='shadow-white shadow-[20px_20px_0px_0px] object-cover w-fit'/>

                 <div className='absolute bg-caribbeangreen-700 flex text-white py-7 uppercase left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <div className='flex items-center border-r border-caribbeangreen-300 px-7 gap-5'>
                        <p className='text-3xl font-bold '>10</p>
                        <p className='text-caribbeangreen-300 text-sm '>YEARS EXPERIENCES</p>
                    </div>
                    <div className='flex items-center px-7 gap-5'>
                        <p className='text-3xl font-bold '>250</p>
                        <p className='text-caribbeangreen-300 text-sm '>TYPES OF COURSES</p>
                    </div>

                 </div>
            </div>
        </div>
      
    </div>
  )
}

export default TimelineSection

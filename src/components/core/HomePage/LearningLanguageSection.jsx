import React from 'react'
import HighlightText from './HighlightText'
import knowYourProgress from '../../../assets/Images/Know_your_progress.svg'
import compareWithOthers from '../../../assets/Images/Compare_with_others.svg'
import planYourLessons from '../../../assets/Images/Plan_your_lessons.svg'
import CTAButton from './CTAButton'


const LearningLanguageSection = () => {
  return (
    <div className='mt-20 mb-20'>
      <div className='flex flex-col gap-5  items-center'>
        <div className='text-4xl font-semibold text-center'>
            Your swiss knife for <HighlightText text={"learning any language"}/>
        </div>
        <div className='text-base text-richblack-600 mx-auto text-center mt-3 w-[80%] font-medium'>Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</div>

        <div className='flex justify-center items-center mt-5 mb-3'>
                <img src={knowYourProgress} alt="knowyourprogress" className='-mr-32 object-contain'/>
                <img src={compareWithOthers} alt="compareWithOthers" className='object-contain'/>
                <img src={planYourLessons} alt="planYourLesson" className='-ml-36 object-contain'/>
        </div>
        <CTAButton active={true} linkTo={"/signup"}><div>Learn More</div></CTAButton>
      </div>
    </div>
  )
}

export default LearningLanguageSection

import React from 'react'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'
const CodeBlocks = (
    {position , heading, subheading, ctabtn1, ctabtn2, codeblock, bgGradient, codeColor}
) => {
  return (
    <div className={`flex ${position} my-[10rem] justify-between items-center  gap-10`}>
        {/* section -1 */}
        <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold'>
                {subheading}
            </div>
            <div className='flex gap-7 mt-7'>
                <CTAButton active = {ctabtn1.active} linkTo={ctabtn1.linkTo}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.text}
                        <FaArrowRight/>
                    </div>
                </CTAButton>
                <CTAButton active = {ctabtn2.active} linkTo={ctabtn2.linkTo}>
                        {ctabtn2.text}
                </CTAButton>
            </div>
        </div>


        {/* section-2 */}
        <div className='h-fit flex  w-[40%] py-4  bg-gradient-3 border-richblack-400 border-2  relative'>
            <div className={`${bgGradient} absolute rounded-full blur-[34px] h-[300px] w-[372.95px] opacity-20 left-[calc(50%-300px)] top-[calc(50%-230px)] [transform:matrix(1,0,-0.03,1,0,0)]`}></div>
            <div className='text-center w-[10%] flex flex-col font-inter text-richblack-400 font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
                <p>12</p>
                <p>13</p>
            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                <TypeAnimation
                    sequence={[codeblock, 2000, ""]}
                    repeat={Infinity}
                    cursor={true}
                    omitDeletionAnimation={true}
                    style={
                        {
                            whiteSpace: "pre-line",
                            display: "block"
                        }
                    }
                />

            </div>

        </div>
    </div>
  )
}

export default CodeBlocks

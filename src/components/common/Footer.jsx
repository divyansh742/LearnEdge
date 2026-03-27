import React from 'react'
import companyImage from '../../assets/Logo/LearnEdge_Logo-removebg-preview.png'
import FooterCard from './FooterCard'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='bg-richblack-800'>
        <div className='w-11/12 mx-autoflex flex lg:flex-col max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-16'>
            <div className='flex flex-row gap-8 '>
                {/* leftbox */}
                <div className='grid grid-cols-3 w-[50%] gap-14 border-richblack-700 border-r'>
                    <div className='flex flex-col gap-3'>
                        <img src={companyImage} alt="comapanyImage" className='w-fit -mt-4 -ml-4' />
                        <FooterCard title={"Company"}/>
                        <div className='flex gap-3 '>
                            <Link to={"/facebook-page"}><FaFacebook/></Link>
                            <Link to={"/google-page"}><FaGoogle/></Link>
                            <Link to={"/twitter-page"}><FaTwitter/></Link>
                            <Link to={"/youtube-page"}><FaYoutube/></Link>
                        </div>
                    </div>
                    <div  className='flex flex-col gap-8'>
                        <FooterCard title={"Resources"}/>
                        <FooterCard  title={"Support"}/>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <FooterCard title={"Plans"}/>
                        <FooterCard  title={"Community"}/>
                    </div>

                </div>
                {/* rightbox */}
                <div className='grid grid-cols-3 w-[50%] gap-14'>
                    <FooterCard title={"Subjects"}/>
                    <FooterCard title={"Languages"}/>
                    <FooterCard title={"Career building"}/>

                </div>
            </div>
            <div className='flex justify-between items-center border-richblack-700 border-t pt-10 mt-5'> 
                <div className='flex text-[14px] font-medium font-inter text-richblack-400 transition-all duration-150 gap-2'>
                    <div><Link to={"/privacy-policy"} className=' cursor-pointer hover:text-richblack-50 border-r border-richblack-700 pr-2'>Privacy Policy</Link></div>
                    <div><Link to={"/cookie-policy"} className='cursor-pointer hover:text-richblack-50 border-r border-richblack-700 pr-2 '>Cookie Policy</Link></div>
                    <div><Link  to={"/terms"} className='cursor-pointer hover:text-richblack-50 '>Terms</Link></div>
                </div>
                <div>Made with <span className='text-pink-300'>♥</span> by Divyansh Vishwakarma © 2026 LearnEdge</div>
            </div>

        </div>
    </div>
  )
}

export default Footer

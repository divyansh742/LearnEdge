import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import LogoImage from '../../assets/Logo/LearnEdge_Logo-removebg-preview.png'
import {NavbarLinks} from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { FaChevronDown } from "react-icons/fa";
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categoryEndpoints } from '../../services/api'


const Navbar = () => {
  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);
  const {totalItems} = useSelector((state) => state.cart)
  const location = useLocation();

  const [subLink,setSubLinks] = useState([]);

  const fetchSubLinks = async() => {
      try {
        const result = await apiConnector("GET", categoryEndpoints.GET_ALL_CATEGORIES);
        setSubLinks(result.data.allCategory)
      } catch (error) {
        console.log("Error fetching categories list: ",error.message)
      }
  }
  
  useEffect(() => {
    fetchSubLinks();
  }, [])

  const matchRoute = (route) =>{
    return matchPath({path:route},location.pathname)//match curr url with given
  }
  return (
    <div className='h-15 border-b-richblack-700 border-b-[1px] bg-richblack-800'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between text-richblack-25 mx-auto font-inter'>
          {/* logo */}
          <Link to={"/"}>
            <img src={LogoImage} alt="logo" className='w-[160px] h-fit' loading='lazy' />
          </Link>
          {/* navlink */}
          <nav >
            <ul className='flex gap-x-6  text-xl'>
              {
                NavbarLinks.map((element,index) => {
                  return (
                    <li key={index}>
                      {
                        element.title === "Catalog" ? (
                          <div className=' flex items-center group relative cursor-pointer gap-1'>
                            <p>{element.title}</p><FaChevronDown />
                            <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 '>
                            <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[110%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'></div>
                              {
                                subLink.length ? (
                                  subLink.map((element,index) => {
                                    return(
                                      <Link to={`/catalog/${element.name}`} key={index}>
                                        <div className='text-sm p-1 bg-transparent hover:bg-richblack-100 rounded-md'>{element.name}</div>
                                      </Link>
                                    )
                                  })
                                ) : <div className='text-sm p-1 '>
                                  Catalog Not Available
                                </div>
                              }
                            </div>
                            
                          </div>

                        ) : ( <Link to={element?.path}><p className={`${matchRoute(element?.path)? "text-yellow-25":"text-richblack-25"}`}>{element.title}</p></Link>)
                      }
                    </li>
                  )
                })

              }
            </ul>
          </nav>
          {/* login signup/cart profile */}
          <div className='flex gap-x-4 items-center'>
            {
              user && user?.accountType !== "Instructor" && 
                <Link to={"/dashboard/cart"} className='relative text-2xl flex flex-row-reverse'>
                  <AiOutlineShoppingCart />
                  {totalItems > 0 && (<span className='absolute text-[12px] top-3 left-5 text-richblack-5  '>{totalItems}</span>)}
                </Link>
            }
            {
              token === null && 
                <Link to={"/login"}>
                  <button className='bg-richblue-800 border-richblack-700 border px-[12px] py-[8px] text-richblack-100 rounded-md hover:scale-90 transition-all duration-200'>Log in</button>
                </Link>
            }
            {
              token === null && 
                <Link to={"/signup"}>
                  <button className='bg-richblue-800 border-richblack-700 border px-[12px] py-[8px] text-richblack-100 rounded-md hover:scale-90 transition-all duration-200'>Sign up</button>
                </Link>
            }
            {
              token !== null && <ProfileDropDown/>
            }

          </div>
        </div>

    </div>
  )
}
 
 export default Navbar
 
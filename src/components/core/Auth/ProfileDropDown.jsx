import {useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';

import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { logout } from '../../../services/Operations/authApi';

const ProfileDropDown = () => {
  const {user} = useSelector((state) => state.profile)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open,setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref,() => setOpen(false));
  console.log(user);
  if (user === null)
    return null

  return (
    <div className='w-[32px] ml-3 relative group cursor-pointer'>
        <button onClick={() => setOpen(true)}>
          <img src={user?.image} alt="profile" className='rounded-full w-[32px]'/>
        </button>
        {open && 
          <div ref={ref} onClick={(e) => e.stopPropagation()} className='absolute min-w-max top-[140%] left-[-250%] z-10 divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800 flex flex-col'>
            <Link to={"/dashboard"} onClick={() => setOpen(false)}>
              <div className='flex gap-2 p-2 items-center rounded-sm text-richblack-100 hover:bg-richblack-700  hover:text-richblack-5 font-inter'>
                <MdSpaceDashboard/>
                Dashboard
              </div>
            </Link>
              <div onClick={() => 
                { dispatch(logout(navigate)) 
                  setOpen(false)
                }} 
                className='flex gap-2 p-2 items-center rounded-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-5 font-inter'>
              <MdOutlineLogout/>
              Logout
            </div>
          </div>
        }
    </div>
  )
}

export default ProfileDropDown

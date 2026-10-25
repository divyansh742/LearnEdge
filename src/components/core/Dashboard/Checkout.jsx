import { Link, useLocation, useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {IoChevronBackCircle} from "react-icons/io5"
import { buyCourse } from '../../../services/Operations/paymentApi';

const Checkout = () => {
  const {user,paymentLoading} = useSelector((state) => state.profile);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = location.state?.courses || [];
  const fromCart = location.state?.fromCart || false;
  const totalItems = courses?.length || 0;
  const totalAmount = courses?.length > 0 ? courses.reduce((sum,element) => sum + element.price,0): 0;
  const [formData,setFormData] = useState({
      fullName: user? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      contact: user?.additionalDetails?.contactNumber || "",
  })
  const handleOnChange = (e) => {
      setFormData((prevData) => ({
          ...prevData,
          [e.target.name] : e.target.value,
      }))
  }
  const handleBuyCourse = (e) => {
    e.preventDefault();
    const allCourses = courses.map(course => course._id);
    dispatch(buyCourse(allCourses,formData,navigate,fromCart));
    return;
  }
  if(paymentLoading){
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="flex gap-2 items-center rounded-md bg-richblack-100 px-3 py-2">
          <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }
  return (    
    <div className="mx-auto w-11/12 max-w-full py-10 text-richblack-5" >
      <IoChevronBackCircle onClick={() => navigate(-1)} size={30} className='-mt-9 mb-9' />
      <p className="mb-14 text-3xl font-medium text-richblack-5 font-inter leading-4">Checkout</p>
      <p className='text-md font-semibold text-richblack-500 mb-5'>{courses?.length} Courses to purchase</p>
      <div className='border-richblack-700 border mb-8'></div>
      {
        (courses.length === 0 && (
        <div className='text-richblack-300 text-2xl font-semibold leading-8 mt-20 text-center'>
          No course to purchase                        
        </div>))
      }
      <div className='flex gap-10'>
        {/* courseCard */}
        <div className='w-[65%]'>
          {
              courses.map((element,index) => {
                  return (
                      <div className='flex gap-3 justify-between border-b-richblack-700 border-b mb-10 pb-10' key={index}>
                        <div className='flex gap-3'>
                          <Link to={`/courses/${element._id}`}>
                            <img src={element.thumbnail} alt="thumbnail" className=' rounded-lg w-64 h-36 cursor pointer' />
                          </Link>
                          <div className=' flex flex-col  justify-between '>
                            <Link to={`/courses/${element._id}`}>
                              <p className='font-inter text-md text-richblack-5 font-medium cursor pointer '>{element.courseName}</p>
                            </Link>
                            <span className='text-sm text-richblack-300 cursor pointer z-30'><Link to={`/instructor/${element.instructorName}`}>{element.instructorName}</Link></span>
                            <div>
                              <div className='flex gap-3 items-center '>
                                <p className='font-semibold text-sm text-yellow-100'>{element?.rating}</p>
                                <div className='text-sm flex gap-1'>
                                  <span className={`${(element.rating > 0 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                  <span className={`${(element.rating > 1 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                  <span className={`${(element.rating > 2 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                  <span className={`${(element.rating > 3 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                  <span className={`${(element.rating > 4 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                                </div>
                                <p className='text-sm text-richblack-300'>({element.reviewCount})</p>
                              </div>
                            </div>
                            <p className='text-sm text-richblack-300'>{`${element.subSectionLengthTotal} Videos • ${element.totalDuration} • ${element.categoryName}`}</p>
                          </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                          <p className='text-yellow-50 font-semibold text-2xl'>{`Rs. ${element.price}`}</p>
                        </div>
                      </div>
                  )
              })
          }
        </div>
        {/* price box */}
        { totalItems !== 0 && (<div className='bg-richblack-800 border border-richblack-700 rounded-lg flex flex-col h-fit p-5 w-[35%] gap-6'>
            <div className='gap-2 flex flex-col'>
                <p className='font-semibold'>Payment Details</p>
                <p className='text-sm text-richblack-100'>Complete your purchase details items and providing your payment details to us .</p>
            </div>
            <form  className='flex flex-col gap-6 border border-richblack-700 rounded-lg p-6'>
                {/* fullName */}
                <label className='w-full'>
                    <p className='mb-1 text-sm text-richblack-5 font-medium'>Full Name <sup className='text-pink-200'> *</sup></p>
                    <input type="text" name='fullName' placeholder='Enter Full Name' value={formData.fullName} onChange={handleOnChange}
                    className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                </label>
                {/* Email */}
                <label className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Email ID <sup className='text-pink-200'> *</sup></p>
                <input type="text" name='email' value={formData.email} placeholder = 'Enter Email ID' onChange={handleOnChange}
                className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                </label>
                {/* Phone */}
                <label className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Contact No<sup className='text-pink-200'> *</sup></p>
                <input type="tel" name='contact' value={formData.contact} placeholder = 'Enter Contact No' onChange={handleOnChange}
                className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                </label>
                <div className='flex justify-between border-t border-richblack-700 pt-3 items-center'>
                    <p className='text-richblack-100'>Total</p>
                    <p className='text-sm font-semibold'>{`Rs. ${totalAmount.toLocaleString()}/-`}</p>
                </div>
                <IconBtn text={`Pay Rs. ${totalAmount.toLocaleString()}/-`} icon={true} customClasses="justify-center" onClick={handleBuyCourse}></IconBtn>
            </form>

        </div>)} 
      </div>

    </div>
  )
}

export default Checkout

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { LuTrash2 } from "react-icons/lu";
import { IoChevronBackCircle } from 'react-icons/io5';
import { removeFromCart } from '../../../slices/cartSlice';
import IconBtn from '../../common/IconBtn';
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {cart,totalAmount,totalItems} = useSelector((state) => state.cart);

  return (    
    <div className="mx-auto w-11/12 max-w-full py-10 text-richblack-5" >
      <div className='flex gap-2 items-center mb-10'>
        <IoChevronBackCircle onClick={() => navigate(-1)} size={30} className='md:-mt-5 md:mb-9' />
        <p className="md:mb-14 text-3xl font-medium text-richblack-5 font-inter leading-4">Cart</p>
      </div>
      
      <p className='text-md font-semibold text-richblack-500 mb-5'>{totalItems} Courses in cart</p>
      <div className='border-richblack-700 border mb-8'></div>
      {
        (cart.length === 0 && (
        <div className='text-richblack-300 text-2xl font-semibold leading-8 mt-20 text-center'>
          Cart is Empty                         
        </div>))
      }
      <div className='flex gap-10 md:flex-row flex-col'>
        {/* courseCard */}
        <div className='md:w-[70%]'>
          {
            cart.map((element,index) => {
                return (
                    <div className='flex md:flex-row flex-col gap-3 justify-between border-b-richblack-700 border-b md:mb-10 md:pb-10 mb-4 pb-4' key={index}>
                      <div className='flex gap-3'>
                        <Link to={`/courses/${element._id}`}>
                          <img src={element.thumbnail} alt="thumbnail" className=' rounded-lg w-64 h-36 cursor pointer' />
                        </Link>
                        <div className=' flex flex-col w-full justify-between '>
                          <Link to={`/courses/${element._id}`}>
                            <p className='font-inter text-md text-richblack-5 font-medium cursor pointer '>{element.courseName}</p>
                          </Link>
                          <span className='text-sm text-richblack-300 cursor pointer z-30'><Link to={`/instructor/${element.instructorName}`}>{element.instructorName}</Link></span>
                          <div>
                            <div className='flex gap-3 items-center '>
                              <p className='font-semibold text-sm text-yellow-100'>{element.rating}</p>
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
                      <div className='flex md:flex-col flex-row-reverse justify-between md:justify-start gap-4'>
                        <button onClick={() => dispatch(removeFromCart(element._id))}>
                          <div className='items-center gap-2 flex font-inter text-sm text-pink-200 bg-richblack-800 p-2 rounded-md cursor-pointer border-richblack-700 border'>
                            <LuTrash2 size={20}/>
                            <span>Remove</span>
                            
                          </div>
                        </button>
                        <p className='text-yellow-50 font-semibold text-2xl'>{`Rs. ${element.price.toLocaleString()}`}</p>
                      </div>
                    </div>
                )
            })
          }
        </div>
        {/* price box */}
        { totalItems !== 0 && (<div className='bg-richblack-800 border border-richblack-700 rounded-lg flex md:flex-col flex-row h-fit p-5 md:w-[30%] gap-2 justify-between md:justify-start items-center md:items-start'>
          <div className='gap-1'>
            <p className='text-richblack-300 font-semibold text-md '>Total:</p>
            <p className='text-yellow-50 font-semibold text-2xl'>{`Rs. ${totalAmount ? totalAmount.toLocaleString() : 0}`}</p>
            <p className='text-richblack-500 font-semibold text-sm line-through'>{`Rs. ${totalAmount ? ((totalAmount*1.5).toLocaleString()) : 0}`}</p>
          </div>
          <Link to="/dashboard/checkout" state={{courses: cart,fromCart:true}}>
            <IconBtn text="Buy Now" icon={true} customClasses="justify-center"></IconBtn>
          </Link>
          

        </div>)} 
      </div>

    </div>
  )
}

export default Cart

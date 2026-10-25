import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updatedProfile } from '../../../../services/Operations/settingsApi'
const EditProfile = () => {
  const {user} = useSelector((state)=> state.profile);
  const {token} = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState:{errors,dirtyFields}
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      about: "",
      contactNumber: "",
    }
  });

  useEffect(() => {
  if (user) {
    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      dateOfBirth: user.additionalDetails?.dateOfBirth ?? "",
      gender: user.additionalDetails?.gender ?? "",
      about: user.additionalDetails?.about ?? "",
      contactNumber: user.additionalDetails?.contactNumber ?? "",
    });
  }
  }, [user, reset]);

  const submitUpdateForm = async (data) => {
    const updatedData = {};
    Object.keys(dirtyFields).forEach((key)  => {
      updatedData[key] = data[key];
    });
    updatedData.token = token;
    dispatch(updatedProfile(updatedData));
  }
  
  return (
    <form onSubmit={handleSubmit(submitUpdateForm)}>
      <div className="flex  justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 mb-10 flex-col gap-6">
        <p className='text-white font-semibold text-lg'>Profile Information</p>
          <div className='flex gap-6'>
            {/* firstName */}
            <label className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>First Name</p>
              <input type="text" name='firstName' placeholder="Enter First Name"
              {...register("firstName")}
              className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
              { errors.firstName && (<span>Please enter your First Name</span>)}
            </label>
            {/* lastName */}
            <label className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Last Name</p>
              <input type="text" name='lastName' placeholder="Enter Last Name"
              {...register("lastName")}
              className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
              { errors.lastName && (<span>Please enter your Last Name</span>)}
            </label>
          </div>
          <div className='flex gap-6'>
            {/* Date of Birth */}
            <label className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Date of Birth</p>
              <input type="date" name='Date of Birth' placeholder='Date of Birth' 
              {...register("dateOfBirth")}
              className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
              { errors.dateOfBirth && (<span>Please enter your Date Of Birth</span>)}
            </label>
            {/* Gender */}
            <div className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Gender</p>
              {/* radio container */}
              <div className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] flex py-4 justify-around'>
                {/* <div > */}
                  <label className="flex items-center cursor-pointer select-none group">
                    <input type="radio" name="gender" value="male"  {...register("gender")}  className="sr-only peer" />
                      <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-600 rounded-full mr-2.5 transition-all duration-200 peer-checked:border-[#ffcc00] after:content-[''] after:w-2.5 after:h-2.5 after:bg-[#ffcc00] after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform after:duration-200"></span>
                      <span className="text-sm font-medium text-gray-400 transition-colors duration-200 peer-checked:text-white">Male</span>
                  </label>

                  <label className="flex items-center cursor-pointer select-none group">
                    <input type="radio" name="gender" value="female" {...register("gender")}  className="sr-only peer" />
                    <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-600 rounded-full mr-2.5 transition-all duration-200 peer-checked:border-[#ffcc00] after:content-[''] after:w-2.5 after:h-2.5 after:bg-[#ffcc00] after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform after:duration-200"></span>
                    <span className="text-sm font-medium text-gray-400 transition-colors duration-200 peer-checked:text-white">Female</span>
                  </label>

                  <label className="flex items-center cursor-pointer select-none group">
                    <input type="radio" name="gender" value="other" {...register("gender")}  className="sr-only peer" />
                    <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-600 rounded-full mr-2.5 transition-all duration-200 peer-checked:border-[#ffcc00] after:content-[''] after:w-2.5 after:h-2.5 after:bg-[#ffcc00] after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform after:duration-200"></span>
                    <span className="text-sm font-medium text-gray-400 transition-colors duration-200 peer-checked:text-white">Other</span>
                  </label>
                {/* </div> */}
              </div>
            </div>
          </div>
          <div className='flex gap-6'>
            {/* phoneNo */}
            <label className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Phone Number</p>
              <div className="w-full">
                <input type="tel"  name='phoneNo' placeholder={`${user?.additionalDetails?.contactNumber ? user.additionalDetails.contactNumber : "1234567890"}`}  {...register("contactNumber")} className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                { errors.contactNumber && (<span>{errors.contactNumber}</span>)}
              </div>
            </label>
            {/* About */}
            <label className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>About</p>
              <input type="text" name='about' placeholder={`${user?.additionalDetails?.about ? user.additionalDetails.about : "Enter Bio Details"}`} 
              {...register("about")}
              className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
              { errors.about && (<span>Please enter Bio Details</span>)}
            </label>
          </div>
          <button className='text-center text-[16px] px-5 py-2 rounded-md font-bold hover:scale-95 bg-yellow-50 text-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none w-fit self-end' type='submit'>Save</button>
      </div>
    </form>
  )
}

export default EditProfile

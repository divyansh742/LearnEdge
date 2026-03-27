import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import countryCodes from "../../data/countrycode.json"
import { apiConnector } from "../../services/apiConnector";
import { contactEndpoints } from "../../services/api";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [loading,setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState:{errors,isSubmitSuccessful}
  } = useForm();

  const submitContactForm = async (data) => {
    try {
      setLoading(true);
      const phoneNo = data.countryCode +" "+ data.phoneNo;
      const {firstName,lastName,email,message} = data;
      const response = await apiConnector("POST",contactEndpoints.CONTACT_US_API,{firstName,lastName,email,phoneNo,message});
      if(!response.data.success)      {
        throw new Error(response.data.message);
      }
      toast.success("Message Sent Sucessfully , Check your Mail for Acknowlegement");
    } catch (error) {
      console.log("Contact us api error...",error);
      toast.error("Cant Send Message ")
    }
    setLoading(false);
  }

  useEffect(() => {
    if(isSubmitSuccessful){
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset,isSubmitSuccessful])
  
  return (
    <>
    {
      loading ? (
        <div className="animate-slide-down-fade flex text-richblack-700 bg-richblack-100 gap-2 items-center rounded-md py-2 px-3 font-semibold w-fit mt-5">
            <div className="w-6 h-6 border-4 border-richblack-700 border-t-transparent rounded-full animate-spin"></div>
            <div>Loading...</div>
        </div>
      ) :(
        <form onSubmit={handleSubmit(submitContactForm)}>
          <div className='flex flex-col gap-6'>
            <div className='flex gap-x-4'>

              {/* firstName */}
              <label className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>First Name <sup className='text-pink-200'> *</sup></p>
                <input type="text" name='firstName' placeholder='Enter First Name' 
                {...register("firstName",{required:true})}
                className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                { errors.firstName && (<span>Please enter your First Name</span>)}
              </label>

              {/* lastName */}
              <label className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Last Name <sup className='text-pink-200'> *</sup></p>
                <input type="text" name='lastName' placeholder='Enter Last Name'
                {...register("lastName",{required:true})}             className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                { errors.lastName && (<span>Please enter your Last Name</span>)}
              </label>
            </div>

            {/* Email */}
            <label className='w-full'>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Email Address <sup className='text-pink-200'> *</sup></p>
              <input type="text" name='email' placeholder='Enter email address'  {...register("email",{required:true})}
              className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
              { errors.email && (<span>Please enter your Email</span>)}
            </label>

            {/* phoneNo */}
            <div>
              <label className='w-full'>
                <p className='mb-1 text-sm text-richblack-5 font-medium'>Phone Number<sup className='text-pink-200'> *</sup></p>
                <div className="flex gap-4">
                  <select type="text" name="countryCode" className='w-[70px] rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] '
                    {...register("countryCode",{required:true})}
                  >
                    {
                      countryCodes.map((item,index) => {
                        return(
                          <option value={item.code} key={index} >
                            {item.code} - {item.country}
                          </option>
                        )
                      })
                    }
                  </select>
                  <div className="w-full">
                    <input type="tel" required name='phoneNo' placeholder='12345 67890'  {...register("phoneNo",{required:{value:true,message:"Please enter phone Number *"}, maxLength:{value:10,message:"Enter a valid Phone Number *"},minLength:{value:8,message:"Enter a valid Phone Number *"}})}          className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
                    { errors.phoneNo && (<span>{errors.phoneNo.message}</span>)}
                  </div>
                </div>
              </label>
            </div>

            {/* Message */}
            <label>
              <p className='mb-1 text-sm text-richblack-5 font-medium'>Message<sup className='text-pink-200'> *</sup></p>
              <textarea name="message" cols="30" rows="7" placeholder='Enter your message here' {...register("message",{required:true})}
              className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)]'/>
              { errors.message && (<span>Please enter your Message</span>)}
            </label>

            {/* submit button */}
            <button className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px]">
              Send Message
            </button>
          </div>
        </form>
      )
    }
    </>

  )
}

export default ContactForm

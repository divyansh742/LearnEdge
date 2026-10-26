import React ,{useState} from 'react'
import { FaRegStar } from 'react-icons/fa'

const RatingReviewCard = ({courses}) => {
  const [allRatingReview,setRatingReview] = useState(courses?.flatMap((course) => course?.ratingAndReviews?.map(review => ({...review,courseName: course?.courseName})) || []));
  const [currOption,setCurrOption] = useState("ALL");

  const FilterReviews = (e) => {
    const id = e.target.value;
    setCurrOption(id);

    if(id === "ALL")
      setRatingReview(courses?.flatMap((course) => course?.ratingAndReviews?.map(review => ({...review,courseName: course?.courseName})) || []));
    else
      setRatingReview(courses?.flatMap((course) => course?._id === id ? course?.ratingAndReviews?.map(review => ({...review,courseName: course?.courseName})) || [] : []));

  }
  return (
    <div className='flex flex-col'>
      <div  className='flex justify-between mb-3 items-center'>
        <div className='flex gap-2 items-center'>
            <FaRegStar size={23} className='text-blue-300'/>
            <p className='text-richblack-100 font-semibold'>Recent Reviews</p>
        </div>
        <div>
          <select name="courses" className='w-full rounded-lg bg-richblack-700 p-2 text-richblack-5 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.40)] text-sm ' value={currOption} onChange={FilterReviews} >
            <option value="ALL">All Courses</option>
              {
                courses?.map((element,index) => {
                    return (<option key={index} className='max-w-fit' value={element?._id}>
                        {element.courseName}
                    </option>)
                })
              }
          </select>
        </div>
      </div>
      <div>
      {
        allRatingReview?.slice(0,11)?.map((element, index) => {
          const image = element?.user ? element?.user?.image : "https://api.dicebear.com/5.x/initials/svg?seed=Anonymous";
          const fullName = element?.user ? element?.user?.firstName + element?.user?.lastName : "Anonymous User";
          return (
          <div key={index} className={`flex items-center gap-3 ${index === allRatingReview?.length -1 ? "": "border-b"} py-3 border-richblack-600 w-full`}>
            <div className='min-w-max'>
              <img src={image} alt="img" className='w-10 rounded-full'/>
            </div>
            <div className='flex flex-col w-[20%]'>
              <p className='font-semibold text-sm'>{fullName}</p>
              <p className='text-sm text-richblack-300'>{element.courseName}</p>
            </div>
            <div className='text-richblack-300 w-[50%]'>
              {element?.review}
            </div>
            <div className='flex items-center gap-2 w-[20%] justify-end'>
              <div className='text-lg flex gap-1'>
                <span className={`${(element.rating > 0 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                <span className={`${(element.rating > 1 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                <span className={`${(element.rating > 2 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                <span className={`${(element.rating > 3 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
                <span className={`${(element.rating > 4 ) ?"text-yellow-100": "text-richblack-300"}`}>★</span>
              </div>
              <p className='text-semibold text-richblack-200'>{element.rating.toFixed(1)}</p>
            </div>
          </div>)
        })
      }
      {allRatingReview?.length === 0 && (<div className='text-center text-richblack-300 '>No Reviews Found</div>)}
      </div>  
      
      
    </div>
  )
}

export default RatingReviewCard

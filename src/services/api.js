const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:4000/api/v1" : process.env.REACT_APP_BASE_URL;

export const authEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
    SEND_OTP_API: BASE_URL + "/auth/sendOTP",
    RESET_PASSWORD_TOKEN_API : BASE_URL + "/auth/resetPasswordToken",
    RESET_PASSWORD_API : BASE_URL + "/auth/resetPassword",
    LOGOUT_API: BASE_URL + "/auth/logout",
}
export const courseEndpoints = {
    GET_COURSE_DETAILS : BASE_URL + "/course/getCourseDetails",
    GET_COURSE_CONTENT_API: BASE_URL + "/course/courseContent",
}
export const instructorEndpoints = {
    GET_INSTRUCTOR_COURSE_API : BASE_URL + "/course/getInstructorCourse",
    GET_INSTRUCTOR_PAGE_API: BASE_URL + "/profile/getInstructorPage",
    GET_INSTRUCTOR_DASHBOARD_API : BASE_URL + "/profile/instructorDashboard",
    DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    EDIT_COURSE_API: BASE_URL + "/course/editCourse",
    ADD_SECTION_API: BASE_URL + "/course/addSection",
    UPDATE_SECTION_API: BASE_URL +"/course/updateSection",
    DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
    ADD_SUBSECTION_API: BASE_URL + "/course/addSubSection",
    UPDATE_SUBSECTION_API: BASE_URL +"/course/updateSubSection",
    DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",

}
export const progressEndpoints = {
    GET_COURSE_PROGRESS_API : BASE_URL + "/course/getProgressPercentage",
    UPDATE_PROGRESS_API : BASE_URL + "/course/updateProgress",
}

export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    UPDATE_PASSWORD_API: BASE_URL + "/auth/changePassword",
    DELETE_ACCOUNT_API: BASE_URL + "/profile/deleteAccount",
}
export const profileEndpoints = {
    GET_ALL_ENROLLED_COURSES: BASE_URL + "/profile/getEnrolledCourses"
}

export const categoryEndpoints = {
    GET_ALL_CATEGORIES: BASE_URL + "/course/showAllCategories",
    GET_CATEGORY_PAGE_DETAILS: BASE_URL + "/course/getCategoryPageDetails",
}
export const reviewEndpoints = {
    GET_ALL_RATING_REVIEWS: BASE_URL + "/course/getAllRatingReviews",
    CREATE_REVIEW_API: BASE_URL + "/course/createRating",
}
export const contactEndpoints = {
    CONTACT_US_API: BASE_URL + "/contactPage/contact"
}
export const paymentEndpoints = {
    CREATE_ORDER_API : BASE_URL + "/payment/capturePayment",
    VERIFY_PAYMENT_API: BASE_URL + "/payment/verifyPayments",
    VERIFY_PURCHASE_API: BASE_URL + "/payment/verifyPurchase",
}
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const authEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
    SEND_OTP_API: BASE_URL + "/auth/sendOTP",
    RESET_PASSWORD_TOKEN_API : BASE_URL + "/auth/resetPasswordToken",
    RESET_PASSWORD_API : BASE_URL + "/auth/resetPassword",
}


export const categoryEndpoints = {
    GET_ALL_CATEGORIES: BASE_URL + "/course/showAllCategories",
}
export const reviewEndpoints = {
    GET_ALL_RATING_REVIEWS: BASE_URL + "/course/getAllRatingReviews"
}
export const contactEndpoints = {
    CONTACT_US_API: BASE_URL + "/contactPage/contact"
}
import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector";
import { paymentEndpoints } from "../api";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/profileSlice";
const {CREATE_ORDER_API,VERIFY_PURCHASE_API} = paymentEndpoints;
const smallLogo = "https://res.cloudinary.com/dqn90humt/image/upload/v1787414879/LearnEdge_Logo_02-1-300x108_dwsihl.jpg";

// loadRazorpayPage
function loadScript(rzrPayUrl){
    return new Promise((resolve) => {
        const scriptElement = document.createElement("script");
        scriptElement.src = rzrPayUrl;
        scriptElement.onload = () => {
            resolve(true);
        }
        scriptElement.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(scriptElement);
    })

}

export function buyCourse(courses,formData,navigate,fromCart){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const loadScriptResponse = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if(!loadScriptResponse){
                toast.error("Failed to load payment page");
                return;
            }
            const orderResponse = await apiConnector("POST",CREATE_ORDER_API,{
                allCourses : courses,
            })
            if(!orderResponse.data.success){
                throw new Error(orderResponse.data.message);
            }
            console.log("Order Response ->>",orderResponse);
            console.log("formData ->>",formData);
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY,
                image: smallLogo,
                name: "LearnEdge",
                description: "hello",
                order_id: orderResponse.data.orderId,
                
                prefill:{
                    name: `${formData?.name}`,
                    email: `${formData?.email}`,
                    contact: `${formData?.contact}`
                },
                handler: function (response) {
                    checkEnrollment(courses,navigate,dispatch,fromCart);
                },
                modal:{
                    ondismiss: function (){
                        toast.error("Payment Cancelled");
                    }
                }
            }
            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (response){
                toast.error("Payment Failed!");
            })
            paymentObject.open();
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);            
        }
        toast.dismiss(toastId);
    }
}
async function checkEnrollment(courses,navigate,dispatch,fromCart){
    dispatch(setPaymentLoading(true))
    const toastId = toast.loading("Waiting for Confirmation....")
    for(let i = 0; i< 10; i++){
        try {
            const response = await apiConnector("POST",VERIFY_PURCHASE_API,{
                purchasedCourses: courses,
            });
            if(response.data.success && response.data.verified){
                toast.dismiss(toastId);
                toast.success("Payment Sucessfull");
                navigate("/dashboard/enrolled-courses");
                if(fromCart) dispatch(resetCart());
                return true;
            }
            await new Promise((resolve) => setTimeout(resolve,1500));
        } catch (error) {
            toast.error("Error Checking Enrollment");
            await new Promise((resolve) => setTimeout(resolve,1500));
        }
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false))
    toast("Payment received. Enrollment is still being processed. Please check your Enrolled Courses shortly.");
    return false;
}
import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";

const initialState = {
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    totalAmount : localStorage.getItem("totalAmount") ? JSON.parse(localStorage.getItem("totalAmount")) : 0,

};
 
const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers:{
        //add to cart
        addToCart: (state,actions) => {
            const course = actions.payload
            //check if this course already in cart
            const index = state.cart.findIndex((item) => item._id === course._id);
            if(index >= 0){
                //course already in cart
                toast.error("Course already in cart");
                return;
            }
            state.cart.push(course);//add in cart
            state.totalItems++; //increate itemcount
            state.totalAmount += course.price //increse price
            //update in localStorage
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("totalAmount",JSON.stringify(state.totalAmount))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems));
            toast.success("Course Added to Cart")
        },

        //remove from cart
        removeFromCart: (state,actions) => {
            const courseId = actions.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);
            if(index >= 0){
                //course is in cart remove it
                state.totalItems--;
                state.totalAmount -= state.cart[index].price;
                state.cart.splice(index,1);
                //update in localStorage
                localStorage.setItem("cart",JSON.stringify(state.cart))
                localStorage.setItem("totalAmount",JSON.stringify(state.totalAmount))
                localStorage.setItem("totalItems",JSON.stringify(state.totalItems));
                toast.success("Course Removed from Cart")
            }

        },
        //reset cart    
        resetCart : (state) => {
            state.cart = []
            state.totalItems = 0;
            state.totalAmount = 0;
            //update localStorage
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("totalAmount",JSON.stringify(state.totalAmount))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems));
            toast.success("Cart Reset Succesfully")
        }
    },
})

export const {addToCart,removeFromCart,resetCart} = cartSlice.actions;
export default cartSlice.reducer;
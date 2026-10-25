import axios from "axios";

export const axiosInstance = axios.create({withCredentials: true,});

axiosInstance.interceptors.response.use((response) => response,
    (error) => {
        if(error.response?.status === 401 && (error.response?.data?.message === "Token Missing" || error.response?.data?.message === "Token is Invalid" )){
            localStorage.removeItem("user");
            localStorage.removeItem("cart");
            localStorage.removeItem("totalItems");
            localStorage.removeItem("totalAmount");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export const apiConnector = (method,url,bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params? params : null,
    })
}


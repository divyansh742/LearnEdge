import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../utils/constant"


const OpenRoute = ({children}) => {
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile);
    if(token === null)
        return children
    else{
        if(user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
            return <Navigate to="/dashboard/instructor"/>
        if(user?.accountType === ACCOUNT_TYPE.STUDENT)
            return <Navigate to="/dashboard/enrolled-courses"/>
    }
}

export default OpenRoute

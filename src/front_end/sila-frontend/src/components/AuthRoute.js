import { getToken } from "../utils"
import { Navigate } from "react-router-dom"

//for login page, {children} is a component
const AuthRouteForLoginPage = ({children})=>{
    const token = getToken() // get token from localstorage
    if(!token){
        return <>{children}</>
    }else{
        return <Navigate to="/" replace/>
    }
}

//{children} is like <Layout /> or <Login />
const AuthRoute = ({children})=>{
    const token = getToken()
    if(token){
        return <>{children}</>
    }else{
        return <Navigate to="/login" replace/>
    }
}

export {AuthRoute, AuthRouteForLoginPage}
import axios from "axios"
import { getToken } from "./token"

const http = axios.create({
    baseURL: "http://localhost:5266/",
    // baseURL: "http://localhost:3001/yz7yl",
    timeout: 5000
})

http.interceptors.request.use(
    (config)=>{
        const token = getToken()
        //token is null or string
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        return Promise.reject(error)
    }
)

export {http}

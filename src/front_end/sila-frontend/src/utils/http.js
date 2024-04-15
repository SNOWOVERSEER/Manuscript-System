import axios from "axios"

const http = axios.create({
    baseURL: "http://localhost:5266/",
    timeout: 5000
})

http.interceptors.request.use(
    (config)=>{
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

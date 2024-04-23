import { createSlice } from "@reduxjs/toolkit";
import {getToken, http} from '../../utils'
import { getID } from "../../utils";
import { login_API } from "../../apis/user";

const userStore = createSlice({
    name: "user",
    initialState: {
        id: getID() || "",
        token: getToken() || "",
        role: localStorage.getItem('role') || "",
        userInfo: {}
    },
    reducers: {
        set_id(state, action){
            state.id = action.payload
            //localStorage
            localStorage.setItem("id", action.payload)
        },
        set_token(state, action){
            state.token = action.payload
            //localStorage
            localStorage.setItem("token", action.payload)
        },
        set_role(state, action){
            state.role = action.payload
            //localStorage
            localStorage.setItem("role", action.payload)
        },
        set_userinfo(state, action){
            state.userInfo = action.payload
        },
        clear_user(state){
            state.id = ""
            state.token = ""
            state.role = ""
            state.userInfo = {}

            localStorage.removeItem("id")
            localStorage.removeItem("token")
            localStorage.removeItem('role')
        }
    }
})

const {set_token, set_id, set_role, set_userinfo, clear_user} = userStore.actions
//async method
const fetch_login = (data)=>{
    return async (dispatch)=>{
        try{
            const res = await login_API(data)
            dispatch(set_id(res.data.id))
            dispatch(set_token(res.data.token))
            dispatch(set_role(data.role))
            return res
        } catch (error) {
            throw error
        }
    }
}
const fetch_userinfo = ()=>{
    return async (dispatch)=>{
        const res = await http.get("/User/getuserinfo")
        console.log(res)
        dispatch(set_userinfo(res.data))
    }
}

export {set_token, fetch_login, fetch_userinfo, clear_user}  //set_id

const userReducer = userStore.reducer
export default userReducer

import { createSlice } from "@reduxjs/toolkit";
import {getToken, http, removeToken, setToken} from '../../utils'

const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() || "",
        userInfo: {}
    },
    reducers: {
        set_token(state, action){
            state.token = action.payload
            //localStorage
            setToken(action.payload)
        },
        set_userinfo(state, action){
            state.userInfo = action.payload
        },
        clearUserInfo (state) {
            state.token = ''
            state.userInfo = {}
            removeToken()
        }
    }
})

const {set_token, set_userinfo, clearUserInfo} = userStore.actions
//async method
const fetch_login = (data)=>{
    return async (dispatch)=>{
        try{
            const res = await http.post('/Auth/login', data)
            dispatch(set_token(res.data.token))
            return res
        } catch (error) {
            return {"state":"error" }
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

export {set_token, fetch_login, fetch_userinfo, clearUserInfo}

const userReducer = userStore.reducer
export default userReducer

import { createSlice } from "@reduxjs/toolkit";
import {getToken, http, removeID, removeToken, setToken} from '../../utils'
import { getID, setID } from "../../utils";

const userStore = createSlice({
    name: "user",
    initialState: {
        id: getID() || "",
        token: getToken() || "",
        userInfo: {}
    },
    reducers: {
        set_id(state, action){
            state.id = action.payload
            //localStorage
            setID(action.payload)
        },
        set_token(state, action){
            state.token = action.payload
            //localStorage
            setToken(action.payload)
        },
        set_userinfo(state, action){
            state.userInfo = action.payload
        },
        clear_user(state){
            state.id = ""
            state.token = ""
            state.userInfo = {}
            removeID()
            removeToken()
        }
    }
})

const {set_token, set_id, set_userinfo, clear_user} = userStore.actions
//async method
const fetch_login = (data)=>{
    return async (dispatch)=>{
        try{
            const res = await http.post('/Auth/login', data)
            dispatch(set_id(res.data.id))
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

export {set_token, fetch_login, fetch_userinfo, clear_user}  //set_id

const userReducer = userStore.reducer
export default userReducer

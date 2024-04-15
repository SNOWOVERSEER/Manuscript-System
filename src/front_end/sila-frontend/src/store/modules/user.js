import { createSlice } from "@reduxjs/toolkit";
import {getToken, http, setToken} from '../../utils'

const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() || ""
    },
    reducers: {
        set_token(state, action){
            state.token = action.payload
            //localStorage
            setToken(action.payload)
        }
    }
})

const {set_token} = userStore.actions
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
export {set_token, fetch_login}

const userReducer = userStore.reducer
export default userReducer

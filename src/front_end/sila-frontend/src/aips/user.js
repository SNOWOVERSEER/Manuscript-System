import { http } from "../utils";

export function login_API(data_){
    return http({
        url: '/Auth/login',
        method: 'POST',
        data: data_
    })
}

export function register_API(data_){
    return http({
        url: '/Auth/register',
        method: 'POST',
        data: data_
    })
}


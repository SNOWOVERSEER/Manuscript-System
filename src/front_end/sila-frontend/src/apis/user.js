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

export function get_articles_for_review_API(){
    return ({})
}

export function register_reviewer_API(data_){
    return http({
        url: '/Auth/register/reviewer',
        method: 'POST',
        data: data_
    })
}

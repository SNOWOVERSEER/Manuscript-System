import { http } from "../utils";

export function login_API(data_) {
  return http({
    url: "/Auth/login",
    method: "POST",
    data: data_,
  });
}

export function logout_API(data_) {
  return http({
    url: "/Auth/logout",
    method: "POST",
    params: data_,
  });
}

export function register_API(data_) {
  return http({
    url: "/Auth/register",
    method: "POST",
    data: data_,
  });
}

export function assign_reviewers(data_) {
  return http({
    url: "/Manuscripts/assignreviewers",
    method: "POST",
    data: data_,
  });
}

export function register_reviewer_API(data_){
    return http({
        url: '/Auth/register/reviewer',
        method: 'POST',
        data: data_
    })
}

export function get_articles_for_review_API() {
  return null
}

export function get_user_info_API(data_){
  return http({
      url: '/User/User',
      method: 'GET',
      data: data_
  })
}

export function reset_password(data_){
  return http({
      url: '/Auth/forgot-password',
      method: 'POST',
      data: data_
  })
}

export function reset_password_(data_){
  return http({
      url: '/Auth/reset-password',
      method: 'POST',
      data: data_
  })
}

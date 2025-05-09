import axios from "axios";
import { getToken, removeID, removeToken } from "./token";
import router from "../router";
export const URL = "http://ec2-3-106-139-56.ap-southeast-2.compute.amazonaws.com:5266/";
const http = axios.create({
  baseURL: "http://ec2-3-106-139-56.ap-southeast-2.compute.amazonaws.com:5266/",
  timeout: 5000,
});


http.interceptors.request.use(
  (config) => {
    const token = getToken();
    //token is null or string
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    // 2xx success
    return response.data;
  },
  (error) => {
    //greater than 2xx

    //catch 401 invalidate token
    if (error.response && error.response.status === 401) {
      removeToken();
      removeID();
      router.navigate("/login");
      window.location.reload();
    }

    // timeout
    if (
      error.code === "ECONNABORTED" ||
      (error.message && error.message.includes("timeout"))
    ) {
      return Promise.reject(new Error("timeout.."));
    }

    return Promise.reject(error);
  }
);

export { http };

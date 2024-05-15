import { refreshToken } from "@/utils/auth";
import { BaseConfig } from "@/utils/config";
import axios from "axios";
import Cookies from "js-cookie";
import AuthAPI from "./AuthAPI";
import Swal from "sweetalert2";
const api = axios.create({
  baseURL: `http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: any) => {
    const Url = response.config.url;
    if (Url.includes("api/comments/article")) {
      return response; // Return the response without any modification
    }
    if (response.status === 201) {
      Swal.fire({
        title: "Good job!",
        text: `Create Successfully`,
        icon: "success",
      });
    }
    return response;
  },
  async (error: any) => {
    if (error.config.url === "api/auth/refresh-token") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      location.href = "/";
      return axios(error.config);
    }
    if (error && error.response && error.response.status === 401) {
      const response = await AuthAPI.refreshToken({ refreshToken });
      if (response.status === 200) {
        const accessToken = response.data["accessToken"];
        Cookies.set("accessToken", accessToken);
        location.reload();
        return axios(error.config);
      }
      return axios(error.config);

      // You can also emit an event or dispatch an action to handle this in your application
    }
    if (error && error.response && error.response.status === 403) {
      location.href = "/unauthorized";
    }
    const originalRequestUrl = error.config.url;
    if (originalRequestUrl && originalRequestUrl.includes("api/auth")) {
      return Promise.reject(error);
    }
    Swal.fire({
      title: "Failed",
      text: `${error.response.data.message}`,
      icon: "error",
    });
    return Promise.reject(error);
  }
);

export const configAuth = (yourAuthToken: String) => ({
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${yourAuthToken ?? ""}`,
  },
});
export const configImage = (yourAuthToken: String) => ({
  headers: {
    "Content-type": "multipart/form-data",
    Authorization: `Bearer ${yourAuthToken}`,
  },
});

export default api;

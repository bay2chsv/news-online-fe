import Cookies from "js-cookie";
import { BaseConfig } from "./config";

export const refreshToken = Cookies.get("refreshToken");

export const baseUrl = `http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/api/v1`;

export const accessToken = Cookies.get("accessToken");
export const userName = Cookies.get("userName");
export const image = Cookies.get("image");
export const id = Cookies.get("id");
export const role = Cookies.get("role");

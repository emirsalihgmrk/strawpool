import axios from "axios";
import type { SignInRequest } from "~/dto/SignIn";

const BASE_URL = 'http://localhost:8080/api/auth';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const init = async () => {
    return axios.get(`${BASE_URL}/init`)
}

export const signin = async (data: SignInRequest) => {
    return axios.post(`${BASE_URL}/login`,data)
}

export const refreshToken = async () => {
    return axios.post(`${BASE_URL}/refreshToken`)
}

export const logout = async () => {
    return axios.post(`${BASE_URL}/logout`);
}
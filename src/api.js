import axios from "axios";
import {ACCESS_TOKEN} from "./constants";

export const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';


const publicApi = axios.create({
    baseURL: API_URL,
});

const api = axios.create({
    baseURL: API_URL,
    
});



api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

publicApi.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export {api, publicApi};
export default publicApi;
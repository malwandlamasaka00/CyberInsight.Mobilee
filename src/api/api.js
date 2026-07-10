import axios from "axios";
import { tokenStorage } from "../storage/tokenStorage";
const API_BASE_URL = "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const token = await tokenStorage.get();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
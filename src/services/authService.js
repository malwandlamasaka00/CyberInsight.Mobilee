import { api } from "../api/api";
import { tokenStorage } from "../storage/tokenStorage";

export const authService = {
    async register(first_name, last_name, email, password) {
        const data = {
    first_name,
    last_name,
    email,
    password,
};

console.log("Sending register data:", data);

const response = await api.post("/auth/register", data);
return response.data;
    },
   async login(email, password) {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    const token = response.data.access_token;
    await tokenStorage.save(token);
    return response.data;

    },
    async logout() {
        await tokenStorage.remove();
    },
    async getToken() {
        return await tokenStorage.get();
    },
};
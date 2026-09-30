import apiClient from "@/lib/apiClient"
import { LoginRequest, RegisterRequest } from "../types/auth.type"
import refreshClient from "@/lib/refreshClient"


export const authApi = {
    registerUser: async (data: RegisterRequest) => {
        const response = await apiClient.post("/auth/register", data)
        return response.data
    },
    
    loginUser: async (data: LoginRequest) => {
        const response = await apiClient.post("/auth/login", data)
        return response.data
    },

    refreshToken: async () => {
        const response = await refreshClient.post("/auth/refresh");
        return response.data;
    },

    logoutUser: async () => {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    },
}
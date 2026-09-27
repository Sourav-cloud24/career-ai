import apiClient from "../../../lib/apiClient.js"
import { LoginRequest, RegisterRequest } from "../types/auth.type.js"

export const authApi = {
    registerUser: async (data: RegisterRequest) => {
        const response = await apiClient.post("/auth/register", data)
        return response.data
    },
    
    loginUser: async (data: LoginRequest) => {
        const response = await apiClient.post("/auth/login", data)
        return response.data
    },
}
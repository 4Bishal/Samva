import { create } from "zustand"
import axios from "axios"



const baseUrl = "http://localhost:8000/api"
axios.defaults.withCredentials = true;


export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: false,
    isLoading: false,
    isCheckingAuth: true,
    message: null,


    register: async (email, password, name) => {
        set({ isLoading: true, error: null })

        try {
            const response = await axios.post(`${baseUrl}/register`, { email, password, name });
            set({ user: response.data.user, isAuthenticated: false, isLoading: false });
        } catch (err) {
            set({ error: err.response.data.message || "Error registering ", isLoading: false });
            throw err
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${baseUrl}/login`, { email, password });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || "Error while login", isLoading: false });
            throw err
        }
    },


    logout: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axios.post(`${baseUrl}/logout`);
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (err) {
            set({ error: err.response.data.message || "Error while logout ", isLoading: false });
            throw err
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.post(`${baseUrl}/check-auth`);
            if (res.data.success) {
                set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
            } else {
                set({ user: null, isAuthenticated: false, isCheckingAuth: false });
            }
        } catch {
            set({ user: null, isAuthenticated: false, isCheckingAuth: false });
        }
    }

}))
import { create } from "zustand";
import axios from "axios";
import { showCustomToast } from "../utils/customToast.js"; // Updated import
import { server } from "../utils/environment.js";

const baseUrl = `${server}/api`;
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: false,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${baseUrl}/register`, { email, password, name });
            set({
                user: response.data.user,
                isAuthenticated: false,
                isLoading: false,
            });

            // Show custom toast
            showCustomToast("Account created successfully! Please login.", "success");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error registering";
            set({ error: errorMessage, isLoading: false });

            showCustomToast(errorMessage, "error");
            throw err;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${baseUrl}/login`, { email, password });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });

            showCustomToast(`Welcome back, ${response.data.user.name}!`, "success");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error while login";
            set({ error: errorMessage, isLoading: false });

            showCustomToast(errorMessage, "error");
            throw err;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });

        try {
            await axios.post(`${baseUrl}/logout`);
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });

            showCustomToast("Logged out successfully!", "success");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error while logout";
            set({ error: errorMessage, isLoading: false });

            showCustomToast(errorMessage, "error");
            throw err;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.post(`${baseUrl}/check-auth`);
            if (res.data.success) {
                set({
                    user: res.data.user,
                    isAuthenticated: true,
                    isCheckingAuth: false,
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isCheckingAuth: false,
                });
            }
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false,
            });
        }
    },
}));

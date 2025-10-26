import { create } from "zustand";
import axios from "axios";
import { showCustomToast } from "../utils/customToast.js";
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

            // Store user data (profilePicture will be null for email/password registration)
            set({
                user: {
                    id: response.data.user._id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    profilePicture: null,
                    authProvider: 'local'
                },
                isAuthenticated: false,
                isLoading: false,
            });

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

            // Store complete user data including profilePicture
            set({
                user: {
                    id: response.data.user._id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    profilePicture: response.data.user.profilePicture || null,
                    authProvider: response.data.user.authProvider || 'local'
                },
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

    // NEW: Google Sign-In
    googleLogin: async (credential) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${baseUrl}/google`, { credential });

            // Store complete user data including profilePicture
            set({
                user: {
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    profilePicture: response.data.user.profilePicture || null,
                    authProvider: response.data.user.authProvider
                },
                isAuthenticated: true,
                isLoading: false,
            });

            showCustomToast(`Welcome, ${response.data.user.name}!`, "success");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Google sign-in failed";
            set({ error: errorMessage, isLoading: false });

            showCustomToast(errorMessage, "error");
            throw err;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });

        try {
            await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });

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
                    user: {
                        id: res.data.user._id,
                        name: res.data.user.name,
                        email: res.data.user.email,
                        profilePicture: res.data.user.profilePicture || null,
                        authProvider: res.data.user.authProvider || 'local'
                    },
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
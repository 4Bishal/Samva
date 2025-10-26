import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoadingSpinner } from "./LoadingSpinner";
import { showCustomToast } from "../utils/customToast.js";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
    const { user, isCheckingAuth } = useAuthStore();

    // Show toast once if user is not authenticated
    useEffect(() => {
        if (!isCheckingAuth && !user) {
            showCustomToast("Please login to access this page", "warning");
        }
    }, [isCheckingAuth, user]);

    // Show loading spinner while checking auth
    if (isCheckingAuth) {
        return <LoadingSpinner />;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user exists, render the protected content
    return children;
};

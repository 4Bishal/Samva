import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoadingSpinner } from "./LoadingSpinner";

// GuestRoute.jsx - REMOVE the checkAuth call
export const GuestRoute = ({ children }) => {
    const { user, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect logged-in users to main page
        if (user && !isCheckingAuth) {
            navigate("/", { replace: true });
        }
    }, [user, isCheckingAuth]);

    if (isCheckingAuth) {
        return <LoadingSpinner />
    }

    return !user ? children : null;
};
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoadingSpinner } from "./LoadingSpinner";
import { showCustomToast } from "../utils/customToast.js"; // use custom toast

export const GuestRoute = ({ children }) => {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const prevKey = useRef(location.key);
    const hasShownToast = useRef(false);

    useEffect(() => {
        if (isCheckingAuth) return;

        const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

        if (user && isAuthenticated && isAuthPage) {
            // Only show toast if navigation key changed (manual visit)
            if (location.key !== prevKey.current && !hasShownToast.current) {
                showCustomToast("You are already logged in!", "info"); // replaced
                hasShownToast.current = true;
            }

            navigate("/", { replace: true });
        }

        prevKey.current = location.key;
    }, [user, isAuthenticated, isCheckingAuth, location, navigate]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return !user ? children : null;
};

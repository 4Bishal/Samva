import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoadingSpinner } from "./LoadingSpinner";
import { showCustomToast } from "../utils/customToast.js"; // use custom toast

export const ProtectedRoute = ({ children }) => {
    const { user, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not logged in AND auth check is finished
        if (!user && !isCheckingAuth) {
            showCustomToast("Please login to access this page", "warning"); // replaced
            navigate("/login", { replace: true });
        }
    }, [user, isCheckingAuth, navigate]);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return <LoadingSpinner />;
    }

    // Only render children if user exists
    return user ? children : null;
};

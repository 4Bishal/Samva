import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { NavBar } from "../components/HomePage/Navbar";
import { Footer } from "../components/HomePage/Footer";
import { ThemeContext } from "../utils/ThemeProvider";
import { themeColors } from "../utils/themeColor";
import GoogleSignIn from "../components/GoogleSignIn ";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // Navigate after successful login
            navigate("/", { replace: true });
            setEmail("");
            setPassword("");
        } catch {
            // Error is already shown via custom toast in authStore
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <NavBar />

            {/* Main content */}
            <main
                className={`flex flex-1 items-center justify-center px-4 transition-colors duration-500 ${colors.bg}`}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`w-full max-w-md rounded-3xl shadow-2xl p-8 transition-colors duration-500 ${colors.sectionBg}`}
                >
                    <h2
                        className={`text-3xl font-bold text-center mb-6 transition-colors duration-500 ${colors.text}`}
                    >
                        Welcome Back to <span className={colors.primary}>Samva</span>
                    </h2>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <motion.div className="relative">
                            <Mail
                                className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500 ${theme === "dark"
                                    ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
                                    : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-blue-500"
                                    }`}
                            />
                        </motion.div>

                        {/* Password Input */}
                        <motion.div className="relative">
                            <Lock
                                className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500 ${theme === "dark"
                                    ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
                                    : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-blue-500"
                                    }`}
                            />
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-2 cursor-pointer ${theme === "dark"
                                ? "bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <Loader className="animate-spin mx-auto" size={24} />
                            ) : (
                                "Log In"
                            )}
                        </motion.button>
                    </form>

                    {/* Google Sign-In */}
                    <GoogleSignIn />

                    {/* Switch to Register */}
                    <p
                        className={`text-sm text-center mt-4 transition-colors duration-500 ${colors.subText}`}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className={`${colors.primary} hover:underline font-semibold`}
                        >
                            Register
                        </Link>
                    </p>
                </motion.div>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

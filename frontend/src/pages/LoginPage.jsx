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

            {/* Main content - FIXED: Better centering and spacing */}
            <main
                className={`flex flex-1 items-center justify-center px-4 py-12 sm:py-16 transition-colors duration-500 ${colors.bg}`}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 transition-colors duration-500 ${colors.sectionBg}`}
                >
                    {/* FIXED: Better title spacing and size */}
                    <h2
                        className={`text-2xl sm:text-3xl font-bold text-center mb-8 transition-colors duration-500 ${colors.text}`}
                    >
                        Welcome Back to <span className={colors.primary}>Samva</span>
                    </h2>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* Email Input - FIXED: Better padding and alignment */}
                        <motion.div className="relative">
                            <Mail
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`pl-12 pr-4 py-3.5 w-full rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${theme === "dark"
                                    ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-400"
                                    }`}
                            />
                        </motion.div>

                        {/* Password Input - FIXED: Better padding and alignment */}
                        <motion.div className="relative">
                            <Lock
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`pl-12 pr-4 py-3.5 w-full rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${theme === "dark"
                                    ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-400"
                                    }`}
                            />
                        </motion.div>

                        {/* Submit Button - FIXED: Better spacing and size */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl font-semibold shadow-lg cursor-pointer transition-all duration-300 mt-1 ${theme === "dark"
                                ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <Loader className="animate-spin mx-auto" size={22} />
                            ) : (
                                "Log In"
                            )}
                        </motion.button>
                    </form>

                    {/* Google Sign-In - FIXED: Better spacing */}
                    <div className="mt-6">
                        <GoogleSignIn />
                    </div>

                    {/* Switch to Register - FIXED: Better spacing */}
                    <p
                        className={`text-sm text-center mt-6 transition-colors duration-500 ${colors.subText}`}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className={`${colors.primary} hover:underline font-semibold transition-colors duration-300`}
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
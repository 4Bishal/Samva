import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { NavBar } from "../components/HomePage/Navbar";
import { Footer } from "../components/HomePage/Footer";
import { ThemeContext } from "../utils/ThemeProvider";
import { themeColors } from "../utils/themeColor";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shake, setShake] = useState(false);

    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    // Shake animation on error
    useEffect(() => {
        if (error) {
            setShake(true);
            const timeout = setTimeout(() => setShake(false), 400);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Navbar stays at top */}
                <NavBar />

                {/* Main content grows to fill remaining space */}
                <main
                    className={`flex flex-1 items-center justify-center px-4 transition-colors duration-500 ${colors.bg}`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`w-full max-w-md rounded-3xl shadow-2xl p-8 transition-colors duration-500 ${colors.sectionBg}`}
                    >
                        <h2 className={`text-3xl font-bold text-center mb-6 transition-colors duration-500 ${colors.text}`}>
                            Welcome Back to <span className={colors.primary}>Samva</span>
                        </h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <motion.div
                                animate={shake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                <Mail className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`} size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500
                                ${theme === "dark"
                                            ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
                                            : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-blue-500"}`}
                                />
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                animate={shake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                <Lock className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`} size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500
                                ${theme === "dark"
                                            ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
                                            : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-blue-500"}`}
                                />
                            </motion.div>

                            {/* Error Message */}
                            {error && <p className="text-red-500 font-semibold text-start">{error}</p>}

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-2 cursor-pointer
                            ${theme === "dark"
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                            >
                                {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Log In"}
                            </motion.button>
                        </form>

                        {/* Switch to Register */}
                        <p className={`text-sm text-center mt-4 transition-colors duration-500 ${colors.subText}`}>
                            Don’t have an account?{" "}
                            <Link to="/register" className={`${colors.primary} hover:underline font-semibold`}>
                                Register
                            </Link>
                        </p>
                    </motion.div>
                </main>

                {/* Footer always at bottom */}
                <Footer />
            </div>
        </>

    );
};

import React, { useState, useContext } from "react";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { NavBar } from "../components/HomePage/Navbar";
import { Footer } from "../components/HomePage/Footer";
import { ThemeContext } from "../utils/ThemeProvider";
import { themeColors } from "../utils/themeColor";

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.email, formData.password, formData.name);
            navigate("/login"); // success toast already handled in authStore
        } catch {
            // Error already displayed via custom toast in authStore
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
                <div
                    className={`w-full max-w-md rounded-3xl shadow-2xl p-8 transition-colors duration-500 ${colors.sectionBg}`}
                >
                    <h2
                        className={`text-3xl font-bold text-center mb-6 transition-colors duration-500 ${colors.text}`}
                    >
                        Create your <span className={colors.primary}>Samva</span> Account
                    </h2>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="relative">
                            <User
                                className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500 ${theme === "dark"
                                        ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-blue-400"
                                        : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-blue-500"
                                    }`}
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail
                                className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500 ${theme === "dark"
                                        ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-blue-400"
                                        : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-blue-500"
                                    }`}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock
                                className={`absolute left-3 top-3 transition-colors duration-500 ${colors.subText}`}
                                size={20}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-colors duration-500 ${theme === "dark"
                                        ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-blue-400"
                                        : "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-blue-500"
                                    }`}
                            />
                        </div>

                        {/* Submit */}
                        <button
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
                                "Register"
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <p
                        className={`text-sm text-center mt-4 transition-colors duration-500 ${colors.subText}`}
                    >
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className={`${colors.primary} hover:underline font-semibold`}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

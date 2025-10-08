import React, { useState } from "react";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register(formData.email, formData.password, formData.name);
            navigate("/login"); // redirect after successful registration
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Create your <span className="text-blue-600">Samva</span> Account
                </h2>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 font-semibold mt-2 text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 mt-2 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin mx-auto" size={24} />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                {/* Switch to Login */}
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

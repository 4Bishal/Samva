import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
    const [email, setEmail] = useState("");        // separate email state
    const [password, setPassword] = useState("");  // separate password state
    const [shake, setShake] = useState(false);     // for shake animation

    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    // Reset shake whenever error changes
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
            setPassword("")
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Welcome Back to <span className="text-blue-600">Samva</span>
                </h2>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <motion.div
                        animate={shake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                        animate={shake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </motion.div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 font-semibold  text-start">{error}</p>}

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 mt-2"
                    >
                        {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Log In"}
                    </motion.button>
                </form>

                {/* Switch to Register */}
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

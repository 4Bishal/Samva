import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const HeroSection = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate("/samvadPlace");
        } else {
            navigate("/login");
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <section
            id="home"
            className="flex flex-col justify-center items-center text-center py-24 px-6 min-h-[90vh]"
        >
            {/* Greeting (Above main tagline) */}
            {isAuthenticated && user?.name && (
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-10 md:mb-12 leading-snug drop-shadow-md"
                >
                    👋 {getGreeting()}, <span className="text-blue-600">{user.name}</span>!
                </motion.p>
            )}


            {/* Main Tagline */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                Converse Smarter with <span className="text-blue-600">Samva</span>
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-10"
            >
                Samva is your AI-powered conversational assistant built using MERN Stack
                and Generative AI. Chat naturally — text today, talk and share documents tomorrow.
            </motion.p>

            {/* Get Started Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <button
                    onClick={handleGetStarted}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full flex items-center gap-2 shadow-md transition-all"
                >
                    Get Started <ArrowRight size={18} />
                </button>
            </motion.div>
        </section>
    );
};

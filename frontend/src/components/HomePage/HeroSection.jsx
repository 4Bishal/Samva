import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ThemeContext } from "../../utils/ThemeProvider";
import { themeColors } from "../../utils/themeColor";

export const HeroSection = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    const handleGetStarted = () => {
        navigate(isAuthenticated ? "/samvadPlace" : "/login");
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
            className={`flex flex-col justify-center items-center text-center min-h-[90vh] py-20 sm:py-24 px-6 sm:px-10 
                        transition-colors duration-500 overflow-hidden ${colors.bg} ${colors.text}`}
        >
            {/* Greeting Section */}
            {isAuthenticated && user?.name && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-center mb-8 sm:mb-12"
                >
                    <motion.p
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text 
                                   ${colors.gradient} leading-snug drop-shadow-md`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        👋 {getGreeting()},
                    </motion.p>

                    <motion.p
                        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug drop-shadow-md ${colors.primary}`}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        {user.name}!
                    </motion.p>
                </motion.div>
            )}

            {/* Main Title */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent 
                            ${colors.gradient} drop-shadow-md leading-tight`}
            >
                Converse Smarter with{" "}
                <span className={colors.primary}>Samva</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className={`max-w-2xl text-base sm:text-lg md:text-xl mb-10 leading-relaxed transition-colors duration-500 ${colors.subText}`}
            >
                Samva is your AI-powered conversational assistant built using MERN Stack
                and Generative AI. Chat naturally — text today, talk and share documents tomorrow.
            </motion.p>

            {/* CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <button
                    onClick={handleGetStarted}
                    className={`px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-full flex items-center justify-center gap-2
                                shadow-md transition-all duration-300 cursor-pointer ${colors.primaryBg} ${colors.primaryHover} text-white`}
                >
                    Get Started
                    <ArrowRight size={18} />
                </button>
            </motion.div>
        </section>
    );
};

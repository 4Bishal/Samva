import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { NavBar } from "../components/HomePage/Navbar";
import { ThemeContext } from "../utils/ThemeProvider";
import { Footer } from "../components/HomePage/Footer";
import { themeColors } from "../utils/themeColor";

export const NotFound = () => {
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar at top */}
            <NavBar />

            {/* Main content centered */}
            <main className={`flex flex-1 items-center justify-center p-6 transition-colors duration-500 ${colors.bg}`}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl shadow-xl p-10 w-full max-w-md text-center transition-colors duration-500 ${colors.sectionBg}`}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-500 ${theme === "dark" ? "bg-gray-700" : "bg-purple-100"}`}
                    >
                        <AlertTriangle className={`h-10 w-10 transition-colors duration-500 ${theme === "dark" ? "text-yellow-400" : "text-purple-600"}`} />
                    </motion.div>

                    <h1 className={`text-3xl font-bold mb-2 transition-colors duration-500 ${theme === "dark" ? "text-yellow-400" : "text-purple-700"}`}>404</h1>
                    <h2 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${colors.text}`}>Page Not Found</h2>
                    <p className={`mb-6 transition-colors duration-500 ${colors.subText}`}>
                        The page you’re looking for doesn’t exist or has been moved. Please check the URL or go back to the home page.
                    </p>

                    <Link
                        to="/"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors duration-300
                            ${theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                    >
                        <ArrowLeft size={18} /> Go Home
                    </Link>
                </motion.div>
            </main>

            {/* Footer at bottom */}
            <Footer />
        </div>
    );
};

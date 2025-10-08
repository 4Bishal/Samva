import React from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // <-- import Link
import DarkThemeLogo from "/src/assets/DarkThemeLogo.png";
import { useAuthStore } from "../../store/authStore";

export const Navbar = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center px-6 py-4 shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-md sticky top-0 z-50"
        >
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <motion.img
                    src={DarkThemeLogo}
                    alt="Samva Logo"
                    className="h-10 md:h-12 lg:h-14 object-contain"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8 text-sm font-medium">
                <a href="#home" className="hover:text-blue-600 transition-colors duration-300">
                    Home
                </a>
                <a href="#about" className="hover:text-blue-600 transition-colors duration-300">
                    About
                </a>
                <a href="#contact" className="hover:text-blue-600 transition-colors duration-300">
                    Contact
                </a>
            </div>
            {
                !isAuthenticated ?
                    <div className="flex items-center space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm"
                            >
                                <LogIn size={18} /> Login
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/register"
                                className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
                            >
                                <UserPlus size={18} /> Register
                            </Link>
                        </motion.div>
                    </div>
                    : <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                                try {
                                    await logout(); // call the logout function from your auth store
                                    navigate("/login"); // redirect to login page after logout
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                            className="flex items-center gap-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm"
                        >
                            <LogOut size={18} /> Logout
                        </motion.button>
                    </div>

            }

            {/* Action Buttons */}

        </motion.nav>
    );
};

import { useState, useContext, useRef, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const isDark = theme === "dark";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (mode) => {
        setTheme(mode);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 
                    ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}
                    hover:opacity-90`}
            >
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Animated Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-11 right-0 w-32 rounded-xl shadow-md p-2 border text-sm z-50
                            ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"}`}
                    >
                        {/* Light Mode */}
                        <button
                            onClick={() => handleSelect("light")}
                            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors
                                ${theme === "light"
                                    ? isDark
                                        ? "bg-gray-700 text-yellow-300"
                                        : "bg-gray-100 text-yellow-600"
                                    : isDark
                                        ? "hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                }`}
                        >
                            <Sun size={16} /> Light
                        </button>

                        {/* Dark Mode */}
                        <button
                            onClick={() => handleSelect("dark")}
                            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors
                                ${theme === "dark"
                                    ? isDark
                                        ? "bg-gray-700 text-blue-300"
                                        : "bg-gray-100 text-blue-600"
                                    : isDark
                                        ? "hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                }`}
                        >
                            <Moon size={16} /> Dark
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

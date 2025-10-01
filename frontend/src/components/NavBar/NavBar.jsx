import { ChevronDown, CircleUserRound } from "lucide-react";
import { ThemeToggle } from "../../utils/ThemeToggle.jsx";
import { ThemeContext } from "../../utils/ThemeProvider";
import { useContext } from "react";

export const NavBar = () => {
    const { theme } = useContext(ThemeContext); // 'light' or 'dark'
    const isDark = theme === "dark";

    return (
        <div
            className={`flex items-center justify-between p-4 shadow-sm transition-colors duration-300
        ${isDark
                    ? "bg-gray-900 text-gray-100"
                    : "bg-white text-gray-800 border-b border-gray-200"
                }`}
        >
            {/* Left - Logo/Title */}
            <div className="flex items-center gap-2 font-semibold">
                Samva <ChevronDown size={18} className={`${isDark ? "text-gray-400" : "text-gray-500"}`} />
            </div>

            {/* Right - Theme Toggle + User */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                <div
                    className={`p-2 rounded-full transition-colors duration-300 ${isDark ? "bg-gray-700" : "bg-gray-100"
                        }`}
                >
                    <CircleUserRound className={`${isDark ? "text-gray-200" : "text-gray-600"}`} size={24} />
                </div>
            </div>
        </div>
    );
};

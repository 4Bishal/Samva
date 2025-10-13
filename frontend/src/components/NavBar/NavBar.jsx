import { ChevronDown, Home, LogOut } from "lucide-react";
import { ThemeToggle } from "../../utils/ThemeToggle.jsx"; // Your existing thin toggle
import { ThemeContext } from "../../utils/ThemeProvider";
import { useAuthStore } from "../../store/authStore.jsx";
import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
    const { theme } = useContext(ThemeContext);
    const { user, logout } = useAuthStore();
    const isDark = theme === "dark";

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div
            className={`relative flex items-center justify-between p-3 sm:p-4 shadow-sm transition-colors duration-300
            ${isDark
                    ? "bg-gray-900 text-gray-100"
                    : "bg-white text-gray-800 border-b border-gray-200"
                }`}
        >
            {/* Left - Home Icon */}
            <div className="flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base ml-12 md:ml-0">
                <Link
                    to="/"
                    className="flex items-center gap-1 transition-opacity duration-200 hover:opacity-80"
                >
                    <Home
                        size={20}
                        className={`sm:w-[22px] sm:h-[22px] ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    />
                    <span className="hidden xs:inline">Home</span>
                </Link>
            </div>

            {/* Right - Theme Toggle + User Avatar / Dropdown */}
            <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>

                {/* Thin Theme Toggle (Sun/Moon) */}
                <ThemeToggle />

                {/* User Avatar / Initial */}
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold uppercase transition-colors duration-300 text-sm
                        ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}
                        hover:opacity-90`}
                >
                    {user?.name ? user.name.charAt(0) : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div
                        className={`absolute top-10 sm:top-12 right-0 w-36 sm:w-40 rounded-xl shadow-md p-2 border text-xs sm:text-sm z-50 transition-all duration-200
                        ${isDark
                                ? "bg-gray-800 border-gray-700 text-gray-100"
                                : "bg-white border-gray-200 text-gray-800"
                            }`}
                    >
                        <div className={`px-2 sm:px-3 py-1.5 sm:py-2 border-b text-[10px] sm:text-xs ${isDark ? "text-gray-400 border-gray-700" : "text-gray-500 border-gray-200"} truncate`}>
                            {user?.name || "Guest"}
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors
                            ${isDark
                                    ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
                                    : "hover:bg-gray-100 text-red-600 hover:text-red-700"
                                }`}
                        >
                            <LogOut size={14} className="sm:w-4 sm:h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

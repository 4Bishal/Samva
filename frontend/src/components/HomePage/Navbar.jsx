import React, { useState, useContext, useEffect } from "react";
import { LogIn, LogOut, UserPlus, Menu, X, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkThemeLogo from "/src/assets/DarkThemeLogo.png";
import LightThemeLogo from "/src/assets/LightThemeLogo.png";
import { useAuthStore } from "../../store/authStore";
import { ThemeContext } from "../../utils/ThemeProvider";

export const NavBar = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    // ✅ Smooth scroll when navigating with hash (/#home, /#about, etc.)
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace("#", "");
            const target = document.getElementById(sectionId);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    // Theme-based styling
    const navBg = isDark
        ? "bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800"
        : "bg-gradient-to-r from-white via-gray-50 to-gray-100";
    const textColor = isDark ? "text-gray-100" : "text-gray-800";
    const linkHover = isDark ? "hover:text-blue-400" : "hover:text-blue-600";
    const borderColor = isDark ? "border-gray-700" : "border-gray-200";
    const btnText = isDark ? "text-blue-400" : "text-blue-600";
    const btnBorder = isDark
        ? "border border-blue-500/70"
        : "border border-blue-600";
    const hoverBg = isDark ? "hover:bg-gray-800/70" : "hover:bg-blue-50";
    const dropdownBg = isDark ? "bg-gray-900" : "bg-white";

    // Reusable section links (Home, About, Contact)
    const sectionLinks = ["home", "about", "contact"].map((section) => (
        <Link
            key={section}
            to={`/#${section}`}
            onClick={() => {
                if (window.location.pathname === "/") {
                    document
                        .getElementById(section)
                        ?.scrollIntoView({ behavior: "smooth" });
                }
                setMenuOpen(false);
            }}
            className={`${linkHover}`}
        >
            {section.charAt(0).toUpperCase() + section.slice(1)}
        </Link>
    ));

    return (
        <nav
            className={`flex justify-between items-center px-6 py-4 sticky top-0 z-50 shadow-md transition-colors duration-500 ${navBg}`}
        >
            {/* Logo */}
            <img
                src={isDark ? DarkThemeLogo : LightThemeLogo}
                alt="Logo"
                className="h-10 md:h-12 lg:h-14 object-contain cursor-pointer"
                onClick={() => {
                    setMenuOpen(false); // ✅ closes mobile dropdown if open
                    if (window.location.pathname === "/") {
                        // ✅ already on home page → smooth scroll
                        document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                        // ✅ navigate to home section (/#home)
                        navigate("/#home");
                    }
                }}
            />



            {/* Desktop Links */}
            <div className={`hidden md:flex space-x-8 font-medium ${textColor}`}>
                {sectionLinks}
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    className="p-2 rounded-full transition-all duration-300 hover:bg-gray-700/20"
                >
                    {isDark ? (
                        <Sun size={18} className="text-yellow-400" />
                    ) : (
                        <Moon size={18} className="text-blue-500" />
                    )}
                </button>

                {/* Auth buttons */}
                {!isAuthenticated ? (
                    <>
                        <Link
                            to="/login"
                            className={`flex items-center gap-2 ${btnText} ${btnBorder} px-4 py-2 rounded-full font-semibold ${hoverBg}`}
                        >
                            <LogIn size={18} /> Login
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-blue-700"
                        >
                            <UserPlus size={18} /> Register
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 ${btnText} ${btnBorder} px-4 py-2 rounded-full font-semibold ${hoverBg}`}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
                <button
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    className="p-2 rounded-full transition-colors duration-300"
                >
                    {isDark ? (
                        <Sun size={20} className="text-yellow-400" />
                    ) : (
                        <Moon size={20} className="text-blue-500" />
                    )}
                </button>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`${isDark ? "text-gray-100" : "text-gray-800"}`}
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div
                    className={`absolute top-16 left-0 w-full flex flex-col items-center space-y-5 py-6 border-t md:hidden z-40 ${dropdownBg} ${borderColor} ${textColor}`}
                >
                    {sectionLinks}

                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-2 ${btnText} ${btnBorder} px-4 py-2 rounded-full font-semibold ${hoverBg}`}
                            >
                                <LogIn size={18} /> Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-blue-700"
                            >
                                <UserPlus size={18} /> Register
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            className={`flex items-center gap-2 ${btnText} ${btnBorder} px-4 py-2 rounded-full font-semibold ${hoverBg}`}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

// NavBar.jsx
import { ChevronDown, Home, LogOut, Languages, Radio, User } from "lucide-react";
import { ThemeToggle } from "../../utils/ThemeToggle.jsx";
import { ThemeContext } from "../../utils/ThemeProvider";
import { useAuthStore } from "../../store/authStore.jsx";
import { useContext, useState, useRef, useEffect, memo, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Supported languages
export const SUPPORTED_LANGUAGES = [
    { code: 'ne-NP', name: 'Nepali', flag: '🇳🇵' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },

];

// Professional visualizer icons using SVG paths
const VisualizerIcons = {
    bars: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h4v9H3z" />
            <path d="M10 7h4v14h-4z" />
            <path d="M17 3h4v18h-4z" />
        </svg>
    ),
    circular: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    ),
    dnaHelix: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3v3M17 3v3M7 18v3M17 18v3" />
            <ellipse cx="12" cy="6" rx="8" ry="2" />
            <ellipse cx="12" cy="12" rx="8" ry="2" />
            <ellipse cx="12" cy="18" rx="8" ry="2" />
            <path d="M7 6c0 3 2.5 6 5 6s5-3 5-6M7 12c0 3 2.5 6 5 6s5-3 5-6" />
        </svg>
    ),
};

// Visualizer types with professional icons
export const VISUALIZER_TYPES = [
    {
        id: 'bars',
        name: 'Bar Waves',
        icon: VisualizerIcons.bars,
        description: 'Vertical bar animation'
    },
    {
        id: 'circular',
        name: 'Pulse Rings',
        icon: VisualizerIcons.circular,
        description: 'Circular wave pulses'
    },
    {
        id: 'dnaHelix',
        name: 'DNA Helix',
        icon: VisualizerIcons.dnaHelix,
        description: 'Double helix animation'
    },
];

export const NavBar = ({ selectedLanguage, onLanguageChange, selectedVisualizer, onVisualizerChange, isListening }) => {
    const { theme } = useContext(ThemeContext);
    const { user, logout } = useAuthStore();
    const isDark = theme === "dark";

    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [vizDropdownOpen, setVizDropdownOpen] = useState(false);

    const userDropdownRef = useRef(null);
    const langDropdownRef = useRef(null);
    const vizDropdownRef = useRef(null);

    const navigate = useNavigate();

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
                setLangDropdownOpen(false);
            }
            if (vizDropdownRef.current && !vizDropdownRef.current.contains(event.target)) {
                setVizDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[2];
    const selectedViz = VISUALIZER_TYPES.find(viz => viz.id === selectedVisualizer) || VISUALIZER_TYPES[2];

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

            {/* Right - Language + Visualizer + Theme + User */}
            <div className="flex items-center gap-2 sm:gap-3">

                {/* Language Selector - Speech Recognition Language */}
                <div className="relative" ref={langDropdownRef}>
                    <motion.button
                        onClick={() => !isListening && setLangDropdownOpen(!langDropdownOpen)}
                        disabled={isListening}
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${isListening
                            ? isDark
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDark
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                            }`}
                        whileHover={!isListening ? { scale: 1.02 } : {}}
                        whileTap={!isListening ? { scale: 0.98 } : {}}
                        title={`Voice Language: ${selectedLang.name}`}
                    >
                        <Languages size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden md:inline text-xs">{selectedLang.name.split(' ')[0]}</span>
                        <span className="md:hidden text-base">{selectedLang.flag}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                        {langDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full mt-2 right-0 w-64 max-h-80 overflow-y-auto rounded-xl shadow-2xl border ${isDark
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-200'
                                    } z-50`}
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: isDark ? '#4b5563 #1f2937' : '#d1d5db #f3f4f6',
                                }}
                            >
                                <div className={`sticky top-0 px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                    }`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Voice Recognition Language
                                    </p>
                                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                        Select language for speech input
                                    </p>
                                </div>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            onLanguageChange(lang.code);
                                            setLangDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${selectedLanguage === lang.code
                                            ? isDark
                                                ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-500'
                                                : 'bg-purple-50 text-purple-700 border-l-2 border-purple-500'
                                            : isDark
                                                ? 'hover:bg-gray-700 text-gray-300 border-l-2 border-transparent'
                                                : 'hover:bg-gray-50 text-gray-700 border-l-2 border-transparent'
                                            }`}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="flex-1 font-medium">{lang.name}</span>
                                        {selectedLanguage === lang.code && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={`w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500' : 'bg-purple-600'
                                                    }`}
                                            >
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Visualizer Selector - Animation Style */}
                <div className="relative" ref={vizDropdownRef}>
                    <motion.button
                        onClick={() => !isListening && setVizDropdownOpen(!vizDropdownOpen)}
                        disabled={isListening}
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${isListening
                            ? isDark
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDark
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                            }`}
                        whileHover={!isListening ? { scale: 1.02 } : {}}
                        whileTap={!isListening ? { scale: 0.98 } : {}}
                        title={`Animation: ${selectedViz.name}`}
                    >
                        <Radio size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden md:inline text-xs">Animation</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${vizDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                        {vizDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full mt-2 right-0 w-56 rounded-xl shadow-2xl border ${isDark
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-200'
                                    } z-50`}
                            >
                                <div className={`sticky top-0 px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                    }`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Voice Animation Style
                                    </p>
                                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                        Choose visual feedback during recording
                                    </p>
                                </div>
                                {VISUALIZER_TYPES.map((viz) => {
                                    const IconComponent = viz.icon;
                                    return (
                                        <button
                                            key={viz.id}
                                            onClick={() => {
                                                onVisualizerChange(viz.id);
                                                setVizDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left flex items-start gap-3 transition-colors ${selectedVisualizer === viz.id
                                                ? isDark
                                                    ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-500'
                                                    : 'bg-purple-50 text-purple-700 border-l-2 border-purple-500'
                                                : isDark
                                                    ? 'hover:bg-gray-700 text-gray-300 border-l-2 border-transparent'
                                                    : 'hover:bg-gray-50 text-gray-700 border-l-2 border-transparent'
                                                }`}
                                        >
                                            <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{viz.name}</p>
                                                <p className={`text-xs mt-0.5 ${selectedVisualizer === viz.id
                                                    ? isDark ? 'text-purple-300' : 'text-purple-600'
                                                    : isDark ? 'text-gray-500' : 'text-gray-500'
                                                    }`}>
                                                    {viz.description}
                                                </p>
                                            </div>
                                            {selectedVisualizer === viz.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-purple-500' : 'bg-purple-600'
                                                        }`}
                                                >
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Avatar / Initial */}
                <div className="relative" ref={userDropdownRef}>
                    <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold uppercase transition-all duration-300 text-sm border-2 ${isDark
                            ? "bg-gray-800 border-gray-700 text-gray-200 hover:border-purple-500"
                            : "bg-white border-gray-200 text-gray-700 hover:border-purple-400 shadow-sm"
                            }`}
                        title={user?.name || "User menu"}
                    >
                        {user?.name ? (
                            user.name.charAt(0)
                        ) : (
                            <User size={18} />
                        )}
                    </button>

                    {/* User Dropdown Menu */}
                    <AnimatePresence>
                        {userDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-12 sm:top-14 right-0 w-48 rounded-xl shadow-2xl p-2 border text-sm z-50 ${isDark
                                    ? "bg-gray-800 border-gray-700 text-gray-100"
                                    : "bg-white border-gray-200 text-gray-800"
                                    }`}
                            >
                                <div className={`px-3 py-2.5 border-b ${isDark ? "border-gray-700" : "border-gray-200"
                                    }`}>
                                    <p className={`text-xs font-medium truncate ${isDark ? "text-gray-300" : "text-gray-700"
                                        }`}>
                                        {user?.name || "Guest"}
                                    </p>
                                    <p className={`text-[10px] mt-0.5 truncate ${isDark ? "text-gray-500" : "text-gray-500"
                                        }`}>
                                        {user?.email || "guest@example.com"}
                                    </p>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center w-full gap-2.5 px-3 py-2.5 mt-1 rounded-lg transition-colors font-medium ${isDark
                                        ? "hover:bg-red-500/10 text-red-400 hover:text-red-300"
                                        : "hover:bg-red-50 text-red-600 hover:text-red-700"
                                        }`}
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};


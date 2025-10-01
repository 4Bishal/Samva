import { useContext } from "react";
import { ThemeContext } from "../utils/ThemeProvider.jsx";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const renderIcon = () => {
        return theme === "light" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
            <Moon className="w-5 h-5 text-gray-200" />
        );
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title={`Current: ${theme}`}
        >
            {renderIcon()}
        </button>
    );
};

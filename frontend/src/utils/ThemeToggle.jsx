import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "./ThemeProvider";

export const ThemeToggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const handleToggle = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 border
                ${isDark ? "bg-gray-700" : "bg-white-200 "}
                hover:opacity-90`}
        >
            {isDark ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-yellow-400" />}
        </button>
    );
};

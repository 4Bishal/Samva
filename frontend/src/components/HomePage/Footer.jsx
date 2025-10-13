import React, { useContext } from "react";
import { Github, Mail, Twitter } from "lucide-react";
import { ThemeContext } from "../../utils/ThemeProvider";
import { themeColors } from "../../utils/themeColor";

export const Footer = () => {
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    const socialLinks = [
        { icon: Github, link: "https://github.com", label: "GitHub" },
        { icon: Twitter, link: "https://twitter.com", label: "Twitter" },
        { icon: Mail, link: "mailto:support@samva.ai", label: "Email" },
    ];

    return (
        <footer
            className={`py-10 px-6 text-center border-t transition-colors duration-500 ${colors.sectionBg} ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
        >
            {/* Social Icons */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
                {socialLinks.map(({ icon: Icon, link, label }, i) => (
                    <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`p-3 rounded-full shadow-sm transition-all duration-300 ${colors.bg} ${colors.text} hover:shadow-md hover:-translate-y-1 ${colors.primaryHover}`}
                    >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${colors.gradient} text-white`}>
                            <Icon size={20} />
                        </div>
                    </a>
                ))}
            </div>

            {/* Footer Text */}
            <p className={`text-sm md:text-base font-medium tracking-wide ${colors.subText}`}>
                © {new Date().getFullYear()} <span className={`${colors.primary} font-semibold`}>Samva</span>. All rights reserved.
            </p>

            <p className={`mt-2 text-xs md:text-sm ${colors.subText}`}>
                Built with ❤️ using MERN + Generative AI
            </p>
        </footer>
    );
};

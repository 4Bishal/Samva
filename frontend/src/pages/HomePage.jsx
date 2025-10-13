import React, { useContext } from "react";
import { NavBar } from "../components/HomePage/Navbar";
import { HeroSection } from "../components/HomePage/HeroSection";
import { AboutSection } from "../components/HomePage/AboutSection";
import { ContactSection } from "../components/HomePage/ContactSection";
import { Footer } from "../components/HomePage/Footer";
import { ThemeContext } from "../utils/ThemeProvider";
import { themeColors } from "../utils/themeColor";

export const HomePage = () => {
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-500 ${colors.bg}`}
        >
            <NavBar />
            <main className="flex-1">
                <HeroSection />
                <AboutSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

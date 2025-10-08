import React from "react";
import { Navbar } from "../components/HomePage/NavBar";
import { HeroSection } from "../components/HomePage/HeroSection";
import { AboutSection } from "../components/HomePage/AboutSection";
import { Footer } from "../components/HomePage/Footer";
import { ContactSection } from "../components/HomePage/ContactSection";


export const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-white">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <AboutSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

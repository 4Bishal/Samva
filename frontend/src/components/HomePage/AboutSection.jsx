import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Brain, Mic, FileText, MessageCircle } from "lucide-react";
import { ThemeContext } from "../../utils/ThemeProvider";
import { themeColors } from "../../utils/themeColor";

export const AboutSection = () => {
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    const features = [
        { icon: MessageCircle, title: "Smart Conversations", desc: "Talk with AI that understands your intent and context." },
        { icon: Mic, title: "Voice Support (Upcoming)", desc: "Soon you'll be able to speak with Samva using natural voice." },
        { icon: FileText, title: "Document Understanding", desc: "Upload files and get intelligent summaries and responses." },
        { icon: Brain, title: "Powered by Generative AI", desc: "Built on advanced AI APIs integrated with MERN Stack." },
    ];

    return (
        <section
            id="about"
            className={`py-20 transition-colors duration-500 ${colors.sectionBg}`}
        >
            <div className="max-w-6xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`text-3xl md:text-4xl font-bold mb-12 transition-colors duration-500 ${colors.text}`}
                >
                    Why Choose{" "}
                    <span className={`${colors.primary}`}>
                        Samva?
                    </span>
                </motion.h2>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            className={`
                                group p-8 rounded-2xl shadow-md border 
                                hover:shadow-xl hover:-translate-y-2 
                                transition-all duration-300 
                                ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
                            `}
                        >
                            <div
                                className={`w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full 
                                    ${colors.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                            >
                                <feature.icon className="w-7 h-7" />
                            </div>

                            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${colors.text}`}>
                                {feature.title}
                            </h3>
                            <p className={`text-sm md:text-base leading-relaxed ${colors.subText}`}>
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

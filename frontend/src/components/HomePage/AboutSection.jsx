import React from "react";
import { motion } from "framer-motion";
import { Brain, Mic, FileText, MessageCircle } from "lucide-react";

export const AboutSection = () => {
    const features = [
        { icon: MessageCircle, title: "Smart Conversations", desc: "Talk with AI that understands your intent and context." },
        { icon: Mic, title: "Voice Support (Upcoming)", desc: "Soon you'll be able to speak with Samva using natural voice." },
        { icon: FileText, title: "Document Understanding", desc: "Upload files and get intelligent summaries and responses." },
        { icon: Brain, title: "Powered by Generative AI", desc: "Built on advanced AI APIs integrated with MERN Stack." },
    ];

    return (
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold mb-10"
                >
                    Why Choose <span className="text-blue-600">Samva?</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all"
                        >
                            <feature.icon className="w-10 h-10 mx-auto text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

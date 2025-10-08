import React, { useState } from "react";
import { motion } from "framer-motion";

export const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can integrate API/email here
        alert(`Thank you ${formData.name}, your message is sent!`);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section
            id="contact"
            className="py-20 bg-gray-100 dark:bg-gray-900 flex justify-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Contact <span className="text-blue-600">Us</span>
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300"
                    >
                        Send Message
                    </motion.button>
                </form>
            </motion.div>
        </section>
    );
};

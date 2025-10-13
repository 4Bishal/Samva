import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../utils/ThemeProvider";
import { themeColors } from "../../utils/themeColor";

export const ContactSection = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you ${formData.name}, your message is sent!`);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section
            id="contact"
            className={`py-20 px-6 sm:px-10 flex justify-center items-center transition-colors duration-500 ${colors.sectionBg}`}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`w-full max-w-2xl rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-500 ${colors.bg} shadow-md`}
            >
                <h2
                    className={`text-3xl sm:text-4xl font-bold mb-8 text-center transition-colors duration-500 ${colors.text}`}
                >
                    Contact <span className={colors.primary}>Us</span>
                </h2>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {["name", "email"].map((field) => (
                        <input
                            key={field}
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
                                        transition duration-300 text-base sm:text-lg
                                        ${theme === "dark"
                                    ? `bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-400`
                                    : `bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-600`}`}
                        />
                    ))}

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none text-base sm:text-lg
                                    ${theme === "dark"
                                ? `bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-400`
                                : `bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-600`}`}
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`py-3 sm:py-4 rounded-full font-semibold shadow-md transition-all duration-300 flex justify-center items-center text-base sm:text-lg cursor-pointer ${colors.primaryBg} ${colors.primaryHover} text-white`}
                    >
                        Send Message
                    </motion.button>
                </form>
            </motion.div>
        </section>
    );
};

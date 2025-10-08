import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, Twitter } from "lucide-react";

export const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-100 dark:bg-gray-950 py-8 mt-12 text-center"
        >
            <div className="flex justify-center gap-6 mb-4">
                <a href="#" className="hover:text-blue-600"><Github /></a>
                <a href="#" className="hover:text-blue-600"><Twitter /></a>
                <a href="#" className="hover:text-blue-600"><Mail /></a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Samva. All rights reserved.
            </p>
        </motion.footer>
    );
};

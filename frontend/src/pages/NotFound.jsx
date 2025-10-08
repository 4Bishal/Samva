import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import React from "react";

export const NotFound = () => {


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center"
            >
                {/* Animated icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <AlertTriangle className="h-10 w-10 text-purple-600" />
                </motion.div>

                <h1 className="text-3xl font-bold text-purple-700 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 mb-6">
                    The page you’re looking for doesn’t exist or has been moved.
                    Please check the URL or go back to the home page.
                </p>

                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                    <ArrowLeft size={18} /> Go Home
                </Link>
            </motion.div>
        </div>
    );
};
import { toast } from "react-hot-toast";
import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export const showCustomToast = (message, type = "info") => {
    const config = {
        success: {
            icon: React.createElement(CheckCircle, { className: "text-green-500", size: 22 }),
            bg: "bg-green-50",
            text: "text-green-800",
            border: "border-green-200",
        },
        error: {
            icon: React.createElement(XCircle, { className: "text-red-500", size: 22 }),
            bg: "bg-red-50",
            text: "text-red-800",
            border: "border-red-200",
        },
        warning: {
            icon: React.createElement(AlertTriangle, { className: "text-yellow-500", size: 22 }),
            bg: "bg-yellow-50",
            text: "text-yellow-800",
            border: "border-yellow-200",
        },
        info: {
            icon: React.createElement(Info, { className: "text-blue-500", size: 22 }),
            bg: "bg-blue-50",
            text: "text-blue-800",
            border: "border-blue-200",
        },
    };

    const { icon, bg, text, border } = config[type] || config.info;

    toast.custom((t) =>
        React.createElement(
            "div",
            {
                className: `${t.visible ? "animate-toast-enter" : "animate-toast-leave"} 
          max-w-sm w-full shadow-lg rounded-xl pointer-events-auto flex items-center justify-between ring-1 ring-black ring-opacity-5 
          px-4 py-3 border ${bg} ${border} transition-all duration-300`,
            },
            React.createElement(
                "div",
                { className: "flex items-center gap-3" },
                icon,
                React.createElement("p", { className: `font-medium ${text}` }, message)
            ),
            React.createElement(
                "button",
                {
                    onClick: () => toast.dismiss(t.id),
                    className: "ml-3 text-gray-500 hover:text-gray-700 transition",
                },
                React.createElement(X, { size: 18 })
            )
        )
    );
};

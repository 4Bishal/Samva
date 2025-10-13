import React, { useState, useContext } from 'react'
import { Menu, X } from 'lucide-react'
import { SideBar } from "../components/SideBar/SideBar";
import { ChatWindow } from "../components/ChatWindow/ChatWindow"
import { ThemeContext } from "../utils/ThemeProvider";

export const SamvadPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    return (
        <div className={`flex h-screen w-screen overflow-hidden ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Mobile Sidebar Toggle Button - Theme-aware */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden fixed top-3 left-4 z-50 p-2 rounded-lg  border transition-colors duration-300
                    ${isDark
                        ? " border-gray-700 text-gray-100"
                        : " border-gray-200 text-gray-800"
                    }`}
            >
                {!sidebarOpen && <Menu size={20} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative inset-y-0 left-0 z-40
                w-64 border-r
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
                ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
            `}>
                <SideBar closeSidebar={() => setSidebarOpen(false)} />
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col w-full md:w-auto">
                <ChatWindow />
            </div>
        </div>
    )
}
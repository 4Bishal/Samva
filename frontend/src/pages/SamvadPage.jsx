import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { SideBar } from "../components/SideBar/SideBar"
import { ChatWindow } from "../components/ChatWindow/ChatWindow"
import { ThemeContext } from "../utils/ThemeProvider"
import { ChatContext } from "../context/ChatProvider"
import { ScaleLoader } from "react-spinners"
import axios from "axios"
import { server } from "../utils/environment"
import { v4 as uuidv4, validate as isValidUUID } from "uuid"

export const SamvadPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { theme } = useContext(ThemeContext)
    const { currentThreadId, setCurrentThreadId, setChats, setIsNewChat } = useContext(ChatContext)
    const isDark = theme === "dark"
    const navigate = useNavigate()
    const { threadId } = useParams()
    const [isLoadingThread, setIsLoadingThread] = useState(false)

    // Load thread data when URL has threadId
    useEffect(() => {
        const loadThreadFromURL = async () => {
            if (threadId && threadId !== currentThreadId) {
                setIsLoadingThread(true)
                try {
                    // Fetch the thread data from backend
                    const response = await axios.get(`${server}/api/threads/${threadId}`, {
                        withCredentials: true
                    })

                    // Update context with loaded thread
                    setCurrentThreadId(threadId)
                    setChats(response.data.thread.message)
                    setIsNewChat(false)
                } catch (error) {
                    console.error('Error loading thread:', error)
                    // If thread doesn't exist or error, redirect to new chat
                    navigate('/samvadPlace', { replace: true })
                } finally {
                    setIsLoadingThread(false)
                }
            } else if (!threadId) {
                // No threadId in URL means new chat
                // Don't override if we already have a currentThreadId in context
                // This handles the case when creating a new chat
            }
        }

        loadThreadFromURL()
    }, [threadId]) // Only depend on threadId changes

    return (
        <div className={`flex h-screen w-screen overflow-hidden ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Mobile Sidebar Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden fixed top-3 left-4 z-50 p-2 rounded-lg border transition-colors duration-300
                    ${isDark
                        ? "border-gray-700 text-gray-100"
                        : "border-gray-200 text-gray-800"
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
                {isLoadingThread ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <ScaleLoader color={isDark ? "#9333ea" : "#7e22ce"} loading height={20} />
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Loading chat...
                        </p>
                    </div>
                ) : (
                    <ChatWindow />
                )}
            </div>
        </div>
    )
}
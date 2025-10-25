import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SquarePen, Trash2, AlertTriangle } from "lucide-react";
import LightThemeLogo from "../../assets/LightThemeLogo.png";
import DarkThemeLogo from "../../assets/DarkThemeLogo.png";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { server } from "../../utils/environment";

export const SideBar = ({ closeSidebar }) => {
    const {
        allThreads,
        setAllThreads,
        currentThreadId,
        setPrompt,
        setReply,
        setCurrentThreadId,
        setChats,
        setIsNewChat,
    } = useContext(ChatContext);

    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const navigate = useNavigate();

    const [threadToDelete, setThreadToDelete] = useState(null);

    const getAllThreads = async () => {
        try {
            const response = await axios.get(`${server}/api/threads`, { withCredentials: true });
            const threads = response.data.threads.map((t) => ({
                threadId: t.threadId,
                title: t.title,
            }));
            setAllThreads(threads);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currentThreadId]);

    const createNewChatWithTitle = async (firstMessage) => {
        setPrompt("");
        setReply(null);
        const newThreadId = uuidv4();
        setCurrentThreadId(newThreadId);
        setChats([]);
        setIsNewChat(true);

        // Navigate to /samvadPlace without threadId for new chats
        navigate('/samvadPlace');

        if (closeSidebar) closeSidebar();

        if (firstMessage) {
            try {
                const response = await axios.post(`${server}/api/chat`, {
                    threadId: newThreadId,
                    message: firstMessage
                }, { withCredentials: true });

                const { threadTitle } = response.data;

                setAllThreads((prev) => [
                    { threadId: newThreadId, title: threadTitle || "New Chat" },
                    ...prev
                ]);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const changeThreadId = async (newThreadId) => {
        setCurrentThreadId(newThreadId);

        // Navigate to thread URL
        navigate(`/samvadPlace/${newThreadId}`);

        if (closeSidebar) closeSidebar();

        try {
            const response = await axios.get(`${server}/api/threads/${newThreadId}`, { withCredentials: true });
            setChats(response.data.thread.message);
            setIsNewChat(false);
        } catch (error) {
            console.log(error);
        }
    };

    const confirmDeleteThread = (thread) => {
        setThreadToDelete(thread);
    };

    const deleteThread = async (threadId) => {
        try {
            await axios.delete(`${server}/api/threads/${threadId}`, { withCredentials: true });
            setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));

            if (threadId === currentThreadId) {
                const newThreadId = uuidv4();
                setCurrentThreadId(newThreadId);
                setChats([]);
                setIsNewChat(true);
                setPrompt("");
                setReply(null);

                // Navigate to /samvadPlace for new chat
                navigate('/samvadPlace');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setThreadToDelete(null);
        }
    };

    return (
        <aside className={`h-screen w-full flex flex-col shadow-sm transition-colors duration-300
            ${isDark ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>

            {/* Logo + New Chat */}
            <div className={`p-3 sm:p-4 flex items-center justify-between border-b transition-colors duration-300 mb-6 sm:mb-10
                ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <img src={isDark ? DarkThemeLogo : LightThemeLogo} alt="Samva" className="h-6 sm:h-8" />
                <button
                    onClick={() => createNewChatWithTitle("")}
                    className={`p-1.5 sm:p-2 rounded transition-all duration-300
                        ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-200 text-gray-900'} 
                        shadow-sm hover:shadow-md`}
                >
                    <SquarePen size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto">
                <ul className="p-2 space-y-1">
                    <AnimatePresence>
                        {allThreads.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`flex flex-col items-center justify-center px-3 py-4 text-xs sm:text-sm italic text-center
                                    ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            >
                                <p className="mb-2">No previous chats yet.</p>
                                <button
                                    onClick={() => createNewChatWithTitle("")}
                                    className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                                >
                                    <SquarePen size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                            </motion.div>
                        )}

                        {allThreads.map((thread) => (
                            <motion.li
                                key={thread.threadId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => changeThreadId(thread.threadId)}
                                className={`group flex items-center justify-between px-2 sm:px-3 py-2 rounded-lg cursor-pointer transition-colors duration-300
                                    ${thread.threadId === currentThreadId
                                        ? isDark ? "bg-purple-800 text-white" : "bg-purple-100 text-purple-700"
                                        : isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                            >
                                <span className="truncate text-xs sm:text-sm font-medium mr-2" title={thread.title}>
                                    {thread.title}
                                </span>
                                <Trash2
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDeleteThread(thread);
                                    }}
                                    className={`flex-shrink-0 transition 
                                        ${isDark ? "text-red-500 sm:text-gray-400 hover:text-red-500" : "text-red-500 sm:text-gray-400 hover:text-red-500"} 
                                        opacity-100 sm:opacity-0 group-hover:opacity-100`}
                                    size={14}
                                />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>

            {/* Footer */}
            <div className={`p-2 sm:p-3 border-t text-[10px] sm:text-xs text-center transition-colors duration-300
                ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                By <span className="text-purple-600 font-semibold">Samva ♥</span>
            </div>

            {/* Enhanced Confirmation Modal */}
            <AnimatePresence>
                {threadToDelete && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setThreadToDelete(null)}
                    >
                        <motion.div
                            className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
                                ${isDark ? "bg-gray-800" : "bg-white"}`}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header with Icon */}
                            <div className={`flex flex-col items-center pt-6 pb-4 px-6
                                ${isDark ? "bg-gradient-to-b from-red-900/20 to-transparent" : "bg-gradient-to-b from-red-50 to-transparent"}`}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4
                                        ${isDark ? "bg-red-500/20" : "bg-red-100"}`}
                                >
                                    <AlertTriangle
                                        className={`${isDark ? "text-red-400" : "text-red-500"}`}
                                        size={32}
                                        strokeWidth={2}
                                    />
                                </motion.div>

                                <h3 className={`text-xl font-bold mb-2
                                    ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    Delete Chat?
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-6">
                                <p className={`text-sm text-center mb-2
                                    ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                    This action cannot be undone. This will permanently delete your chat:
                                </p>

                                <div className={`p-3 rounded-lg mb-6 text-center
                                    ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                                    <p className={`text-sm font-medium truncate
                                        ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                                        "{threadToDelete.title}"
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setThreadToDelete(null)}
                                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                                            ${isDark
                                                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                            } hover:scale-[1.02] active:scale-[0.98]`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteThread(threadToDelete.threadId)}
                                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                                            ${isDark
                                                ? "bg-red-600 hover:bg-red-500"
                                                : "bg-red-500 hover:bg-red-600"
                                            } text-white shadow-lg hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
};
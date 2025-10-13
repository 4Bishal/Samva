import React, { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquarePen, Trash2 } from "lucide-react";
import LightThemeLogo from "../../assets/LightThemeLogo.png";
import DarkThemeLogo from "../../assets/DarkThemeLogo.png";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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

    const getAllThreads = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/threads");
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

        // Close sidebar on mobile after creating new chat
        if (closeSidebar) closeSidebar();

        if (firstMessage) {
            try {
                const response = await axios.post("http://localhost:8000/api/chat", {
                    threadId: newThreadId,
                    message: firstMessage
                });

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

        // Close sidebar on mobile after selecting thread
        if (closeSidebar) closeSidebar();

        try {
            const response = await axios.get(
                `http://localhost:8000/api/threads/${newThreadId}`
            );
            setChats(response.data.thread.message);
            setIsNewChat(false);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            await axios.delete(`http://localhost:8000/api/threads/${threadId}`);
            setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
            if (threadId === currentThreadId) setIsNewChat(true);
        } catch (error) {
            console.log(error);
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
                        ${isDark ?
                            'bg-gray-800 hover:bg-gray-700 text-white' :
                            'bg-white hover:bg-gray-200 text-gray-900'} 
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
                                        deleteThread(thread.threadId);
                                    }}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
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
        </aside>
    );
};
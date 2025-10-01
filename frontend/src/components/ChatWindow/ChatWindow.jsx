import React, { useContext, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import { Chat } from "../Chat/Chat";
import { NavBar } from "../NavBar/NavBar.jsx";

export const ChatWindow = () => {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currentThreadId,
        chats,
        setChats,
        isNewChat,
        setIsNewChat,
    } = useContext(ChatContext);

    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const [isLoading, setIsLoading] = useState(false);
    const [typingAI, setTypingAI] = useState(""); // For AI typing effect
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever chats or typingAI changes
    useEffect(() => {
        scrollToBottom();
    }, [chats, typingAI]);

    const getReply = async () => {
        if (!prompt.trim()) return;

        // Step 1: Add user's message immediately
        const userMessage = { role: "user", content: prompt };
        setChats((prev) => [...prev, userMessage]);

        setPrompt(""); // Clear input
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/api/chat", {
                message: prompt,
                threadId: currentThreadId,
            });

            const aiReply = response.data.reply;

            setIsLoading(false);
            setReply(aiReply);

            // Step 2: Typing effect for AI message
            let idx = 0;
            const words = aiReply.split(" ");

            const interval = setInterval(() => {
                setTypingAI(words.slice(0, idx + 1).join(" "));
                idx++;
                if (idx >= words.length) {
                    clearInterval(interval);
                    setTypingAI(""); // Clear typing overlay
                    // Step 3: Push full AI message to chats
                    setChats((prev) => [...prev, { role: "model", content: aiReply }]);
                }
            }, 40);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsNewChat(false);
        }
    };

    return (
        <div className={`flex flex-col h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <NavBar />

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <Chat extraTypingAI={typingAI} />
                <div ref={chatEndRef}></div>

                {isLoading && (
                    <div className="flex justify-start py-2">
                        <ScaleLoader
                            color={isDark ? "#9333ea" : "#7e22ce"}
                            loading={isLoading}
                            height={15}
                        />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div
                className={`p-4 border-t ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    } transition-colors duration-300`}
            >
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isLoading && getReply()}
                        className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 ${isDark
                                ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500"
                                : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-purple-500"
                            } text-sm transition-colors duration-300`}
                    />
                    <button
                        onClick={!isLoading ? getReply : undefined}
                        className={`p-2 rounded-full transition ${isDark
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-purple-500 hover:bg-purple-600 text-white"
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </motion.div>
                <p
                    className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"} text-center`}
                >
                    Samva can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
};

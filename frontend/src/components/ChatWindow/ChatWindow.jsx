// ChatWindow.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import { Chat } from "../Chat/Chat";
import { NavBar } from "../NavBar/NavBar.jsx";
import { useAuthStore } from "../../store/authStore";
import { ScaleLoader } from "react-spinners";
import axios from "axios";

export const ChatWindow = () => {
    const {
        prompt,
        setPrompt,
        currentThreadId,
        chats,
        setChats,
        isNewChat,
        setIsNewChat,
    } = useContext(ChatContext);

    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [typingAI, setTypingAI] = useState(""); // Typing effect overlay
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats, typingAI]);

    // Nepal time greeting
    const getGreeting = () => {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        let nepalHours = (utcHours + 5 + Math.floor((utcMinutes + 45) / 60)) % 24;

        if (nepalHours < 12) return "Good morning";
        else if (nepalHours < 18) return "Good afternoon";
        else return "Good evening";
    };

    // Send message function
    const sendMessage = async (message) => {
        if (!message.trim()) return;

        // 1️⃣ Add user message immediately
        const userMessage = { role: "user", content: message };
        setChats((prev) => [...prev, userMessage]);

        setPrompt(""); // Clear input
        setIsLoading(true);
        setIsNewChat(false);

        try {
            // 2️⃣ Fetch AI reply
            const response = await axios.post("http://localhost:8000/api/chat", {
                message,
                threadId: currentThreadId,
            });

            const aiReply = response.data.reply;

            // 3️⃣ Typing effect overlay
            let idx = 0;
            const words = aiReply.split(" ");
            const interval = setInterval(() => {
                setTypingAI(words.slice(0, idx + 1).join(" "));
                idx++;
                if (idx >= words.length) {
                    clearInterval(interval);
                    setTypingAI(""); // Remove overlay

                    // 4️⃣ Push AI message after typing finishes
                    setChats((prev) => [...prev, { role: "model", content: aiReply }]);
                }
            }, 40);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Local input component for new chat
    const LocalInput = () => {
        const [localPrompt, setLocalPrompt] = useState("");

        const handleSend = () => {
            if (!localPrompt.trim()) return;
            sendMessage(localPrompt);
            setLocalPrompt("");
        };

        return (
            <div className="flex mt-6 justify-center">
                <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={localPrompt}
                    onChange={(e) => setLocalPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                    className={`w-96 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 ${isDark
                        ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500"
                        : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-purple-500"
                        } transition-colors duration-300`}
                />
                <button
                    onClick={!isLoading ? handleSend : undefined}
                    className={`ml-2 p-2 rounded-full transition ${isDark
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                >
                    <Send size={18} />
                </button>
            </div>
        );
    };

    return (
        <div className={`flex flex-col h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <NavBar />

            {isNewChat ? (
                <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
                    <h1
                        className={`font-bold text-3xl md:text-4xl tracking-wide transition-colors duration-300 ${isDark ? "text-gray-200" : "text-gray-700"
                            }`}
                    >
                        {`${getGreeting()} ${user?.name || "there"}! 👋`}
                    </h1>
                    <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Start your new chat
                    </p>
                    <LocalInput />
                </div>
            ) : (
                <>
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <Chat extraTypingAI={typingAI} />
                        <div ref={chatEndRef}></div>

                        {isLoading && typingAI === "" && (
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
                                onKeyDown={(e) =>
                                    e.key === "Enter" && !isLoading && sendMessage(prompt)
                                }
                                className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 ${isDark
                                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500"
                                    : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-purple-500"
                                    } text-sm transition-colors duration-300`}
                            />
                            <button
                                onClick={!isLoading ? () => sendMessage(prompt) : undefined}
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
                            Samva can make mistakes. Please check important information. <br />
                            Samva remembers only your last 10 messages — just enough to keep your chat smooth and meaningful. 🧠
                        </p>

                    </div>
                </>
            )}
        </div>
    );
};

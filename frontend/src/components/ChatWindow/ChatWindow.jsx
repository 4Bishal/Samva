import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import { Chat } from "../Chat/Chat";
import { NavBar } from "../NavBar/NavBar.jsx";
import { useAuthStore } from "../../store/authStore";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import { server } from "../../utils/environment.js";

// Memoized LocalInput component
const LocalInput = memo(({ isDark, isLoading, onSendMessage }) => {
    const [localPrompt, setLocalPrompt] = useState("");
    const textareaRef = useRef(null);

    const adjustHeight = useCallback((textarea) => {
        requestAnimationFrame(() => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
        });
    }, []);

    const handleSend = useCallback(() => {
        if (!localPrompt.trim()) return;
        onSendMessage(localPrompt);
        setLocalPrompt("");
        // Reset height after sending
        if (textareaRef.current) {
            requestAnimationFrame(() => {
                textareaRef.current.style.height = 'auto';
            });
        }
    }, [localPrompt, onSendMessage]);

    const handleChange = useCallback((e) => {
        setLocalPrompt(e.target.value);
        adjustHeight(e.target);
    }, [adjustHeight]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
        }
    }, [isLoading, handleSend]);

    return (
        <div className="flex mt-8 sm:mt-10 justify-center px-4 w-full">
            <div className="flex items-end gap-2 w-full max-w-3xl">
                <div className="relative flex-1">
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        placeholder="Ask me anything..."
                        value={localPrompt}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full px-4 py-3.5 text-sm md:text-base border-2 rounded-3xl focus:outline-none focus:ring-2 resize-none overflow-hidden max-h-32 transition-all duration-200 ${isDark
                            ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-400"
                            }`}
                        style={{
                            minHeight: '52px',
                            transition: 'height 0.1s ease-out'
                        }}
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={isLoading || !localPrompt.trim()}
                    className={`p-3.5 rounded-full transition-all duration-300 flex-shrink-0 ${isLoading || !localPrompt.trim()
                        ? isDark
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isDark
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/50"
                            : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50"
                        }`}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
});

LocalInput.displayName = 'LocalInput';

// Memoized GreetingScreen component
const GreetingScreen = memo(({ isDark, userName, greeting, onSendMessage, isLoading }) => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <h1
                    className={`font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight transition-colors duration-300 px-4 ${isDark ? "text-gray-100" : "text-gray-800"
                        }`}
                >
                    <span className="block">{greeting},</span>
                    <span className="block">{userName || "there"}! 👋</span>
                </h1>

                <p className={`mt-4 text-base sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    What can I help you with today?
                </p>
            </motion.div>
            <LocalInput isDark={isDark} isLoading={isLoading} onSendMessage={onSendMessage} />
        </div>
    );
});

GreetingScreen.displayName = 'GreetingScreen';

// Memoized LoadingIndicator component
const LoadingIndicator = memo(({ isDark }) => {
    return (
        <div className={`w-full py-6 md:py-8 ${isDark ? "bg-gray-800/50" : "bg-white"}`}>
            <div className="max-w-3xl mx-auto px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                            }`}
                    >
                        AI
                    </div>
                    <ScaleLoader
                        color={isDark ? "#9333ea" : "#7e22ce"}
                        loading={true}
                        height={15}
                    />
                </div>
            </div>
        </div>
    );
});

LoadingIndicator.displayName = 'LoadingIndicator';

// Memoized MainInput component
const MainInput = memo(({ prompt, setPrompt, isDark, isLoading, onSendMessage }) => {
    const textareaRef = useRef(null);

    const handleChange = useCallback((e) => {
        setPrompt(e.target.value);
        requestAnimationFrame(() => {
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
        });
    }, [setPrompt]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault();
            onSendMessage(prompt);
            requestAnimationFrame(() => {
                e.target.style.height = 'auto';
            });
        }
    }, [isLoading, onSendMessage, prompt]);

    const handleSend = useCallback(() => {
        if (!isLoading && prompt.trim()) {
            onSendMessage(prompt);
            if (textareaRef.current) {
                requestAnimationFrame(() => {
                    textareaRef.current.style.height = 'auto';
                });
            }
        }
    }, [isLoading, prompt, onSendMessage]);

    return (
        <div
            className={`p-4 md:p-6 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
                } transition-colors duration-300`}
        >
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-end gap-2"
                >
                    <div className="relative flex-1">
                        <textarea
                            ref={textareaRef}
                            rows="1"
                            placeholder="Ask anything..."
                            value={prompt}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className={`w-full px-4 py-3.5 border-2 rounded-3xl focus:outline-none focus:ring-2 resize-none overflow-hidden max-h-32 transition-all duration-200 ${isDark
                                ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                                : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-400"
                                } text-sm md:text-base`}
                            style={{
                                minHeight: '52px',
                                transition: 'height 0.1s ease-out'
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !prompt.trim()}
                        className={`p-3.5 rounded-full transition-all duration-300 flex-shrink-0 ${isLoading || !prompt.trim()
                            ? isDark
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : isDark
                                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/50"
                                : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50"
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </motion.div>
                <p
                    className={`mt-3 text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-600"} text-center px-2`}
                >
                    Samva can make mistakes. Please check important information. <br className="hidden sm:inline" />
                    <span className="inline sm:inline">Samva remembers only your last 10 messages — just enough to keep your chat smooth and meaningful. 🧠</span>
                </p>
            </div>
        </div>
    );
});

MainInput.displayName = 'MainInput';

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
    const [typingAI, setTypingAI] = useState("");
    const chatEndRef = useRef(null);

    // Memoized greeting to prevent recalculation
    const greeting = useMemo(() => {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        let nepalHours = (utcHours + 5 + Math.floor((utcMinutes + 45) / 60)) % 24;

        if (nepalHours < 12) return "Good morning";
        else if (nepalHours < 18) return "Good afternoon";
        else return "Good evening";
    }, []); // Only calculate once on mount

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chats, typingAI, scrollToBottom]);

    // Memoized sendMessage function
    const sendMessage = useCallback(async (message) => {
        if (!message.trim()) return;

        const userMessage = { role: "user", content: message };
        setChats((prev) => [...prev, userMessage]);

        setPrompt("");
        setIsLoading(true);
        setIsNewChat(false);

        try {
            const response = await axios.post(`${server}/api/chat`, {
                message,
                threadId: currentThreadId,
            }, {
                withCredentials: true, // <-- important
            });

            const aiReply = response.data.reply;

            let idx = 0;
            const words = aiReply.split(" ");
            const interval = setInterval(() => {
                setTypingAI(words.slice(0, idx + 1).join(" "));
                idx++;
                if (idx >= words.length) {
                    clearInterval(interval);
                    setTypingAI("");
                    setChats((prev) => [...prev, { role: "model", content: aiReply }]);
                    setIsLoading(false);
                }
            }, 40);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }, [currentThreadId, setChats, setPrompt, setIsNewChat]);

    return (
        <div className={`flex flex-col h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <NavBar />

            {isNewChat ? (
                <GreetingScreen
                    isDark={isDark}
                    userName={user?.name}
                    greeting={greeting}
                    onSendMessage={sendMessage}
                    isLoading={isLoading}
                />
            ) : (
                <>
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto">
                        <Chat extraTypingAI={typingAI} />
                        <div ref={chatEndRef}></div>

                        {isLoading && typingAI === "" && (
                            <LoadingIndicator isDark={isDark} />
                        )}
                    </div>

                    {/* Input Area */}
                    <MainInput
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isDark={isDark}
                        isLoading={isLoading}
                        onSendMessage={sendMessage}
                    />
                </>
            )}
        </div>
    );
};
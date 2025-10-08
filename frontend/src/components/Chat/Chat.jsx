// Chat.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import "highlight.js/styles/github-dark.css";

export const Chat = ({ extraTypingAI }) => {
    const { chats } = useContext(ChatContext);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const [latestReply, setLatestReply] = useState("");
    const lastTypedIndex = useRef(-1);

    useEffect(() => {
        if (!extraTypingAI) return;
        lastTypedIndex.current = chats.length; // just a marker
        setLatestReply(extraTypingAI);
    }, [extraTypingAI, chats.length]);

    return (
        <div className="flex-1 space-y-4">
            {chats?.map((chat, idx) => {
                const isUser = chat.role === "user";

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[75%] text-sm rounded-2xl shadow-md transition-colors duration-300`}
                            style={{
                                backgroundColor: isUser
                                    ? isDark
                                        ? "#7C3AED"
                                        : "#9333EA"
                                    : isDark
                                        ? "#1F2937"
                                        : "#F3F4F6",
                                color: isUser ? "#fff" : isDark ? "#F3F4F6" : "#1F2937",
                                padding: "0.75rem 1rem",
                                lineHeight: "1.8",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                borderTopLeftRadius: isUser ? "1.5rem" : "0.5rem",
                                borderTopRightRadius: isUser ? "0.5rem" : "1.5rem",
                            }}
                        >
                            <div className={`prose ${isDark ? "prose-invert" : ""} max-w-full`}>
                                <Markdown rehypePlugins={[rehypeHighlight]}>
                                    {chat.content}
                                </Markdown>
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {/* Typing effect overlay */}
            {extraTypingAI && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                >
                    <div
                        className={`max-w-[75%] text-sm rounded-2xl shadow-md transition-colors duration-300`}
                        style={{
                            backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
                            color: isDark ? "#F3F4F6" : "#1F2937",
                            padding: "0.75rem 1rem",
                            lineHeight: "1.8",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            borderTopRightRadius: "1.5rem",
                            borderTopLeftRadius: "0.5rem",
                        }}
                    >
                        <Markdown rehypePlugins={[rehypeHighlight]}>{extraTypingAI}</Markdown>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

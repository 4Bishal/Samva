import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import "highlight.js/styles/github-dark.css";

export const Chat = () => {
    const { isNewChat, chats, reply } = useContext(ChatContext);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const [latestReply, setLatestReply] = useState("");
    const lastTypedIndex = useRef(-1);

    // Typing effect only for the latest AI message (new messages)
    useEffect(() => {
        if (!reply || !chats?.length) return;

        const lastIndex = chats.length - 1;
        const lastChat = chats[lastIndex];

        if (
            lastChat.role === "model" &&
            lastChat.content === reply &&
            lastIndex > lastTypedIndex.current
        ) {
            lastTypedIndex.current = lastIndex;
            const words = reply.split(" ");
            let idx = 0;
            const interval = setInterval(() => {
                setLatestReply(words.slice(0, idx + 1).join(" "));
                idx++;
                if (idx >= words.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        } else {
            setLatestReply(""); // Reset typing effect if no new AI message 
        }
    }, [chats, reply]);

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
            {isNewChat ? (
                <h1
                    className={`text-center font-bold mt-12 text-3xl md:text-4xl tracking-wide transition-colors duration-300 ${isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                >
                    Begin a fresh dialogue 💬
                </h1>
            ) : (
                <div className="flex flex-col gap-4">
                    {chats?.map((chat, idx) => {
                        const isUser = chat.role === "user";
                        const isLatestAI =
                            chat.role === "model" &&
                            idx === chats.length - 1 &&
                            latestReply;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-5 py-3 rounded-3xl max-w-[75%] text-sm shadow-md transition-colors duration-300`}
                                    style={{
                                        backgroundColor: isUser
                                            ? isDark
                                                ? "#7C3AED"
                                                : "#9333EA"
                                            : isDark
                                                ? "#1F2937"
                                                : "#F3F4F6",
                                        color: isUser ? "#fff" : isDark ? "#F3F4F6" : "#1F2937",
                                        borderTopRightRadius: isUser ? "0.5rem" : "1.5rem",
                                        borderTopLeftRadius: isUser ? "1.5rem" : "0.5rem",
                                        lineHeight: "1.8",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    <div
                                        className={`prose ${isDark ? "prose-invert" : ""} max-w-full`}
                                    >
                                        <Markdown rehypePlugins={[rehypeHighlight]}>
                                            {isLatestAI ? latestReply || chat.content : chat.content}
                                        </Markdown>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import "highlight.js/styles/github-dark.css";

export const Chat = ({ extraTypingAI }) => {
    const { chats } = useContext(ChatContext);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(index);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const getTextFromChildren = (children) => {
        if (typeof children === "string") return children;
        if (Array.isArray(children)) return children.map(getTextFromChildren).join("");
        if (children?.props?.children) return getTextFromChildren(children.props.children);
        return String(children || "");
    };

    const CodeBlock = ({ node, inline, className, children, index }) => {
        const match = /language-(\w+)/.exec(className || "");
        const codeString = getTextFromChildren(children).replace(/\n$/, "");
        const ref = useRef();
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            if (!ref.current) return;
            const observer = new IntersectionObserver(
                ([entry]) => setIsVisible(entry.isIntersecting),
                { threshold: 0.1 }
            );
            observer.observe(ref.current);
            return () => observer.disconnect();
        }, []);

        if (!inline && match) {
            return (
                <div ref={ref} className="relative group my-4">
                    <div
                        className={`flex items-center justify-between px-4 py-2 rounded-t-lg ${isDark ? "bg-gray-800 border-b border-gray-700" : "bg-gray-100 border-b border-gray-200"
                            }`}
                    >
                        <span className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {match[1].toUpperCase()}
                        </span>

                        {/* Floating copy button */}
                        {isVisible && (
                            <button
                                onClick={() => copyToClipboard(codeString, index)}
                                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-all ${copiedCode === index
                                    ? isDark
                                        ? "bg-green-900/50 text-green-400 cursor-default"
                                        : "bg-green-100 text-green-700 cursor-default"
                                    : isDark
                                        ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                                        : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                {copiedCode === index ? (
                                    <>
                                        <Check size={14} strokeWidth={2.5} />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    <pre className="!mt-0 !rounded-t-none overflow-x-auto">
                        <code className={className}>{children}</code>
                    </pre>
                </div>
            );
        }

        return (
            <code
                className={`${className} px-1.5 py-0.5 rounded text-sm ${isDark ? "bg-gray-800 text-purple-400" : "bg-purple-50 text-purple-700"
                    }`}
            >
                {children}
            </code>
        );
    };

    return (
        <div className="flex-1 space-y-0">
            {chats?.map((chat, idx) => {
                const isUser = chat.role === "user";
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full py-6 md:py-8"
                    >
                        <div className="max-w-3xl mx-auto px-4 md:px-6">
                            <div className={`${isUser ? "ml-auto w-fit max-w-[85%] md:max-w-[70%]" : "w-full"}`}>
                                {!isUser && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                                                }`}
                                        >
                                            AI
                                        </div>
                                        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                            Samva
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`text-sm md:text-base ${isUser
                                        ? `rounded-2xl px-4 py-2.5 ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                                        }`
                                        : isDark
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                    style={{
                                        lineHeight: "1.6",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {isUser ? (
                                        chat.content
                                    ) : (
                                        <div className={`prose prose-sm md:prose ${isDark ? "prose-invert" : ""} max-w-full`}>
                                            <Markdown
                                                rehypePlugins={[rehypeHighlight]}
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code: (props) => (
                                                        <CodeBlock {...props} index={idx} isDark={isDark} copyToClipboard={copyToClipboard} />
                                                    ),
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            {...props}
                                                            className="text-purple-500 hover:text-purple-600 underline decoration-purple-500/30 hover:decoration-purple-500 transition-colors"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        />
                                                    ),
                                                }}
                                            >
                                                {chat.content}
                                            </Markdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {/* Typing overlay */}
            {extraTypingAI && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full py-6 md:py-8 ${isDark ? "bg-gray-800/50" : "bg-white"}`}
                >
                    <div className="max-w-3xl mx-auto px-4 md:px-6">
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                                        }`}
                                >
                                    AI
                                </div>
                                <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Samva</span>
                                <div className="flex gap-1 ml-1">
                                    {[0, 0, 0].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                            className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-purple-400" : "bg-purple-500"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className={`text-sm md:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                                <div className={`prose prose-sm md:prose ${isDark ? "prose-invert" : ""} max-w-full`}>
                                    <Markdown
                                        rehypePlugins={[rehypeHighlight]}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code: (props) => (
                                                <CodeBlock {...props} index={chats.length} isDark={isDark} copyToClipboard={copyToClipboard} />
                                            ),
                                        }}
                                    >
                                        {extraTypingAI}
                                    </Markdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

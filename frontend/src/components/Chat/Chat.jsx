import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import { ChatContext } from "../../context/ChatProvider";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import "highlight.js/styles/github-dark.css";

export const Chat = () => {
    const { isNewChat, chats, reply } = useContext(ChatContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }
        if (!chats?.length) return;

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 50);

        return () => clearInterval(interval);
    }, [chats, reply]);

    return (
        <>
            {isNewChat ? (
                <h1>Begin a fresh dialogue 💬</h1>
            ) : (
                <div className="chats">
                    {chats?.slice(0, -1).map((chat, idx) => (
                        <div
                            className={chat.role === "user" ? "userDiv" : "modelDiv"}
                            key={idx}
                        >
                            {chat.role === "user" ? (
                                <p className="userMsg">{chat.content}</p>
                            ) : (
                                <Markdown rehypePlugins={rehypeHighlight}>
                                    {chat.content}
                                </Markdown>
                            )}
                        </div>
                    ))}

                    {chats.length > 0 && (
                        <>
                            {latestReply !== null ? (
                                <div className="modelDiv">
                                    <Markdown rehypePlugins={rehypeHighlight}>
                                        {latestReply}
                                    </Markdown>
                                </div>
                            ) : (
                                <div className="modelDiv">
                                    <Markdown rehypePlugins={rehypeHighlight}>
                                        {chats[chats.length - 1].content}
                                    </Markdown>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

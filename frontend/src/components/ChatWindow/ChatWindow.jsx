import React, { useContext, useState } from 'react'
import "./ChatWindow.css"
import { Chat } from '../Chat/Chat'
import { ChevronDown, CircleUserRound, Send } from 'lucide-react';
import { ChatContext } from '../../context/ChatProvider';
import axios from "axios"
import { ScaleLoader } from "react-spinners"

export const ChatWindow = () => {
    const { prompt, setPrompt, reply, setReply, currentThreadId, chats, setChats, isNewChat, setIsNewChat } =
        useContext(ChatContext);

    const [isLoading, setIsLoading] = useState(false); // fix: false means not loading

    const getReply = async () => {
        if (!prompt.trim()) return; // prevent empty input
        setIsLoading(true); // fix: start loader

        try {
            const response = await axios.post("http://localhost:8000/api/chat", {
                message: prompt,
                threadId: currentThreadId,
            });

            setReply(response.data.reply);

            setChats(prev => [
                ...prev,
                { role: "user", content: prompt },
                { role: "model", content: response.data.reply },
            ]);

            setPrompt(""); // clear after sending
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // fix: stop loader
            setIsNewChat(false)
        }
    };

    return (
        <div className='chatWindow'>
            <div className='navbar'>
                <span>Samva <ChevronDown className='arrow' /> </span>
                <div className='userIconDiv'>
                    <span className='userIcon'>
                        <CircleUserRound strokeWidth={2} className='fa-user' />
                    </span>
                </div>
            </div>

            <Chat />

            {isLoading && <ScaleLoader color='#fff' loading={isLoading} />}

            <div className='chatInput'>
                <div className="inputBox">
                    <input
                        type="text"
                        placeholder='Ask Anything'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isLoading ? getReply() : null}
                    />
                    <div id='submit' onClick={!isLoading ? getReply : undefined}>
                        <Send className='send' />
                    </div>
                </div>
                <p className="info">Samva can make mistakes. Check important info.</p>
            </div>
        </div>
    )
}

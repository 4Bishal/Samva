import React, { useContext, useEffect } from 'react'
import "./Sidebar.css";
import SamvaLogo from "../../assets/SamvaLogo.png"
import { SquarePen, Trash2 } from 'lucide-react';
import { ChatContext } from '../../context/ChatProvider';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const SideBar = () => {

    const { allThreads, setAllThreads, currentThreadId, setPrompt, setReply, setCurrentThreadId, setChats, setIsNewChat } = useContext(ChatContext);

    const getAllThreads = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/threads");
            const allThreads = response.data.threads;

            const filteredThreads = allThreads.map(thread => ({ threadId: thread.threadId, title: thread.title }))
            // console.log(filteredThreads);
            setAllThreads(filteredThreads)
        } catch (error) {
            console.log(error)
        }
    }

    const createNewChat = () => {
        setPrompt("");
        setReply(null);
        setCurrentThreadId(uuidv4());
        setChats([]);
        setIsNewChat(true);
        setReply(null)
    }

    useEffect(() => {

        getAllThreads();

    }, [currentThreadId]);

    const changeThreadId = async (newThreadId) => {
        setCurrentThreadId(newThreadId);

        try {
            const response = await axios.get(`http://localhost:8000/api/threads/${newThreadId}`);
            setChats(response.data.thread.message)
            setIsNewChat(false)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteThread = async (newThreadId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/threads/${newThreadId}`);

            setAllThreads(prev => prev.filter(thread => thread.threadId != newThreadId));

            if (newThreadId === currentThreadId) {
                createNewChat();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className='sidebar'>

            {/* new chat button */}

            <button>
                <img src={SamvaLogo} alt="SamvaLogo" className='logo' />
                <span onClick={createNewChat}><SquarePen className='fa-solid fa-pen-to-square' /></span>

            </button>

            {/* Historys */}
            <ul className='history'>
                {
                    allThreads.map((thread, idx) => (
                        <li key={idx} onClick={(e) => changeThreadId(thread.threadId)}>{thread.title}  <Trash2 onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread.threadId)
                        }} className='fa-trash' /></li>

                    ))
                }
            </ul>

            {/* sign */}
            <p>By Samva &hearts;    </p>

        </section>
    )
}

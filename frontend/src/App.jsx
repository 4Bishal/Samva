import { ChatWindow } from "./components/ChatWindow/ChatWindow"
import { SideBar } from "./components/SideBar/SideBar.jsx"
import "./App.css"
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { ChatContext } from "./context/ChatProvider.jsx";


function App() {
  const [prompt, setPrompt] = useState("")
  const [reply, setReply] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv4());
  const [chats, setChats] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currentThreadId, setCurrentThreadId,
    chats, setChats,
    isNewChat, setIsNewChat,
    allThreads, setAllThreads
  };

  return (
    <div className="app">
      <ChatContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </ChatContext.Provider>
    </div>
  )
}

export default App

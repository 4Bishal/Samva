import { ChatWindow } from "./components/ChatWindow/ChatWindow";
import { SideBar } from "./components/SideBar/SideBar.jsx";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { ChatContext } from "./context/ChatProvider.jsx";
import { ThemeProvider } from "./utils/ThemeProvider.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv4());
  const [chats, setChats] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId,
    setCurrentThreadId,
    chats,
    setChats,
    isNewChat,
    setIsNewChat,
    allThreads,
    setAllThreads,
  };

  return (
    <ThemeProvider>
      <ChatContext.Provider value={providerValues}>
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
          {/* Sidebar */}
          <div className="hidden md:block w-64 border-r bg-white">
            <SideBar />
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            <ChatWindow />
          </div>
        </div>
      </ChatContext.Provider>
    </ThemeProvider>
  );
}

export default App;

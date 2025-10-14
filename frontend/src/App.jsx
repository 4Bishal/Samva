import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { ChatContext } from "./context/ChatProvider.jsx";
import { ThemeProvider } from "./utils/ThemeProvider.jsx";
import { SamvadPage } from "./pages/SamvadPage.jsx";
import { GuestRoute } from "./utils/GuestRoute.jsx";
import { ProtectedRoute } from "./utils/ProtectedRoute.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { useAuthStore } from "./store/authStore.jsx";



function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        {/* Toast container */}
        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/samvadPlace"
              element={
                <ProtectedRoute>
                  <SamvadPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ChatContext.Provider>
    </ThemeProvider>
  );
}

export default App;

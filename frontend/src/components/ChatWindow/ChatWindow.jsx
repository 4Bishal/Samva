import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff } from "lucide-react";
import { ChatContext } from "../../context/ChatProvider";
import { ThemeContext } from "../../utils/ThemeProvider";
import { Chat } from "../Chat/Chat";
import { NavBar } from "../NavBar/NavBar.jsx";
import { useAuthStore } from "../../store/authStore";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import { server } from "../../utils/environment.js";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// Premium Voice Visualizer Component
const VoiceVisualizer = memo(({ volume, isDark }) => {
    return (
        <motion.div
            className="absolute right-12 bottom-3 flex items-center gap-0.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
        >
            {[...Array(5)].map((_, i) => {
                const delay = i * 0.1;
                const baseHeight = 4;
                const maxHeight = 20;
                const waveHeight = baseHeight + (volume * maxHeight);

                return (
                    <motion.div
                        key={i}
                        className={`w-0.5 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-600'
                            }`}
                        animate={{
                            height: [baseHeight, waveHeight, baseHeight],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: delay,
                        }}
                        style={{
                            boxShadow: isDark
                                ? '0 0 8px rgba(192, 132, 252, 0.5)'
                                : '0 0 8px rgba(147, 51, 234, 0.5)',
                        }}
                    />
                );
            })}
        </motion.div>
    );
});

VoiceVisualizer.displayName = 'VoiceVisualizer';

// Premium Circular Wave Visualizer
const CircularWaveVisualizer = memo(({ volume, isDark }) => {
    return (
        <motion.div
            className="absolute right-12 bottom-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
        >
            <div className="relative w-8 h-8 flex items-center justify-center">
                <motion.div
                    className={`absolute inset-0 rounded-full ${isDark ? 'bg-purple-500/20' : 'bg-purple-600/20'
                        }`}
                    animate={{
                        scale: [1, 1.5 + volume * 0.5, 1],
                        opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className={`absolute inset-1 rounded-full ${isDark ? 'bg-purple-500/40' : 'bg-purple-600/40'
                        }`}
                    animate={{
                        scale: [1, 1.3 + volume * 0.3, 1],
                        opacity: [0.6, 0.3, 0.6],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                    }}
                />

                <motion.div
                    className={`relative w-3 h-3 rounded-full ${isDark ? 'bg-purple-500' : 'bg-purple-600'
                        }`}
                    animate={{
                        scale: [1, 1.2 + volume * 0.2, 1],
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: isDark
                            ? `0 0 ${10 + volume * 10}px rgba(168, 85, 247, 0.8)`
                            : `0 0 ${10 + volume * 10}px rgba(147, 51, 234, 0.8)`,
                    }}
                />
            </div>
        </motion.div >
    );
});

CircularWaveVisualizer.displayName = 'CircularWaveVisualizer';

// Premium DNA Helix Visualizer - Double helix animation
const DNAHelixVisualizer = memo(({ volume, isDark }) => {
    const dots = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

    return (
        <motion.div
            className="absolute right-12 bottom-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="relative w-8 h-8 flex items-center justify-center">
                {dots.map((i) => {
                    const phase = (i * Math.PI) / 3;
                    const delay = i * 0.1;

                    return (
                        <React.Fragment key={i}>
                            <motion.div
                                className={`absolute w-1.5 h-1.5 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-600'
                                    }`}
                                animate={{
                                    x: [
                                        Math.cos(phase) * 8,
                                        Math.cos(phase + Math.PI) * 8,
                                        Math.cos(phase + Math.PI * 2) * 8,
                                    ],
                                    y: [
                                        Math.sin(phase) * 8,
                                        Math.sin(phase + Math.PI) * 8,
                                        Math.sin(phase + Math.PI * 2) * 8,
                                    ],
                                    scale: [0.8, 1 + volume * 0.4, 0.8],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: delay,
                                }}
                            />
                            <motion.div
                                className={`absolute w-1.5 h-1.5 rounded-full ${isDark ? 'bg-pink-400' : 'bg-pink-600'
                                    }`}
                                animate={{
                                    x: [
                                        Math.cos(phase + Math.PI) * 8,
                                        Math.cos(phase) * 8,
                                        Math.cos(phase + Math.PI) * 8,
                                    ],
                                    y: [
                                        Math.sin(phase + Math.PI) * 8,
                                        Math.sin(phase) * 8,
                                        Math.sin(phase + Math.PI) * 8,
                                    ],
                                    scale: [0.8, 1 + volume * 0.4, 0.8],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: delay,
                                }}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </motion.div>
    );
});

DNAHelixVisualizer.displayName = 'DNAHelixVisualizer';

// Hook for voice input
const useVoiceInput = (setPrompt, selectedLanguage) => {
    const [isListening, setIsListening] = useState(false);
    const [volume, setVolume] = useState(0);
    const basePromptRef = useRef("");
    const lastTranscriptLengthRef = useRef(0);
    const audioContextRef = useRef(null);
    const rafIdRef = useRef(null);

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Audio volume analysis
    useEffect(() => {
        if (!isListening) return;

        let cleanup;
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.8;

                const mic = audioContext.createMediaStreamSource(stream);
                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                audioContextRef.current = audioContext;
                mic.connect(analyser);

                let smoothedVolume = 0;
                const analyze = () => {
                    analyser.getByteFrequencyData(dataArray);
                    const voiceRange = dataArray.slice(10, 30);
                    const avg = voiceRange.reduce((a, b) => a + b, 0) / voiceRange.length;
                    smoothedVolume = smoothedVolume * 0.7 + (avg / 255) * 0.3;
                    setVolume(smoothedVolume);
                    rafIdRef.current = requestAnimationFrame(analyze);
                };
                analyze();

                cleanup = () => {
                    stream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                    cancelAnimationFrame(rafIdRef.current);
                };
            })
            .catch(console.error);

        return cleanup;
    }, [isListening]);

    // Update prompt with transcript
    useEffect(() => {
        if (!isListening) return;

        const currentLength = transcript.length;
        if (currentLength !== lastTranscriptLengthRef.current) {
            const newPrompt = basePromptRef.current
                ? `${basePromptRef.current} ${transcript}`.trim()
                : transcript;

            setPrompt(newPrompt);
            lastTranscriptLengthRef.current = currentLength;
        }
    }, [transcript, isListening, setPrompt]);

    // Toggle mic
    const toggleMic = useCallback(async () => {
        if (!browserSupportsSpeechRecognition) {
            alert("Speech recognition not supported in this browser");
            return;
        }

        if (isListening) {
            SpeechRecognition.stopListening();
            setIsListening(false);
            setVolume(0);
            basePromptRef.current = "";
            lastTranscriptLengthRef.current = 0;
        } else {
            setPrompt(current => {
                basePromptRef.current = current;
                return current;
            });
            resetTranscript();
            lastTranscriptLengthRef.current = 0;
            setIsListening(true);

            await SpeechRecognition.startListening({
                continuous: true,
                language: selectedLanguage,
            });
        }
    }, [isListening, browserSupportsSpeechRecognition, resetTranscript, setPrompt, selectedLanguage]);

    return { isListening, volume, toggleMic, resetTranscript };
};

// Visualizer selector component
const VisualizerRenderer = memo(({ type, volume, isDark }) => {
    switch (type) {
        case 'bars':
            return <VoiceVisualizer volume={volume} isDark={isDark} />;
        case 'circular':
            return <CircularWaveVisualizer volume={volume} isDark={isDark} />;
        case 'dnaHelix':
            return <DNAHelixVisualizer volume={volume} isDark={isDark} />;
        default:
            return <VoiceVisualizer volume={volume} isDark={isDark} />;
    }
});

VisualizerRenderer.displayName = 'VisualizerRenderer';

// Shared input component
const InputField = memo(({
    value,
    onChange,
    onKeyDown,
    onSend,
    isDark,
    isLoading,
    placeholder = "Ask me anything...",
    isListening,
    volume,
    onToggleMic,
    visualizerType }) => {
    const textareaRef = useRef(null);

    const adjustHeight = useCallback(() => {
        if (!textareaRef.current) return;
        requestAnimationFrame(() => {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        });
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [value, adjustHeight]);

    const baseInputClass = `w-full px-3.5 py-2.5 text-sm border-2 rounded-2xl focus:outline-none focus:ring-2 resize-none overflow-hidden max-h-[120px] transition-all duration-200 ${isDark
        ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
        : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-400 placeholder:text-gray-400"
        }`;

    const isSendDisabled = isLoading || !value.trim() || isListening;

    const buttonClass = (condition) => `p-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${condition
        ? isDark
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        : isDark
            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/50"
            : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50"
        }`;

    const micButtonClass = `relative p-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${isListening
        ? "bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/50"
        : isDark
            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
            : "bg-gray-200 hover:bg-gray-300 text-gray-600"
        }`;

    return (
        <div className="flex items-end gap-2">
            <div className="relative flex-1">
                <motion.textarea
                    ref={textareaRef}
                    rows="1"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className={baseInputClass}
                    style={{ minHeight: '44px' }}
                    animate={isListening ? {
                        borderColor: isDark
                            ? ['#6b7280', '#a855f7', '#6b7280']
                            : ['#d1d5db', '#a855f7', '#d1d5db'],
                    } : {}}
                    transition={isListening ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    } : {}}
                />

                <AnimatePresence>
                    {isListening && (
                        <VisualizerRenderer type={visualizerType} volume={volume} isDark={isDark} />
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                onClick={onToggleMic}
                className={micButtonClass}
                aria-label="Toggle voice input"
                whileTap={{ scale: 0.95 }}
                animate={isListening ? {
                    boxShadow: [
                        '0 0 0 0 rgba(239, 68, 68, 0.4)',
                        '0 0 0 10px rgba(239, 68, 68, 0)',
                        '0 0 0 0 rgba(239, 68, 68, 0)',
                    ],
                } : {}}
                transition={isListening ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                } : {}}
            >
                <motion.div
                    animate={isListening ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={isListening ? { duration: 0.5, repeat: Infinity } : {}}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </motion.div>
            </motion.button>

            <motion.button
                onClick={onSend}
                disabled={isSendDisabled}
                className={buttonClass(isSendDisabled)}
                aria-label="Send message"
                whileTap={!isSendDisabled ? { scale: 0.95 } : {}}
                whileHover={!isSendDisabled ? { scale: 1.05 } : {}}
                title={isListening ? "Stop recording to send" : "Send message"}
            >
                <Send size={18} />
            </motion.button>
        </div>
    );
});

InputField.displayName = 'InputField';

// LocalInput for greeting screen
const LocalInput = memo(({ isDark, isLoading, onSendMessage, selectedLanguage, visualizerType }) => {
    const [localPrompt, setLocalPrompt] = useState("");
    const { isListening, volume, toggleMic, resetTranscript } = useVoiceInput(setLocalPrompt, selectedLanguage);

    const handleSend = useCallback(() => {
        if (!localPrompt.trim() || isListening) return;
        onSendMessage(localPrompt.trim());
        setLocalPrompt("");
        resetTranscript();
    }, [localPrompt, isListening, onSendMessage, resetTranscript]);

    const handleChange = useCallback((e) => setLocalPrompt(e.target.value), []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading && !isListening) {
            e.preventDefault();
            handleSend();
        }
    }, [isLoading, isListening, handleSend]);

    return (
        <div className="flex mt-6 justify-center px-4 w-full">
            <div className="w-full max-w-3xl">
                <InputField
                    value={localPrompt}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onSend={handleSend}
                    isDark={isDark}
                    isLoading={isLoading}
                    isListening={isListening}
                    volume={volume}
                    onToggleMic={toggleMic}
                    visualizerType={visualizerType}
                />
            </div>
        </div>
    );
});

LocalInput.displayName = 'LocalInput';

// GreetingScreen
const GreetingScreen = memo(({ isDark, userName, greeting, onSendMessage, isLoading, selectedLanguage, visualizerType }) => (
    <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
        >
            <h1 className={`font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight transition-colors duration-300 px-4 ${isDark ? "text-gray-100" : "text-gray-800"
                }`}>
                <span className="block">{greeting},</span>
                <span className="block">{userName || "there"}! 👋</span>
            </h1>
            <p className={`mt-3 text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                What can I help you with today?
            </p>
        </motion.div>
        <LocalInput
            isDark={isDark}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
            selectedLanguage={selectedLanguage}
            visualizerType={visualizerType}
        />
    </div>
));

GreetingScreen.displayName = 'GreetingScreen';

// LoadingIndicator
const LoadingIndicator = memo(({ isDark }) => (
    <div className={`w-full py-4 ${isDark ? "bg-gray-800/50" : "bg-white"}`}>
        <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                    }`}>
                    AI
                </div>
                <ScaleLoader color={isDark ? "#9333ea" : "#7e22ce"} loading height={15} />
            </div>
        </div>
    </div>
));

LoadingIndicator.displayName = 'LoadingIndicator';

// MainInput
const MainInput = memo(({ prompt, setPrompt, isDark, isLoading, onSendMessage, selectedLanguage, visualizerType }) => {
    const { isListening, volume, toggleMic, resetTranscript } = useVoiceInput(setPrompt, selectedLanguage);

    const handleSend = useCallback(() => {
        if (!isLoading && prompt.trim() && !isListening) {
            onSendMessage(prompt.trim());
            resetTranscript();
        }
    }, [isLoading, prompt, isListening, onSendMessage, resetTranscript]);

    const handleChange = useCallback((e) => setPrompt(e.target.value), [setPrompt]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading && !isListening) {
            e.preventDefault();
            handleSend();
        }
    }, [isLoading, isListening, handleSend]);

    return (
        <div className={`p-3 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
            } transition-colors duration-300`}>
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <InputField
                        value={prompt}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onSend={handleSend}
                        isDark={isDark}
                        isLoading={isLoading}
                        placeholder="Ask anything..."
                        isListening={isListening}
                        volume={volume}
                        onToggleMic={toggleMic}
                        visualizerType={visualizerType}
                    />
                </motion.div>
            </div>
        </div>
    );
});

MainInput.displayName = 'MainInput';

// Main component
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
    const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
    const [selectedVisualizer, setSelectedVisualizer] = useState('circular');
    const [isListening, setIsListening] = useState(false);

    const chatEndRef = useRef(null);

    const greeting = useMemo(() => {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const nepalHours = (utcHours + 5 + Math.floor((utcMinutes + 45) / 60)) % 24;

        if (nepalHours < 12) return "Good morning";
        if (nepalHours < 18) return "Good afternoon";
        return "Good evening";
    }, []);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chats, typingAI, scrollToBottom]);

    const sendMessage = useCallback(async (message) => {
        if (!message.trim()) return;

        setChats(prev => [...prev, { role: "user", content: message }]);
        setPrompt("");
        setIsLoading(true);
        setIsNewChat(false);

        try {
            const { data } = await axios.post(`${server}/api/chat`, {
                message,
                threadId: currentThreadId,
            }, { withCredentials: true });

            const words = data.reply.split(" ");
            let idx = 0;

            const interval = setInterval(() => {
                setTypingAI(words.slice(0, idx + 1).join(" "));
                idx++;

                if (idx >= words.length) {
                    clearInterval(interval);
                    setTypingAI("");
                    setChats(prev => [...prev, { role: "model", content: data.reply }]);
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
            <NavBar
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                selectedVisualizer={selectedVisualizer}
                onVisualizerChange={setSelectedVisualizer}
                isListening={isListening}
            />

            {isNewChat ? (
                <GreetingScreen
                    isDark={isDark}
                    userName={user?.name}
                    greeting={greeting}
                    onSendMessage={sendMessage}
                    isLoading={isLoading}
                    selectedLanguage={selectedLanguage}
                    visualizerType={selectedVisualizer}
                />
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto">
                        <Chat extraTypingAI={typingAI} />
                        <div ref={chatEndRef} />
                        {isLoading && !typingAI && <LoadingIndicator isDark={isDark} />}
                    </div>

                    <MainInput
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isDark={isDark}
                        isLoading={isLoading}
                        onSendMessage={sendMessage}
                        selectedLanguage={selectedLanguage}
                        visualizerType={selectedVisualizer}
                    />
                </>
            )}
        </div>
    );
};
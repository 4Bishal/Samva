import React from 'react'
import { SideBar } from "../components/SideBar/SideBar";
import { ChatWindow } from "../components/ChatWindow/ChatWindow"
export const SamvadPage = () => {
    return (
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
    )
}

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import NewChatModal from "../components/NewChatModal";
import ProfileModal from "../components/ProfileModal";
import { useMainPage } from "../../hooks/mainPageHook";
import { AuthHook } from "../../../auth/hooks/authHook";
import { socket } from "../../../shared/socket/socket";
import useAuthMe from "../../../shared/hooks/authmeHook";
import useProfile from "../../hooks/profileHook";

function MainPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: userData } = useAuthMe();
  const user = userData?.data;
  const { data: profileData } = useProfile(true);

  const {
    handleNewChat,
    setSidebarOpen,
    setNewChatOpen,
    sidebarOpen,
    newChatOpen,
    handleCreateChat,
    chatData,
    chatLoading,
  } = useMainPage();
  const { handleLogout } = AuthHook();

  const chats = useMemo(() => chatData?.allChatHistory || [], [chatData]);

  const selectedTitle = useMemo(() => {
    const chat = chats.find((c) => c._id === selectedChatId);
    return chat?.title || "";
  }, [chats, selectedChatId]);

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
    setSidebarOpen(false);
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-cream-50 text-ink-800 transition-colors duration-300 dark:bg-ink-900 dark:text-cream-100">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={handleLogout}
        onShowProfile={() => setProfileOpen(true)}
      />

      <div className="relative flex min-h-0 flex-1">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-10 bg-ink-900/40 backdrop-blur-[2px] md:hidden animate-fade-in dark:bg-black/60"
          />
        )}

        <Sidebar
          chats={chats}
          isLoading={chatLoading}
          isOpen={sidebarOpen}
          onNewChat={handleNewChat}
          onLogout={handleLogout}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          user={user}
        />

        <ChatArea
          selectedChatId={selectedChatId}
          chatTitle={selectedTitle}
          onNewChat={handleNewChat}
          requestLimit={profileData?.data?.dailyRequestLimit || 0}
          requestsRemaining={profileData?.data?.stats?.requestsRemaining}
        />
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onCreate={handleCreateChat}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}

export default MainPage;
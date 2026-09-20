import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createChatApi, getAllChatApi } from "../api/createChatApi";
import { toast } from "react-toastify";

export const useMainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newChatOpen, setNewChatOpen] = useState(false);

  const queryClient = useQueryClient();

  // Create Chat Mutation
  const { mutate: createChat } = useMutation({
    mutationFn: createChatApi,

    onSuccess: (data) => {
      // console.log("Chat created:", data);

      toast.success(data.message || "Chat created successfully");
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      setNewChatOpen(false);
    },

    onError: (error) => {
      console.log("Create Chat Error:", error.response?.data);

      toast.error(error.response?.data?.message || "Unable to create chat");
    },
  });

  //  get all chat
  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getAllChatApi,
  });

  const handleNewChat = () => {
    setNewChatOpen(true);
  };

  const handleCreateChat = (data) => {
    // console.log("New Chat Data:", data);
    createChat(data);
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  return {
    handleNewChat,
    handleLogout,
    handleCreateChat,
    sidebarOpen,
    newChatOpen,
    setNewChatOpen,
    setSidebarOpen,
    chatData,
    chatLoading,
  };
};

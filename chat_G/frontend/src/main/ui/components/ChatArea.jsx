import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-toastify";

import { socket } from "../../../shared/socket/socket";
import { getChatMessagesApi } from "../../api/createChatApi";

const AI_AVATAR = (
  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient shadow-md shadow-clay-500/25">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C6.7 3 2.5 6.6 2.5 11c0 2.3 1.1 4.3 2.9 5.7L4.3 20l3.6-1.5c1.3.4 2.7.6 4.1.6 5.3 0 9.5-3.6 9.5-8.1S17.3 3 12 3z"
        fill="#FCFAF5"
      />
      <circle cx="9" cy="11" r="1.1" fill="#E9884F" />
      <circle cx="12" cy="11" r="1.1" fill="#E9884F" />
      <circle cx="15" cy="11" r="1.1" fill="#E9884F" />
    </svg>
  </span>
);

const SUGGESTIONS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" />
        <path d="M10 9h6M10 13h4" />
      </svg>
    ),
    title: "Write & summarize",
    desc: "Draft emails, docs, and get crisp summaries.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-6 6c0 2.2 1.2 3.6 2 4.5V15a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1.5c.8-.9 2-2.3 2-4.5a6 6 0 0 0-6-6z" />
      </svg>
    ),
    title: "Brainstorm ideas",
    desc: "Get creative angles for any topic in seconds.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m21 12-8.5 8.5a2 2 0 0 1-3 0L3 14" />
        <path d="M3 12V8a2 2 0 0 1 2-2h4" />
        <circle cx="9" cy="6" r="1.6" />
      </svg>
    ),
    title: "Plan & organize",
    desc: "Build schedules, lists, and roadmaps fast.",
  },
];

function ChatMessage({ msg, onCopy, copiedId }) {
  const isUser = msg.role === "user";

  // System messages render as a centered pill (e.g. daily limit notice)
  if (msg.role === "system") {
    return (
      <div className="flex w-full justify-center animate-fade-in">
        <span className="max-w-md rounded-full border border-clay-300/60 bg-clay-100/80 px-4 py-1.5 text-center text-xs font-medium text-clay-700 transition-colors dark:border-clay-500/30 dark:bg-clay-700/25 dark:text-clay-200">
          {msg.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full gap-3 animate-fade-up ${isUser ? "justify-end" : "justify-start"}`}
      style={{ animationDelay: "0ms" }}
    >
      {!isUser && AI_AVATAR}

      <div className={`min-w-0 max-w-[85%] sm:max-w-[78%] ${isUser ? "order-1" : ""}`}>
        <div
          className={[
            "group relative rounded-2xl px-4 py-3 text-[15px] leading-relaxed transition-colors duration-300",
            isUser
              ? "rounded-br-lg bg-brand-gradient text-white shadow-lg shadow-clay-500/20"
              : "rounded-bl-lg border border-cream-200 bg-white text-ink-800 shadow-sm dark:border-ink-700 dark:bg-ink-800 dark:text-cream-100",
          ].join(" ")}
        >
          <div className={isUser ? "" : "chat-markdown"}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            )}
          </div>

          {/* Copy action (AI messages only) */}
          {!isUser && (
            <button
              onClick={() => onCopy(msg.content)}
              aria-label="Copy message"
              title="Copy response"
              className="absolute -bottom-3 right-3 grid h-7 w-7 cursor-pointer place-items-center rounded-lg border border-cream-200 bg-white text-ink-400 opacity-0 shadow-sm transition-all duration-200 hover:text-clay-600 group-hover:opacity-100 dark:border-ink-600 dark:bg-ink-900 dark:text-cream-400 dark:hover:text-clay-300"
            >
              {copiedId === msg.id || copiedId === msg._id ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-800 text-xs font-bold text-cream-50 shadow-md dark:bg-ink-700">
          YOU
        </span>
      )}
    </div>
  );
}

function ChatArea({ selectedChatId, chatTitle, onNewChat, requestLimit = 0, requestsRemaining }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages", selectedChatId],
    queryFn: () => getChatMessagesApi(selectedChatId),
    enabled: !!selectedChatId,
  });

  // Reset messages when switching chat
  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
    setCopiedId(null);
  }, [selectedChatId]);

  useEffect(() => {
    if (data?.success) {
      setMessages(data.messages || []);
    }
  }, [data]);

  // AI response
  useEffect(() => {
    const handleAIResponse = (data) => {
      if (data.chatId !== selectedChatId) return;
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          role: "model",
          content: data.content,
        },
      ]);
    };

    socket.on("ai-response", handleAIResponse);
    return () => {
      socket.off("ai-response", handleAIResponse);
    };
  }, [selectedChatId]);

  // Daily AI request limit
  useEffect(() => {
    if (requestsRemaining != null && remaining === null) {
      setRemaining(requestsRemaining);
    }
  }, [requestsRemaining, remaining]);

  useEffect(() => {
    const handleAILimit = (data) => {
      if (data.chatId !== selectedChatId) return;
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
      setRemaining(0);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          role: "system",
          content: data.message || "Daily AI request limit reached. It resets tomorrow.",
        },
      ]);
      toast.error(data.message || "Daily AI request limit reached. It resets tomorrow.");
    };

    const handleAIRemaining = (data) => {
      if (data.chatId !== selectedChatId) return;
      setRemaining(data.remaining);
    };

    socket.on("ai-limit", handleAILimit);
    socket.on("ai-remaining", handleAIRemaining);
    return () => {
      socket.off("ai-limit", handleAILimit);
      socket.off("ai-remaining", handleAIRemaining);
    };
  }, [selectedChatId]);

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (!selectedChatId) return;

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: "user",
      content: message.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 45000);

    socket.emit("ai-message", {
      chatId: selectedChatId,
      message: message.trim(),
    });

    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(content);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.log("Copy failed", err);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const requestsLeft = remaining ?? requestsRemaining ?? requestLimit;
  const limitReached = requestLimit > 0 && requestsLeft === 0;
  const isDisabled = !selectedChatId || isTyping || limitReached;

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col bg-gradient-to-b from-cream-50 to-cream-100 transition-colors duration-300 dark:from-ink-900 dark:to-ink-800">
      {/* Chat header */}
      {selectedChatId && (
        <div className="flex shrink-0 items-center justify-between border-b border-cream-200 bg-cream-50/90 px-5 py-3 backdrop-blur transition-colors duration-300 dark:border-ink-700 dark:bg-ink-900/90">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white shadow-md shadow-clay-500/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <div>
              <h2 className="max-w-[50vw] truncate text-sm font-bold text-ink-800 transition-colors dark:text-cream-50">
                {chatTitle || "Chat"}
              </h2>
              <p className="flex items-center gap-1.5 text-[11px] text-ink-400 dark:text-cream-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI companion online
              </p>
            </div>
          </div>
          {requestLimit > 0 && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                limitReached
                  ? "border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
                  : "border-clay-300 bg-clay-100 text-clay-700 dark:border-clay-500/30 dark:bg-clay-700/25 dark:text-clay-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  limitReached ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                }`}
              />
              {requestsLeft}/{requestLimit} AI requests left
            </span>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {/* Welcome screen - no chat selected */}
        {!selectedChatId ? (
          <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-[28px] bg-brand-gradient shadow-2xl shadow-clay-500/30 animate-bounce-soft">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3C6.7 3 2.5 6.6 2.5 11c0 2.3 1.1 4.3 2.9 5.7L4.3 20l3.6-1.5c1.3.4 2.7.6 4.1.6 5.3 0 9.5-3.6 9.5-8.1S17.3 3 12 3z"
                  fill="#FCFAF5"
                />
                <circle cx="9" cy="11" r="1.1" fill="#E9884F" />
                <circle cx="12" cy="11" r="1.1" fill="#E9884F" />
                <circle cx="15" cy="11" r="1.1" fill="#E9884F" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink-800 transition-colors dark:text-cream-50">
              Hello, how can I <span className="text-gradient-brand">help?</span>
            </h1>
            <p className="mt-2 max-w-md text-sm text-ink-500 transition-colors dark:text-cream-300">
              Start a conversation or pick a chat from the sidebar. I can
              brainstorm, write, summarize, and much more.
            </p>

            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={onNewChat}
                  className="group cursor-pointer rounded-2xl border border-cream-300 bg-white/80 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-clay-300 hover:shadow-lg hover:shadow-clay-300/20 dark:border-ink-600 dark:bg-ink-800/80 dark:hover:border-clay-500 dark:hover:shadow-black/40"
                >
                  <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-clay-100 text-clay-600 transition-colors group-hover:bg-brand-gradient group-hover:text-white dark:bg-clay-700/30 dark:text-clay-200">
                    {s.icon}
                  </span>
                  <p className="text-sm font-bold text-ink-800 transition-colors dark:text-cream-50">
                    {s.title}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-500 transition-colors dark:text-cream-300">
                    {s.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            {isLoading && (
              <div className="flex items-center gap-3 animate-fade-in">
                {AI_AVATAR}
                <div className="flex-1 space-y-2.5 rounded-2xl border border-cream-200 bg-white p-4 shadow-sm dark:border-ink-700 dark:bg-ink-800">
                  <div className="bg-skeleton animate-shimmer h-3.5 w-3/4 rounded-full" />
                  <div className="bg-skeleton animate-shimmer h-3.5 w-1/2 rounded-full" />
                  <div className="bg-skeleton animate-shimmer h-3.5 w-2/3 rounded-full" />
                </div>
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-200 text-clay-500 transition-colors dark:bg-ink-800 dark:text-clay-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-700 transition-colors dark:text-cream-100">
                    {chatTitle || "This chat is empty"}
                  </p>
                  <p className="mt-1 text-xs text-ink-500 transition-colors dark:text-cream-300">
                    Send a message below to get started with {chatTitle || "your chat"}.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id || msg._id || index}
                  msg={msg}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
            </div>

            {/* Typing indicator */}
            {isTyping && (
              <div className="mt-6 flex w-full items-start gap-3 animate-fade-up">
                {AI_AVATAR}
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-lg border border-cream-200 bg-white px-4 py-3.5 shadow-sm dark:border-ink-700 dark:bg-ink-800">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="ml-1 text-xs font-medium text-ink-400 dark:text-cream-400">
                    Chat-G is thinking…
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-cream-200 bg-cream-50/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-colors duration-300 md:px-6 dark:border-ink-700 dark:bg-ink-900/95 md:py-4">
        <div className="mx-auto w-full max-w-3xl">
          {/* Hint when no chat selected */}
          {!selectedChatId && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-clay-100 px-3.5 py-2 text-xs font-medium text-clay-700 transition-colors dark:bg-clay-700/30 dark:text-clay-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              Select a chat or create a new one to start messaging.
              <button
                onClick={onNewChat}
                className="ml-auto cursor-pointer rounded-lg bg-white px-3 py-1 font-bold text-clay-700 shadow-sm transition-colors hover:bg-clay-50 dark:bg-ink-800 dark:text-clay-200 dark:hover:bg-ink-700"
              >
                New chat
              </button>
            </div>
          )}

          <div
            className={`flex items-end gap-2 rounded-3xl border bg-white p-2 pl-4 shadow-lg transition-all duration-200 dark:bg-ink-800 ${
              selectedChatId
                ? "border-cream-300 shadow-cream-300/40 focus-within:border-clay-400 focus-within:ring-4 focus-within:ring-clay-100 dark:border-ink-600 dark:shadow-black/40 dark:focus-within:border-clay-500 dark:focus-within:ring-clay-600/30"
                : "border-cream-200 opacity-60 dark:border-ink-700"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={!selectedChatId || limitReached}
              placeholder={
                limitReached
                  ? "Daily AI request limit reached — come back tomorrow!"
                  : selectedChatId
                  ? "Message Chat-G…  (Enter to send, Shift+Enter for newline)"
                  : "Select a chat to start typing…"
              }
              className="scrollbar-thin max-h-[140px] min-h-[48px] flex-1 resize-none bg-transparent py-3.5 text-[15px] leading-snug text-ink-800 outline-none placeholder:text-ink-400 transition-colors dark:text-cream-100 dark:placeholder:text-cream-400/60 disabled:cursor-not-allowed"
            />

            <button
              onClick={handleSendMessage}
              disabled={isDisabled || !message.trim()}
              aria-label="Send message"
              className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-clay-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-clay-500/40 hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {isTyping ? (
                <span className="flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                </span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m4 4 16 8-16 8 3-8-3-8z" />
                </svg>
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] text-ink-400 transition-colors dark:text-cream-400/70">
            Chat-G can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
import React, { useMemo, useState } from "react";

const getInitials = (user) => {
  const f = user?.fullName;
  const first = f?.firstName || "";
  const last = f?.lastName || "";
  if (first || last) return (first[0] + last[0]).toUpperCase();
  return (user?.email || "U")[0].toUpperCase();
};

const getFirstName = (user) =>
  user?.fullName?.firstName || user?.email?.split("@")[0] || "User";

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

function Sidebar({
  isOpen,
  onNewChat,
  onLogout,
  chats,
  isLoading,
  onSelectChat,
  selectedChatId,
  user,
}) {
  const [query, setQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!query.trim()) return chats;
    return chats.filter((chat) =>
      (chat.title || "").toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [chats, query]);

  return (
    <aside
      className={`
        absolute md:relative z-20
        top-0 left-0
        h-full
        w-[288px]
        md:w-[300px]
        lg:w-[320px]
        shrink-0
        bg-cream-50
        border-r border-cream-200
        flex flex-col
        transition-all duration-300 ease-out
        dark:bg-ink-900 dark:border-ink-700
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* New Chat */}
      <div className="p-3 pb-2">
        <button
          onClick={onNewChat}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-4 py-3 text-sm font-bold text-white shadow-lg shadow-clay-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-clay-500/35 hover:brightness-105 active:scale-[0.98]"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 dark:text-cream-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats…"
            className="h-10 w-full rounded-xl border border-cream-300 bg-white/80 pl-9 pr-8 text-sm outline-none transition-all duration-200 dark:border-ink-600 dark:bg-ink-800/80 dark:text-cream-100
              placeholder:text-ink-300 dark:placeholder:text-cream-400/50
              focus:border-clay-400 focus:ring-4 focus:ring-clay-100 dark:focus:border-clay-500 dark:focus:ring-clay-600/30"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-0.5 text-ink-400 transition-colors hover:bg-cream-100 hover:text-ink-700 dark:text-cream-400 dark:hover:bg-ink-700 dark:hover:text-cream-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-2">
        <div className="flex items-center justify-between px-2 pb-1.5 pt-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:text-cream-400">
            Recent chats
          </p>
          {chats.length > 0 && (
            <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-ink-700 dark:text-cream-300">
              {filteredChats.length}
            </span>
          )}
        </div>

        <div className="space-y-1">
          {isLoading ? (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                  <div className="bg-skeleton animate-shimmer h-8 w-8 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-skeleton animate-shimmer h-3 w-3/4 rounded-full" />
                    <div className="bg-skeleton animate-shimmer h-2.5 w-1/2 rounded-full" />
                  </div>
                </div>
              ))}
            </>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream-200 text-ink-400 dark:bg-ink-800 dark:text-cream-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              </span>
              <p className="text-sm font-medium text-ink-500 dark:text-cream-300">
                {query ? "No chats found" : "No chats yet"}
              </p>
              <p className="text-xs text-ink-400 dark:text-cream-400">
                {query ? "Try a different keyword" : "Start your first conversation"}
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const active = chat._id === selectedChatId;
              return (
                <button
                  key={chat._id}
                  onClick={() => onSelectChat(chat._id)}
                  className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                    active
                      ? "bg-brand-gradient-soft ring-1 ring-clay-200 dark:bg-clay-600/15 dark:ring-clay-600/40"
                      : "hover:bg-cream-200 dark:hover:bg-ink-800"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                      active
                        ? "bg-brand-gradient text-white shadow-md shadow-clay-500/25"
                        : "bg-cream-200 text-ink-500 group-hover:bg-cream-300 dark:bg-ink-800 dark:text-cream-300 dark:group-hover:bg-ink-700"
                    }`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm font-semibold ${
                        active
                          ? "text-clay-700 dark:text-clay-300"
                          : "text-ink-700 dark:text-cream-100"
                      }`}
                    >
                      {chat.title}
                    </span>
                    <span className="block text-[11px] text-ink-400 dark:text-cream-400">
                      {timeAgo(chat.lastActivity || chat.updatedAt)}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* User / logout */}
      <div className="border-t border-cream-200 p-3 dark:border-ink-700">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-2.5 ring-1 ring-cream-200 dark:bg-ink-800/80 dark:ring-ink-700">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-xs font-bold text-white shadow-md shadow-clay-500/25">
            {getInitials(user)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-800 dark:text-cream-50">
              {getFirstName(user)}
            </p>
            <p className="truncate text-[11px] text-ink-400 dark:text-cream-400">
              {user?.email}
            </p>
          </div>
          <button
            onClick={onLogout}
            aria-label="Log out"
            title="Log out"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-ink-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-cream-400 dark:hover:bg-red-500/10 dark:hover:text-red-500"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
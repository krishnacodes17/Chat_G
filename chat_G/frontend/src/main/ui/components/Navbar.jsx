import React, { useEffect, useRef, useState } from "react";
import ThemeToggle from "../../../shared/ui/ThemeToggle";

const getInitials = (user) => {
  const f = user?.fullName;
  const first = f?.firstName || "";
  const last = f?.lastName || "";
  if (first || last) return (first[0] + last[0]).toUpperCase();
  return (user?.email || "U")[0].toUpperCase();
};

const getFirstName = (user) => user?.fullName?.firstName || user?.email?.split("@")[0] || "User";

function Navbar({ onMenuClick, user, onLogout, onShowProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleShowProfile = () => {
    setMenuOpen(false);
    onShowProfile?.();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-cream-200 bg-cream-50/90 px-3 backdrop-blur-md transition-colors duration-300 dark:border-ink-700 dark:bg-ink-900/90 sm:px-5">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-ink-600 transition-colors hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-ink-700 md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-md shadow-clay-500/25">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C6.7 3 2.5 6.6 2.5 11c0 2.3 1.1 4.3 2.9 5.7L4.3 20l3.6-1.5c1.3.4 2.7.6 4.1.6 5.3 0 9.5-3.6 9.5-8.1S17.3 3 12 3z"
                fill="#FCFAF5"
              />
              <circle cx="9" cy="11" r="1.1" fill="#E9884F" />
              <circle cx="12" cy="11" r="1.1" fill="#E9884F" />
              <circle cx="15" cy="11" r="1.1" fill="#E9884F" />
            </svg>
          </span>
          <h1 className="font-display text-lg font-bold text-ink-800 transition-colors dark:text-cream-50">
            Chat<span className="text-gradient-brand">-G</span>
          </h1>
        </div>
      </div>

      {/* Center search hint (desktop) */}
      <div className="hidden items-center gap-2 rounded-xl border border-cream-300 bg-white/70 px-3.5 py-2 text-sm text-ink-400 transition-colors dark:border-ink-600 dark:bg-ink-800/70 dark:text-cream-400 md:flex">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        Search your conversations
        <kbd className="ml-4 rounded-md border border-cream-300 bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 dark:border-ink-600 dark:bg-ink-700 dark:text-cream-300">
          ⌘K
        </kbd>
      </div>

      {/* Right : theme toggle + profile */}
      <div className="flex items-center gap-1.5">
        <ThemeToggle />

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Account menu"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-cream-200 dark:hover:bg-ink-700"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-xs font-bold text-white shadow-md shadow-clay-500/25">
              {getInitials(user)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-bold leading-tight text-ink-800 dark:text-cream-50">
                {getFirstName(user)}
              </span>
              <span className="block text-[11px] leading-tight text-ink-400 dark:text-cream-400">
                {user?.email || "Signed in"}
              </span>
            </span>
            <svg
              className={`h-4 w-4 text-ink-400 transition-transform duration-200 dark:text-cream-400 ${menuOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-xl shadow-ink-900/10 animate-scale-in dark:border-ink-700 dark:bg-ink-800 dark:shadow-black/50">
              <div className="border-b border-cream-200 bg-cream-50 px-4 py-3 dark:border-ink-700 dark:bg-ink-900">
                <p className="text-sm font-bold text-ink-800 dark:text-cream-50">
                  {user?.fullName?.firstName || getFirstName(user)}{" "}
                  {user?.fullName?.lastName || ""}
                </p>
                <p className="truncate text-xs text-ink-400 dark:text-cream-400">{user?.email}</p>
              </div>
              <div className="p-1.5">
<button
                onClick={handleShowProfile}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-cream-100 hover:text-ink-800 dark:text-cream-200 dark:hover:bg-ink-700 dark:hover:text-cream-50"
              >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
                  </svg>
                  My profile
                </button>
                <button
                  onClick={onLogout}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
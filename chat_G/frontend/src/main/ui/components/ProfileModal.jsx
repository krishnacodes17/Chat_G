import React, { useEffect } from "react";
import useProfile from "../../hooks/profileHook";

const getInitials = (fullName) => {
  const first = fullName?.firstName || "";
  const last = fullName?.lastName || "";
  if (first || last) return (first[0] + last[0]).toUpperCase();
  return "U";
};

const getFullName = (fullName, email) => {
  if (fullName?.firstName || fullName?.lastName) {
    return `${fullName.firstName || ""} ${fullName.lastName || ""}`.trim();
  }
  return email?.split("@")[0] || "User";
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function ProfileModal({ isOpen, onClose }) {
  const { data, isLoading } = useProfile(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const profile = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 px-4 backdrop-blur-sm animate-fade-in dark:bg-black/60">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink-900/30 animate-scale-in dark:bg-ink-800 dark:shadow-black/50">
        {/* Highlight strip */}
        <div className="h-1.5 w-full bg-brand-gradient" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <p className="font-display text-base font-bold text-ink-800 dark:text-cream-50">
            My profile
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-ink-400 transition-colors hover:bg-cream-100 hover:text-ink-700 dark:text-cream-400 dark:hover:bg-ink-700 dark:hover:text-cream-100"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-14">
            <svg className="h-8 w-8 animate-spin text-clay-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
            <p className="text-sm font-medium text-ink-400 dark:text-cream-400">
              Loading your profile…
            </p>
          </div>
        ) : profile ? (
          <div className="px-6 pb-6">
            {/* Avatar + names */}
            <div className="flex flex-col items-center text-center">
              <span className="grid h-20 w-20 place-items-center rounded-[24px] bg-brand-gradient text-2xl font-bold text-white shadow-xl shadow-clay-500/30">
                {getInitials(profile.fullName)}
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-ink-800 dark:text-cream-50">
                {getFullName(profile.fullName, profile.email)}
              </h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-cream-300">
                {profile.email}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-clay-100 px-3 py-1 text-xs font-semibold text-clay-700 dark:bg-clay-700/30 dark:text-clay-200">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l2.5 2.5" />
                </svg>
                Member since {formatDate(profile.joinedAt)}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 transition-colors dark:border-ink-600 dark:bg-ink-700">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-md shadow-clay-500/25">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCFAF5" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <p className="mt-3 text-2xl font-bold text-ink-800 dark:text-cream-50">
                  {profile.stats?.totalChats ?? 0}
                </p>
                <p className="text-xs font-medium text-ink-500 dark:text-cream-400">
                  Total chats
                </p>
              </div>

              <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 transition-colors dark:border-ink-600 dark:bg-ink-700">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-md shadow-clay-500/25">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCFAF5" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                </span>
                <p className="mt-3 text-2xl font-bold text-ink-800 dark:text-cream-50">
                  {profile.stats?.totalMessages ?? 0}
                </p>
                <p className="text-xs font-medium text-ink-500 dark:text-cream-400">
                  Total messages
                </p>
              </div>
            </div>

            {/* Daily AI request limit */}
            {(profile.dailyRequestLimit || 0) > 0 && (
              <div className="mt-3 rounded-2xl border border-cream-200 bg-cream-50 p-4 transition-colors dark:border-ink-600 dark:bg-ink-700">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-ink-500 dark:text-cream-400">
                    AI requests today
                  </p>
                  <p className="text-xs font-bold text-ink-800 dark:text-cream-50">
                    {profile.stats?.requestsRemaining ?? profile.dailyRequestLimit}/
                    {profile.dailyRequestLimit} left
                  </p>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cream-200 transition-colors dark:bg-ink-600">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      profile.stats?.requestsRemaining === 0
                        ? "bg-red-500"
                        : "bg-brand-gradient"
                    }`}
                    style={{
                      width: `${
                        profile.dailyRequestLimit > 0
                          ? Math.round(
                              ((profile.dailyRequestLimit -
                                (profile.stats?.requestsRemaining ?? profile.dailyRequestLimit)) /
                                profile.dailyRequestLimit) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-ink-400 dark:text-cream-400/70">
                  Limit resets automatically every day.
                </p>
              </div>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-bold text-white shadow-lg shadow-clay-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-clay-500/35 hover:brightness-105 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </span>
            <p className="text-sm font-bold text-ink-800 dark:text-cream-50">
              Couldn't load profile
            </p>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-cream-100 dark:border-ink-600 dark:text-cream-200 dark:hover:bg-ink-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
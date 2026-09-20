import React, { useEffect } from "react";
import useNewChatModal from "../../hooks/newChatModelHook";

function NewChatModal({ isOpen, onClose, onCreate }) {
  const { register, handleSubmit, errors, submitHandler } = useNewChatModal(
    onCreate,
    onClose
  );

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 px-4 backdrop-blur-sm animate-fade-in dark:bg-black/60">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink-900/30 animate-scale-in dark:bg-ink-800 dark:shadow-black/50">
        {/* Highlight strip */}
        <div className="h-1.5 w-full bg-brand-gradient" />

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient-soft ring-1 ring-clay-200 dark:bg-clay-700/30 dark:ring-clay-600/40">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C25128" strokeWidth="2" className="dark:stroke-clay-200">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-ink-800 dark:text-cream-50">
                  Create new chat
                </h2>
                <p className="mt-0.5 text-sm text-ink-500 dark:text-cream-300">
                  Give this conversation a name.
                </p>
              </div>
            </div>
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

          {/* Form */}
          <form onSubmit={handleSubmit(submitHandler)}>
            <label className="mb-2 block text-sm font-semibold text-ink-700 dark:text-cream-100">
              Chat title
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly planning, Travel ideas…"
              autoFocus
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters",
                },
              })}
              className={`h-12 w-full rounded-2xl border bg-cream-50 px-4 text-sm outline-none transition-all duration-200 dark:bg-ink-700 dark:text-cream-100
                placeholder:text-ink-300 dark:placeholder:text-cream-400/50
                focus:border-clay-400 focus:bg-white focus:ring-4 focus:ring-clay-100 dark:focus:border-clay-500 dark:focus:bg-ink-700 dark:focus:ring-clay-600/30
                ${errors.title ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-500/20" : "border-cream-300 dark:border-ink-600"}`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.title.message}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-2xl border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-cream-100 dark:border-ink-600 dark:text-cream-200 dark:hover:bg-ink-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-gradient px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-clay-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-clay-500/35 hover:brightness-105 active:scale-[0.98]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewChatModal;
import React from "react";

function ImageContainer() {
  return (
    <div className="hidden lg:flex w-full justify-center items-center">
      <div className="relative w-full max-w-[460px]">
        {/* Glow behind card */}
        <div
          aria-hidden
          className="absolute -inset-6 rounded-[56px] bg-brand-gradient opacity-20 blur-3xl"
        />

        {/* Main card */}
        <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-gradient-to-b from-white to-cream-100 shadow-2xl shadow-clay-300/30 transition-colors duration-300 dark:border-ink-700 dark:from-ink-800 dark:to-ink-900 dark:shadow-black/50">
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-clay-200/50 blur-3xl dark:bg-clay-600/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl dark:bg-clay-700/15"
          />

          {/* Header chip */}
          <div className="relative flex items-center justify-between px-7 pt-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-cream-100 dark:bg-ink-950">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.2 5.6 5.8.5-4.4 3.9 1.3 5.7-4.9-3.1-4.9 3.1 1.3-5.7L4 8.1l5.8-.5L12 2z"
                  fill="#EE9A5A"
                />
              </svg>
              AI-powered
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink-600 shadow-sm backdrop-blur dark:bg-ink-800/70 dark:text-cream-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online now
            </span>
          </div>

          {/* Illustration */}
          <div className="relative flex items-center justify-center pt-2 pb-5">
            <img
              src="/Login.svg"
              alt="Chat-G illustration"
              loading="lazy"
              decoding="async"
              className="w-[88%] h-auto object-contain drop-shadow-sm animate-float"
            />
          </div>
        </div>

        {/* Floating chat preview card */}
        <div className="absolute -left-10 top-24 w-44 rounded-2xl border border-white/80 bg-white/85 p-3.5 shadow-xl shadow-clay-400/15 backdrop-blur-md animate-float dark:border-ink-600 dark:bg-ink-800/85 dark:shadow-black/40">
          <p className="text-[11px] font-bold text-ink-800 dark:text-cream-100">
            Weekly planning ✨
          </p>
          <p className="mt-1 text-[11px] leading-snug text-ink-500 dark:text-cream-300">
            Got it — here's your Monday schedule drafted.
          </p>
          <div className="mt-2.5 flex items-center gap-1">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>

        {/* Floating stat card */}
        <div className="absolute -right-8 bottom-16 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-xl shadow-clay-400/15 backdrop-blur-md animate-float dark:border-ink-600 dark:bg-ink-800/85 dark:shadow-black/40">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-md shadow-clay-500/30">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FCFAF5" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold leading-none text-ink-800 dark:text-cream-100">
              Instant
            </p>
            <p className="mt-0.5 text-[11px] text-ink-500 dark:text-cream-300">
              responses, 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageContainer;
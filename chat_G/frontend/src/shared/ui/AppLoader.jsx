import React from "react";
import BrandLogo from "../../auth/ui/components/BrandLogo";

function AppLoader({ label = "Loading your workspace…" }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-cream-50 dark:bg-ink-900">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-clay-200/40 blur-3xl dark:bg-clay-600/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-clay-700/15"
      />

      <div className="animate-bounce-soft">
        <BrandLogo size="lg" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <p className="animate-pulse text-sm font-medium text-ink-400 dark:text-cream-400">
        {label}
      </p>
    </div>
  );
}

export default AppLoader;
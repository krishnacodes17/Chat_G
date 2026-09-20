import React from "react";
import { Link } from "react-router-dom";

function BrandLogo({ size = "md" }) {
  const box = size === "lg" ? "h-12 w-12 rounded-2xl" : "h-11 w-11 rounded-2xl";
  const text = size === "lg" ? "text-2xl" : "text-[22px]";

  return (
    <Link to="/" className="inline-flex items-center gap-2.5">
      <span
        className={`grid ${box} place-items-center bg-brand-gradient shadow-lg shadow-clay-500/25`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C6.7 3 2.5 6.6 2.5 11c0 2.3 1.1 4.3 2.9 5.7L4.3 20l3.6-1.5c1.3.4 2.7.6 4.1.6 5.3 0 9.5-3.6 9.5-8.1S17.3 3 12 3z"
            fill="#FCFAF5"
          />
          <circle cx="9" cy="11" r="1.1" fill="#E9884F" />
          <circle cx="12" cy="11" r="1.1" fill="#E9884F" />
          <circle cx="15" cy="11" r="1.1" fill="#E9884F" />
        </svg>
      </span>
      <span className={`font-display ${text} font-bold text-ink-800 dark:text-cream-50`}>
        Chat<span className="text-gradient-brand">-G</span>
      </span>
    </Link>
  );
}

export default BrandLogo;
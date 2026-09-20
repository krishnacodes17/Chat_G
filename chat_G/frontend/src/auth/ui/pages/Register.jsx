import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageContainer from "../components/ImageContainer";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../../../shared/ui/ThemeToggle";
import { AuthHook } from "../../hooks/authHook";

const Register = () => {
  const { register, handleSubmit, errors, onRegisterSubmit, registerPending } =
    AuthHook();

  const [showPassword, setShowPassword] = useState(false);

  const fieldClasses = (hasError) =>
    `h-12 w-full rounded-2xl border bg-white/80 px-4 text-sm outline-none transition-all duration-200 dark:bg-ink-800/80 dark:text-cream-100
      placeholder:text-ink-300 dark:placeholder:text-cream-400/50
      focus:border-clay-400 focus:ring-4 focus:ring-clay-100 dark:focus:border-clay-500 dark:focus:ring-clay-600/30
      ${
        hasError
          ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-500/20"
          : "border-cream-300 dark:border-ink-600"
      }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream-50 flex items-center justify-center px-5 py-10 dark:bg-ink-900">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-clay-200/40 blur-3xl animate-blob dark:bg-clay-600/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[480px] w-[480px] rounded-full bg-amber-200/30 blur-3xl animate-blob-slow dark:bg-clay-700/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-[15%] h-64 w-64 rounded-full bg-clay-100/60 blur-3xl animate-float dark:bg-clay-800/10"
      />

      {/* Theme toggle */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle className="bg-white/70 backdrop-blur dark:bg-ink-800/70" />
      </div>

      <div className="relative w-full max-w-6xl animate-fade-up">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
          {/* ================= LEFT : REGISTER FORM ================= */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Brand */}
            <div className="mb-9">
              <BrandLogo />
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-clay-100 px-3 py-1 text-xs font-semibold text-clay-700 dark:bg-clay-700/30 dark:text-clay-200">
                <span className="h-1.5 w-1.5 rounded-full bg-clay-500" />
                Get started
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-800 dark:text-cream-50">
                Create your account
              </h1>
              <p className="mt-2.5 text-sm text-ink-500 dark:text-cream-300">
                Start chatting with your AI companion in less than a minute.
              </p>
            </div>

            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-5">
              {/* ================= FIRST NAME + LAST NAME ================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-ink-700 dark:text-cream-100"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Alex"
                    {...register("fullName.firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters",
                      },
                    })}
                    className={fieldClasses(!!errors.fullName?.firstName)}
                  />
                  {errors.fullName?.firstName && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.fullName.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-ink-700 dark:text-cream-100"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Johnson"
                    {...register("fullName.lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters",
                      },
                    })}
                    className={fieldClasses(!!errors.fullName?.lastName)}
                  />
                  {errors.fullName?.lastName && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.fullName.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ================= EMAIL ================= */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-ink-700 dark:text-cream-100"
                >
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-cream-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={`${fieldClasses(!!errors.email)} pl-11`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* ================= PASSWORD ================= */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-ink-700 dark:text-cream-100"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-cream-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="4" y="10" width="16" height="10" rx="3" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 5 characters)"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 5,
                        message: "Password must be at least 5 characters",
                      },
                    })}
                    className={`${fieldClasses(!!errors.password)} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-cream-100 hover:text-ink-700 dark:text-cream-400 dark:hover:bg-ink-700 dark:hover:text-cream-100"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4 10 6-1.1 1.5-2.6 3-4.5 4.2M14.6 17.8A9.6 9.6 0 0 1 12 19c-5 0-8.5-4-10-6 1.1-1.5 2.7-3.2 4.8-4.4" />
                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* ================= REGISTER BUTTON ================= */}
              <button
                type="submit"
                disabled={registerPending}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-gradient text-sm font-bold text-white shadow-lg shadow-clay-500/30 transition-all duration-200
                  hover:shadow-xl hover:shadow-clay-500/40 hover:brightness-105
                  active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {registerPending ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* ================= LOGIN LINK ================= */}
            <p className="mt-7 text-center text-sm text-ink-500 dark:text-cream-300">
              Already have an account?{" "}
              <Link
                to={"/"}
                className="font-bold text-clay-600 transition-colors hover:text-clay-700 dark:text-clay-300 dark:hover:text-clay-200"
              >
                Login instead
              </Link>
            </p>
          </div>

          {/* ================= RIGHT : SHOWCASE ================= */}
          <ImageContainer />
        </div>
      </div>
    </div>
  );
};

export default Register;
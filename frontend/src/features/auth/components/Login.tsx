"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}
        <div className="relative overflow-hidden bg-[#F5F7FF] lg:flex">
          {/* Decorative background */}
          <div className="absolute -left-32 -top-32 h-100 w-[400px] rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-100 w-[400px] rounded-full bg-violet-100/60 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5">
                  <path
                    d="M9 21V13.5L16 9l7 4.5V21"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 15.5L19.2 12.8"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="12" r="1.4" fill="white" />
                </svg>
              </div>

              <span className="text-xl font-semibold tracking-tight text-slate-900">
                CareerAI
              </span>
            </div>

            {/* Main visual */}
            <div className="mx-auto w-full max-w-xl">
              <div className="mb-10">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                  Your career, powered by AI
                </p>

                <h2 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-slate-900 xl:text-5xl">
                  Turn your target job into a
                  <span className="text-indigo-600"> personalized plan.</span>
                </h2>

                <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
                  Analyze your resume, discover skill gaps, and prepare smarter
                  for the opportunities you want.
                </p>
              </div>

              {/* AI Analysis Card */}
              <div className="relative">
                {/* Floating small card */}
                <div className="absolute -right-4 -top-7 z-10 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <svg
                        className="h-4 w-4 text-emerald-600"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12.5L9.5 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Skill match
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Strong match
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main dashboard illustration */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        AI Career Analysis
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        Frontend Developer
                      </p>
                    </div>

                    <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                      AI Analysis
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          React.js
                        </span>
                        <span className="text-xs text-emerald-600">
                          Matched
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[92%] rounded-full bg-indigo-600" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          TypeScript
                        </span>
                        <span className="text-xs text-amber-600">Improve</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[64%] rounded-full bg-indigo-400" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          System Design
                        </span>
                        <span className="text-xs text-rose-500">Skill gap</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[35%] rounded-full bg-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Preparation plan */}
                  <div className="mt-6 rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                        <svg
                          className="h-3.5 w-3.5 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 3v18M3 12h18"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <span className="text-xs font-semibold text-slate-700">
                        Personalized preparation plan
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-[10px] text-slate-400">Technical</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          12 tasks
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-[10px] text-slate-400">Interview</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          8 tasks
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-[10px] text-slate-400">Domain</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          6 tasks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <p className="text-xs text-slate-400">
              AI-powered career preparation
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="mb-12 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5">
                  <path
                    d="M9 21V13.5L16 9l7 4.5V21"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 15.5L19.2 12.8"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="12" r="1.4" fill="white" />
                </svg>
              </div>

              <span className="text-xl font-semibold text-slate-900">
                CareerAI
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Continue your journey toward your next opportunity.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign in */}
              <button
                type="button"
                className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
              >
                Sign in
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-400">
                    OR
                  </span>
                </div>
              </div>
            </div>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../apis/auth.api";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registrationSchema = z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),

    email: z.string().trim().email("Enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword,
  {
    message: "Password do not match",
    path: ["confirmPassword"]
  }
);

  type RegistrationValues = z.infer<typeof registrationSchema>;

  const {register, handleSubmit, reset} = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

const { mutate: registerUser, isPending } = useMutation({
  mutationFn: authApi.registerUser,

  onSuccess: (response) => {
    router.push("/");
    reset();
  },

  onError: (error) => {
    console.error("Registration failed:", error);
  },
});

  const onSubmit = (data: RegistrationValues) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="relative hidden overflow-hidden bg-[#F5F7FF] lg:flex">
          {/* Decorative background */}
          <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-violet-100/60 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="h-5 w-5"
                >
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
                  <circle
                    cx="20"
                    cy="12"
                    r="1.4"
                    fill="white"
                  />
                </svg>
              </div>

              <span className="text-xl font-semibold tracking-tight text-slate-900">
                CareerAI
              </span>
            </div>

            {/* Main Content */}
            <div className="mx-auto w-full max-w-xl">

              <div className="mb-10">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                  Start your career journey
                </p>

                <h2 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-slate-900 xl:text-5xl">
                  Build your career with
                  <span className="text-indigo-600"> AI.</span>
                </h2>

                <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
                  Upload your resume, choose your target role, and let
                  CareerAI create a personalized preparation plan for you.
                </p>
              </div>

              {/* CareerAI Analysis Card */}
              <div className="relative">

                {/* Floating Card */}
                <div className="absolute -right-4 -top-7 z-10 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                      <svg
                        className="h-4 w-4 text-indigo-600"
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

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        AI preparation
                      </p>

                      <p className="text-sm font-semibold text-slate-900">
                        Personalized plan
                      </p>
                    </div>

                  </div>
                </div>

                {/* Main Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                    <div>
                      <p className="text-xs text-slate-400">
                        Target role
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        Frontend Developer
                      </p>
                    </div>

                    <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                      CareerAI
                    </div>

                  </div>

                  {/* Resume */}
                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M14 2v6h6M8 13h8M8 17h5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700">
                          Resume.pdf
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Resume uploaded successfully
                        </p>
                      </div>

                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                        <svg
                          className="h-3.5 w-3.5 text-emerald-600"
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

                    </div>

                  </div>

                  {/* AI Steps */}
                  <div className="mt-4 space-y-3">

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                        <span className="text-xs font-semibold text-indigo-600">
                          01
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Analyze your skills
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Compare your resume with the target role
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                        <span className="text-xs font-semibold text-indigo-600">
                          02
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Find skill gaps
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Identify what you need to improve
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                        <span className="text-xs font-semibold text-indigo-600">
                          03
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-indigo-700">
                          Create your plan
                        </p>

                        <p className="text-[11px] text-indigo-500">
                          Get a personalized preparation roadmap
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* Bottom */}
            <p className="text-xs text-slate-400">
              AI-powered career preparation
            </p>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">

          <div className="w-full max-w-105">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-2 lg:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="h-5 w-5"
                >
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

                  <circle
                    cx="20"
                    cy="12"
                    r="1.4"
                    fill="white"
                  />
                </svg>
              </div>

              <span className="text-xl font-semibold text-slate-900">
                CareerAI
              </span>

            </div>

            {/* Heading */}
            <div className="mb-7">

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Build your career with AI
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your account and start preparing for your next opportunity.
              </p>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>

                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="Enter your full name"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  {...register("email")}
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
                    placeholder="Create a password"
                    {...register("password")}
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

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm password
                </label>

                <div className="relative">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>
              </div>

              {/* Terms */}
              <div className="pt-1">

                <label className="flex cursor-pointer items-start gap-2">

                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    By creating an account, you agree to our{" "}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>

                </label>

              </div>

              {/* Create Account */}
              <button
                type="submit"
                className="mt-1 h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
              >
                Create account
              </button>

              {/* Divider */}
              <div className="relative py-2">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>

              </div>

            </form>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
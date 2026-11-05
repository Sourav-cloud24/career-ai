
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  BriefcaseBusiness,
  BrainCircuit,
  CheckCircle2,
  Plus,
  ArrowRight,
  Upload,
  Search,
  RefreshCw,
  Clock,
  Building2,
  CalendarDays,
  Sparkles,
  FileSearch,
} from "lucide-react";

import { getDashboardOverview } from "../api/dashboard.api";
import type { RecentAnalysis } from "../types/dashboard.types";

// Format date for dashboard display
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

// Statistics card
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBackground: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBackground,
}: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">{description}</p>
    </div>
  );
};

// Quick action card
const QuickActionCard = ({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
    </Link>
  );
};

// Analysis status badge
const AnalysisStatus = ({ status }: { status: string }) => {
  const completed = status.toLowerCase() === "completed";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        completed
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Clock className="h-3.5 w-3.5" />
      )}
      {status}
    </span>
  );
};

// Recent analysis card
const RecentAnalysisCard = ({
  analysis,
}: {
  analysis: RecentAnalysis;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h4 className="truncate font-semibold text-gray-900">
            {analysis.job_title || "Untitled position"}
          </h4>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {analysis.company_name || "Company not specified"}
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(analysis.created_at)}
            </span>
          </div>

          <p className="mt-2 truncate text-xs text-gray-400">
            Resume: {analysis.resume_name || "Resume unavailable"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
        <AnalysisStatus status={analysis.status} />

        <Link
          href={`/analysis/${analysis.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View analysis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const DashboardContainer = () => {
  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  // Error state
  if (isError || !dashboard) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <RefreshCw className="h-7 w-7" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Unable to load dashboard
        </h2>

        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Something went wrong while fetching your dashboard information.
          Please try again.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const { stats, recentAnalyses, latestAnalysis } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Welcome section */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Sparkles className="h-4 w-4" />
              CareerAI Dashboard
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome back!
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Track your career progress and prepare for your next opportunity.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A snapshot of your career preparation activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Resumes"
              value={stats.totalResumes}
              description="Resumes uploaded to your account"
              icon={FileText}
              iconColor="text-blue-600"
              iconBackground="bg-blue-50"
            />

            <StatCard
              title="Job Descriptions"
              value={stats.totalJobDescriptions}
              description="Target opportunities added"
              icon={BriefcaseBusiness}
              iconColor="text-purple-600"
              iconBackground="bg-purple-50"
            />

            <StatCard
              title="Total Analyses"
              value={stats.totalAnalyses}
              description="Resume and job match analyses"
              icon={BrainCircuit}
              iconColor="text-orange-600"
              iconBackground="bg-orange-50"
            />

            <StatCard
              title="Completed Analyses"
              value={stats.completedAnalyses}
              description="Successfully completed analyses"
              icon={CheckCircle2}
              iconColor="text-green-600"
              iconBackground="bg-green-50"
            />
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Continue working towards your career goals.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <QuickActionCard
              title="Upload Resume"
              description="Add a new resume to your profile"
              href="/resumes"
              icon={Upload}
            />

            <QuickActionCard
              title="Add Job Description"
              description="Choose a role you want to target"
              href="/job-descriptions"
              icon={Plus}
            />

            <QuickActionCard
              title="Start New Analysis"
              description="Compare your resume with a job"
              href="/analysis/new"
              icon={Search}
            />
          </div>
        </section>

        {/* Recent analyses and latest analysis */}
        <section className="grid gap-6 xl:grid-cols-3">

          {/* Recent analyses */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Analyses
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your latest resume and job comparisons.
                </p>
              </div>

              <Link
                href="/analysis"
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {recentAnalyses.length > 0 ? (
                recentAnalyses.map((analysis) => (
                  <RecentAnalysisCard
                    key={analysis.id}
                    analysis={analysis}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-12 text-center">
                  <div className="rounded-full bg-indigo-50 p-4 text-indigo-600">
                    <FileSearch className="h-7 w-7" />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No analyses yet
                  </h3>

                  <p className="mt-2 max-w-xs text-sm text-gray-500">
                    Upload your resume and add a job description to get your
                    first AI-powered analysis.
                  </p>

                  <Link
                    href="/analysis"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Start analysis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Latest analysis */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Latest Analysis
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your most recent completed analysis.
              </p>
            </div>

            {latestAnalysis ? (
              <div className="mt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <BrainCircuit className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {latestAnalysis.job_title || "Untitled position"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {latestAnalysis.company_name || "Company not specified"}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(latestAnalysis.created_at)}
                </div>

                {latestAnalysis.summary && (
                  <div className="mt-5 rounded-xl bg-indigo-50/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      AI Summary
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {latestAnalysis.summary}
                    </p>
                  </div>
                )}

                <Link
                  href={`/analysis/${latestAnalysis.id}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  View Full Analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 text-gray-500">
                  <BrainCircuit className="h-7 w-7" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No completed analysis
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Your latest completed analysis will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Preparation plan CTA */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-indigo-100">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Keep moving forward
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                Turn your skill gaps into career opportunities.
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Review your AI analysis, understand what you need to improve,
                and follow a preparation plan to become job-ready.
              </p>
            </div>

            <Link
              href={
                latestAnalysis
                  ? `/analysis/${latestAnalysis.id}`
                  : "/analysis"
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:self-center"
            >
              {latestAnalysis ? "Continue Preparation" : "Start Now"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardContainer;

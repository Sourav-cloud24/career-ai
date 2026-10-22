"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  History,
  Search,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "../apis/analysis.api";
import { useRouter } from "next/navigation";

type AnalysisStatus = "pending" | "running" | "completed" | "failed";

const statusStyles: Record<AnalysisStatus, string> = {
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  running: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

const AnalysisHistroy = () => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["analysis-history"],
    queryFn: analysisApi.getAllAnalysis,
  });

  const mockAnalyses = data?.data || []

  const filteredAnalyses = mockAnalyses.filter((analysis) => {
    const searchableText = [
      analysis.resume_name,
      analysis.job_title,
      analysis.company_name ?? "",
      analysis.summary,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <section className="space-y-5">
      {/* Section heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <History className="size-5" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight">
              Analysis History
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Review your previous resume and job description analyses.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
          <Sparkles className="size-4 text-primary" />
          <span className="font-medium">{filteredAnalyses.length}</span>
          <span className="text-muted-foreground">
            {filteredAnalyses.length === 1 ? "analysis" : "analyses"}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by job title, company, or resume..."
          aria-label="Search analysis history"
          className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Analysis list */}
      {filteredAnalyses.length > 0 ? (
        <div className="flex w-full flex-wrap gap-4">
          {filteredAnalyses.map((analysis) => {
            const isExpanded = expandedId === analysis.id;

            return (
              <article
                key={analysis.id}
                className="w-full min-w-0 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/30 sm:w-[calc(50%-0.5rem)] sm:p-5"
              >
                {/* Card header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
                      <BriefcaseBusiness className="size-5 text-primary" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h3 className="font-semibold leading-snug">
                        {analysis.job_title}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {analysis.company_name || "Company not specified"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[analysis.status]}`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {analysis.status}
                  </span>
                </div>

                {/* Resume and date */}
                <div className="mt-4 grid gap-3 rounded-xl bg-muted/30 p-3 sm:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Resume</p>
                      <p className="truncate text-sm font-medium">
                        {analysis.resume_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Created on
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(analysis.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">AI Summary</p>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {isExpanded
                      ? analysis.summary
                      : `${analysis.summary.slice(0, 190)}${analysis.summary.length > 190 ? "..." : ""}`}
                  </p>

                  {analysis.summary.length > 190 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : analysis.id)
                      }
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="size-4" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="size-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Footer actions */}
                <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {analysis.completed_at
                      ? `Completed ${formatDate(analysis.completed_at)}`
                      : "Awaiting completion"}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/analysis/${analysis.id}`,
                      )
                    }
                    disabled={analysis.status !== "completed"}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    View result
                    <Sparkles className="size-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <History className="size-6 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-semibold">
            {search ? "No matching analyses" : "No analysis history yet"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search
              ? "Try a different search term."
              : "Your completed resume analyses will appear here after you run your first analysis."}
          </p>
        </div>
      )}
    </section>
  );
};

export default AnalysisHistroy;

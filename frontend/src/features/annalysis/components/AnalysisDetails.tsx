"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Lightbulb,
  LoaderCircle,
  Target,
  XCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { analysisApi } from "../apis/analysis.api";
import type {
  AnalysisDetailResponse,
  AnalysisMissingSkill,
  AnalysisPartialSkill,
  AnalysisSkillEvidence,
} from "../types/analysis.type";
import { useRouter } from "next/navigation";

type AnalysisDetailProps = {
  analysisId: string;
  onBack?: () => void;
};

const importanceStyles = {
  high: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  medium:
    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  low: "border-muted bg-muted text-muted-foreground",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

function SkillEvidenceCard({ item }: { item: AnalysisSkillEvidence }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
        <div className="min-w-0 space-y-2">
          <h4 className="text-sm font-semibold">{item.skill}</h4>
          <p className="text-sm leading-6 text-muted-foreground">
            {item.evidence}
          </p>
        </div>
      </div>
    </div>
  );
}

function PartialSkillCard({ item }: { item: AnalysisPartialSkill }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
        <div className="min-w-0 space-y-2">
          <h4 className="text-sm font-semibold">{item.skill}</h4>
          <p className="text-sm leading-6 text-muted-foreground">
            {item.reason}
          </p>
        </div>
      </div>
    </div>
  );
}

function MissingSkillCard({ item }: { item: AnalysisMissingSkill }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
          <div className="min-w-0 space-y-2">
            <h4 className="text-sm font-semibold">{item.skill}</h4>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.reason}
            </p>
          </div>
        </div>

        <span
          className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${importanceStyles[item.importance]}`}
        >
          {item.importance} priority
        </span>
      </div>
    </div>
  );
}

const AnalysisDetails = ({ analysisId, onBack }: AnalysisDetailProps) => {
  const {
    data: response,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<AnalysisDetailResponse>({
    queryKey: ["analysis", analysisId],
    queryFn: () => analysisApi.getAllAnalysisById(Number(analysisId)),
    enabled: Boolean(analysisId),
    retry: 1,
  });

  const router = useRouter()

  if (isPending) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your analysis...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
        <AlertCircle className="size-10 text-destructive" />
        <h2 className="mt-4 font-semibold">Unable to load analysis</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Something went wrong while fetching the analysis."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  const analysis = response?.data;

  if (!analysis) {
    return (
      <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
        Analysis not found.
      </div>
    );
  }

  const result = analysis.result;

  const sections = [
    {
      title: "Matched skills",
      count: result.matchedSkills.length,
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      title: "Partial matches",
      count: result.partialSkills.length,
      icon: AlertTriangle,
      color: "text-amber-500",
    },
    {
      title: "Missing skills",
      count: result.missingSkills.length,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <main className="pb-8 mx-10 mt-2.5">
      {/* Page header */}
      <div className="space-y-4">
        <button className="px-3.5 py-2" onClick={() => router.replace("/analysis")}>Back</button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="size-4" />
              AI-powered resume analysis
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Analysis Results
            </h1>

            <p className="text-sm text-muted-foreground">
              Review your strengths, skill gaps, and recommended next steps.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            {analysis.status}
          </span>
        </div>
      </div>

      {/* Analysis metadata */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Resume ID</p>
            <p className="font-medium">{analysis.resume_id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Job description ID</p>
            <p className="font-medium">{analysis.job_description_id}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Executive summary</h2>
        </div>

        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <p className="text-sm leading-7 text-muted-foreground">
            {result.summary || analysis.summary}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              Created {formatDate(analysis.created_at)}
            </span>
            {analysis.completed_at && (
              <span>Completed {formatDate(analysis.completed_at)}</span>
            )}
          </div>
        </div>
      </section>

      {/* Skill overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Skill gap overview</h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="rounded-xl border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    {section.title}
                  </p>
                  <Icon className={`size-5 ${section.color}`} />
                </div>

                <p className="mt-3 text-3xl font-bold tabular-nums">
                  {section.count}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Matched skills */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Matched skills</h2>
          <span className="text-sm text-muted-foreground">
            ({result.matchedSkills.length})
          </span>
        </div>

        {result.matchedSkills.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {result.matchedSkills.map((item, index) => (
              <SkillEvidenceCard key={`${item.skill}-${index}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border p-4 text-sm text-muted-foreground">
            No matched skills were returned.
          </p>
        )}
      </section>

      {/* Partial skills */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Partially matched skills</h2>
          <span className="text-sm text-muted-foreground">
            ({result.partialSkills.length})
          </span>
        </div>

        {result.partialSkills.length > 0 ? (
          <div className="space-y-3">
            {result.partialSkills.map((item, index) => (
              <PartialSkillCard key={`${item.skill}-${index}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border p-4 text-sm text-muted-foreground">
            No partial matches were returned.
          </p>
        )}
      </section>

      {/* Missing skills */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <XCircle className="size-5 text-red-500" />
          <h2 className="text-lg font-semibold">Missing skills</h2>
          <span className="text-sm text-muted-foreground">
            ({result.missingSkills.length})
          </span>
        </div>

        {result.missingSkills.length > 0 ? (
          <div className="space-y-3">
            {result.missingSkills.map((item, index) => (
              <MissingSkillCard key={`${item.skill}-${index}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border p-4 text-sm text-muted-foreground">
            No missing skills were returned.
          </p>
        )}
      </section>

      {/* Recommendations */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Recommended next steps</h2>
        </div>

        {result.recommendations.length > 0 ? (
          <div className="rounded-2xl border bg-card p-4 sm:p-5">
            <div className="space-y-4">
              {result.recommendations.map((recommendation, index) => (
                <div
                  key={`${index}-${recommendation}`}
                  className="flex items-start gap-3"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </div>

                  <p className="pt-0.5 text-sm leading-6 text-muted-foreground">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-xl border p-4 text-sm text-muted-foreground">
            No recommendations were returned.
          </p>
        )}
      </section>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
        <ChevronRight className="size-4" />
        <span>
          Analysis generated by {analysis.model} · Prompt version{" "}
          {analysis.prompt_version}
        </span>
      </div>
    </main>
  );
};

export default AnalysisDetails;

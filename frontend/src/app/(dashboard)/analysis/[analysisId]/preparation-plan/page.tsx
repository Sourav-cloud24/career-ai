
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  LoaderCircle,
  Target,
  BookOpen,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { preparationApi } from "@/features/annalysis/apis/preparation.api";
import type { PreparationPlanResponse } from "@/features/annalysis/types/preparation.type";

const priorityStyles = {
  high: "bg-red-500/10 text-red-600 border-red-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function PreparationPlanPage() {
  const params = useParams<{ analysisId: string }>();
  const router = useRouter();

  const analysisId = params.analysisId;

  const {
    data: response,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<PreparationPlanResponse>({
    queryKey: ["preparation-plan", analysisId],
    queryFn: () =>
      preparationApi.getPreparationPlanByAnalysisId(
        Number(analysisId)
      ),
    enabled: Boolean(analysisId),
  });

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <LoaderCircle className="size-9 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your preparation plan...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="size-10 text-destructive" />

        <h2 className="text-lg font-semibold">
          Unable to load preparation plan
        </h2>

        <p className="text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Something went wrong."}
        </p>

        <button
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  const preparationPlan = response?.data;

  if (!preparationPlan) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="text-muted-foreground">
          Preparation plan not found.
        </p>
      </div>
    );
  }

  const plan = preparationPlan.plan;

  const totalDays = plan.weeks.reduce(
    (total, week) => total + week.days.length,
    0
  );

  const totalTasks = plan.weeks.reduce(
    (total, week) =>
      total +
      week.days.reduce(
        (dayTotal, day) => dayTotal + day.tasks.length,
        0
      ),
    0
  );

  const totalMinutes = plan.weeks.reduce(
    (total, week) =>
      total +
      week.days.reduce(
        (dayTotal, day) => dayTotal + day.estimatedMinutes,
        0
      ),
    0
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8">

      {/* Header */}
      <div className="space-y-5">
        <button
          onClick={() => router.push(`/analysis/${analysisId}`)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to analysis
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="size-4" />
              AI-powered learning roadmap
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {preparationPlan.title}
            </h1>

            <p className="text-sm text-muted-foreground">
              Follow your personalized roadmap and build the skills
              required for your target role.
            </p>
          </div>

          <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="mr-1 inline size-4" />
            Generated
          </span>
        </div>
      </div>

      {/* Overview */}
      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Target className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Your preparation overview
          </h2>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          {plan.overview}
        </p>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CalendarDays className="size-5" />}
          label="Duration"
          value={`${plan.durationWeeks} Weeks`}
        />

        <StatCard
          icon={<BookOpen className="size-5" />}
          label="Total learning days"
          value={totalDays.toString()}
        />

        <StatCard
          icon={<CheckCircle2 className="size-5" />}
          label="Learning tasks"
          value={totalTasks.toString()}
        />

        <StatCard
          icon={<Clock className="size-5" />}
          label="Estimated study time"
          value={`${Math.round(totalMinutes / 60)} Hours`}
        />
      </section>

      {/* Weekly roadmap */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">
            Your learning roadmap
          </h2>

          <p className="text-sm text-muted-foreground">
            Complete each week's goals and daily learning activities.
          </p>
        </div>

        {plan.weeks.map((week) => (
          <section
            key={week.weekNumber}
            className="overflow-hidden rounded-2xl border bg-card"
          >
            {/* Week Header */}
            <div className="border-b bg-muted/30 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Week {week.weekNumber}
                  </span>

                  <h3 className="text-lg font-bold">
                    {week.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {week.goal}
                  </p>
                </div>

                <span className="flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {week.days.length} Days
                </span>
              </div>
            </div>

            {/* Daily Activities */}
            <div className="space-y-5 p-5 sm:p-6">
              {week.days.map((day) => (
                <div
                  key={`${week.weekNumber}-${day.dayNumber}`}
                  className="rounded-xl border p-4 sm:p-5"
                >
                  {/* Day Header */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Day {day.dayNumber}
                      </p>

                      <h4 className="text-base font-semibold">
                        {day.topic}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                          priorityStyles[day.priority]
                        }`}
                      >
                        {day.priority} priority
                      </span>

                      <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {day.estimatedMinutes} min
                      </span>
                    </div>
                  </div>

                  {/* Learning Goal */}
                  <div className="mt-5 space-y-2">
                    <p className="text-sm font-semibold">
                      Learning goal
                    </p>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {day.learningGoal}
                    </p>
                  </div>

                  {/* Tasks */}
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-semibold">
                      Tasks to complete
                    </p>

                    <div className="space-y-2.5">
                      {day.tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                          <p className="text-sm leading-6 text-muted-foreground">
                            {task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverable */}
                  <div className="mt-5 rounded-lg bg-primary/5 p-4">
                    <div className="flex items-start gap-2">
                      <Flag className="mt-0.5 size-4 shrink-0 text-primary" />

                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          Expected deliverable
                        </p>

                        <p className="text-sm leading-6 text-muted-foreground">
                          {day.deliverable}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </section>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>
          Preparation plan generated on{" "}
          {new Date(preparationPlan.created_at).toLocaleDateString("en-IN")}
        </span>

        <span>
          Analysis ID: {preparationPlan.analysis_id}
        </span>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

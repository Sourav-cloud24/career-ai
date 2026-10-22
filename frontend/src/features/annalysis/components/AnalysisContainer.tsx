
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Sparkles,
  Check,
  X,
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Lightbulb,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import SelectionCard from "./SelectionCard";
import AnalysisStepper from "./AnalysisStepper";
import { resumeApi } from "@/features/resumes/apis/resume.api";
import { jobDescriptionApi } from "@/features/jobDescriptions/apis/job-description.api";
import { analysisApi } from "../apis/analysis.api";
import AnalysisHistroy from "./AnalysisHistroy";

/* ----------------------------- Types ----------------------------- */

type SkillEvidence = {
  skill: string;
  evidence: string;
};

type AnalysisResult = {
  summary: string;
  matchedSkills: SkillEvidence[];
  partialSkills: {
    skill: string;
    note: string;
  }[];
  missingSkills: SkillEvidence[];
  recommendations: string[];
};

type CreateAnalysisPayload = {
  resumeId: number;
  jobDescriptionId: number;
};

type CreateAnalysisResponse = {
  success: boolean;
  data: {
    id: number;
    status: string;
    result: AnalysisResult;
  };
};

type View =
  | { kind: "setup" }
  | { kind: "running"; step: number }
  | { kind: "result"; result: AnalysisResult }
  | { kind: "failed"; message: string };

type ApiResume = {
  id: string | number;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: string | number;
  storage_key: string;
  extracted_text: string | null;
  created_at: string;
  updated_at: string;
};

type SelectableResume = Omit<ApiResume, "id"> & { id: string };

type ApiResumesResponse = {
  success: boolean;
  message?: string;
  data: ApiResume[];
};

type ApiJobDescription = {
  id: string | number;
  job_title: string;
  company_name?: string | null;
  description: string;
  created_at: string;
};

type SelectableJobDescription = Omit<ApiJobDescription, "id"> & {
  id: string;
};

type ApiJobDescriptionsResponse = {
  success?: boolean;
  message?: string;
  data: ApiJobDescription[];
};

/* ----------------------------- Page ------------------------------ */

const AnalysisContainer = () => {
  const [view, setView] = useState<View>({
    kind: "setup",
  });

  const [resumeId, setResumeId] = useState("");
  const [jdId, setJdId] = useState("");
  const [showAllMatched, setShowAllMatched] = useState(false);

  /* -------------------------- Fetch resumes -------------------------- */

  const {
    data: resumesResponse,
    isLoading: isLoadingResumes,
    isError: isResumesError,
    refetch: refetchResumes,
  } = useQuery<ApiResumesResponse>({
    queryKey: ["resumes"],
    queryFn: resumeApi.getResumes,
  });

  /* ---------------------- Fetch job descriptions --------------------- */

  const {
    data: jobDescriptionsResponse,
    isLoading: isLoadingJobDescriptions,
    isError: isJobDescriptionsError,
    refetch: refetchJobDescriptions,
  } = useQuery<ApiJobDescriptionsResponse>({
    queryKey: ["job-descriptions"],
    queryFn: jobDescriptionApi.getJobDescriptions,
  });

  /* ------------------------- API data -------------------------------- */

  const resumes: SelectableResume[] = (resumesResponse?.data ?? []).map(
    (resume) => ({ ...resume, id: String(resume.id) })
  );
  const jobDescriptions: SelectableJobDescription[] = (
    jobDescriptionsResponse?.data ?? []
  ).map((jobDescription) => ({
    ...jobDescription,
    id: String(jobDescription.id),
  }));

  const selectedResume =
    resumes.find((resume) => String(resume.id) === resumeId) ?? null;

  const selectedJobDescription =
    jobDescriptions.find((jd) => String(jd.id) === jdId) ?? null;

  /* ----------------------- Create analysis --------------------------- */

  const {
    mutate: createAnalysis,
    isPending,
  } = useMutation<
    CreateAnalysisResponse,
    Error,
    CreateAnalysisPayload
  >({
    mutationFn: analysisApi.createAnalysis,

    onSuccess: (response) => {
      const result = response?.data?.result;

      if (!result) {
        setView({
          kind: "failed",
          message:
            "The analysis result was missing from the server response.",
        });
        return;
      }

      setShowAllMatched(false);

      setView({
        kind: "result",
        result,
      });
    },

    onError: (error) => {
      setView({
        kind: "failed",
        message:
          error.message || "Failed to analyze your resume. Please try again.",
      });
    },
  });

  /* ----------------------- Selection handlers ----------------------- */

  const handleResumeSelect = (resume: SelectableResume) => {
    setResumeId(resume.id);
  };

  const handleJobDescriptionSelect = (
    jobDescription: SelectableJobDescription
  ) => {
    setJdId(jobDescription.id);
  };

  /* ------------------------- Start analysis -------------------------- */

  const startAnalysis = () => {
    if (!selectedResume || !selectedJobDescription || isPending) {
      return;
    }

    const numericResumeId = Number(selectedResume.id);
    const numericJobDescriptionId = Number(selectedJobDescription.id);

    if (
      !Number.isInteger(numericResumeId) ||
      numericResumeId <= 0 ||
      !Number.isInteger(numericJobDescriptionId) ||
      numericJobDescriptionId <= 0
    ) {
      setView({
        kind: "failed",
        message: "The selected resume or job description has an invalid ID.",
      });
      return;
    }

    setShowAllMatched(false);
    setView({ kind: "running", step: 0 });

    createAnalysis({
      resumeId: numericResumeId,
      jobDescriptionId: numericJobDescriptionId,
    });
  };

  /* ---------------------------- Setup -------------------------------- */

  if (view.kind === "setup") {
    const isLoading =
      isLoadingResumes || isLoadingJobDescriptions;

    const hasSelection =
      selectedResume !== null &&
      selectedJobDescription !== null;

    const hasLoadError =
      isResumesError || isJobDescriptionsError;

    return (
      <div className="flex flex-col px-5 py-6">
        <h1 className="text-2xl font-semibold text-ink">
          Start new analysis
        </h1>

        <p className="mt-1 mb-6 text-[13.5px] text-muted">
          Select a resume and a job description to compare and get
          AI-powered insights.
        </p>

        {hasLoadError && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-2 text-sm text-error"
          >
            <p>
              Unable to load your resumes or job descriptions.
              Please try again.
            </p>

            <button
              type="button"
              onClick={() => {
                void refetchResumes();
                void refetchJobDescriptions();
              }}
              className="w-fit font-semibold underline"
            >
              Retry loading
            </button>
          </div>
        )}

        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <SelectionCard<SelectableResume>
            step="1. Select resume"
            icon={
              <FileText
                className="h-5 w-5"
                strokeWidth={1.7}
              />
            }
            itemLabel="resume"
            options={resumes}
            selectedOption={selectedResume}
            getOptionTitle={(resume) => resume.file_name}
            getOptionSubtitle={(resume) => resume.file_type}
            onSelect={handleResumeSelect}
            isLoading={isLoadingResumes}
          />

          <div className="flex h-8 w-8 flex-none items-center justify-center self-center rounded-full bg-line-2 text-indigo">
            <Plus className="h-4 w-4" />
          </div>

          <SelectionCard<SelectableJobDescription>
            step="2. Select job description"
            icon={
              <Briefcase
                className="h-5 w-5"
                strokeWidth={1.7}
              />
            }
            itemLabel="job description"
            options={jobDescriptions}
            selectedOption={selectedJobDescription}
            getOptionTitle={(jd) => jd.job_title}
            getOptionSubtitle={(jd) =>
              jd.company_name || "Company not specified"
            }
            onSelect={handleJobDescriptionSelect}
            isLoading={isLoadingJobDescriptions}
          />
        </div>

        <button
          type="button"
          onClick={startAnalysis}
          disabled={!hasSelection || isLoading || hasLoadError || isPending}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo text-[14px] font-semibold text-white hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-50 md:w-fit md:px-6"
        >
          <Sparkles className="h-4 w-4" />
          Start analysis
        </button>

        <p className="mt-2 text-xs text-muted">
          Select both items to begin your analysis.
        </p>
        <AnalysisHistroy/>
      </div>
    );
  }

  /* ---------------------------- Running ------------------------------- */

  if (view.kind === "running") {
    return <AnalysisStepper view={view} />;
  }

  /* ----------------------------- Failed ------------------------------- */

  if (view.kind === "failed") {
    return (
      <div className="flex flex-col items-center px-5 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error-bg text-error">
          <AlertCircle
            className="h-8 w-8"
            strokeWidth={1.6}
          />
        </div>

        <h1 className="text-xl font-semibold text-ink">
          Analysis failed
        </h1>

        <p className="mt-2 max-w-sm text-[13.5px] text-muted">
          {view.message}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={startAnalysis}
            disabled={
              !selectedResume ||
              !selectedJobDescription ||
              isPending
            }
            className="inline-flex h-10 items-center rounded-lg bg-indigo px-5 text-[13.5px] font-semibold text-white hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={() => setView({ kind: "setup" })}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-5 text-[13.5px] font-semibold text-ink hover:bg-line-2"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------- Result -------------------------------- */

  const { result } = view;

  const totalSkills =
    result.matchedSkills.length +
    result.partialSkills.length +
    result.missingSkills.length;

  const visibleMatched = showAllMatched
    ? result.matchedSkills
    : result.matchedSkills.slice(0, 6);

  const hiddenMatched =
    result.matchedSkills.length - visibleMatched.length;

  return (
    <div className="flex flex-col px-5 py-6">
      {/* Header */}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Back to setup"
            onClick={() => setView({ kind: "setup" })}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-line text-muted hover:bg-line-2 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-ink">
              Analysis result
            </h1>

            <p className="truncate text-xs text-muted">
              {selectedResume?.file_name ?? "Selected resume"}{" "}
              vs{" "}
              {selectedJobDescription?.job_title ??
                "Selected job description"}
              {selectedJobDescription?.company_name
                ? ` · ${selectedJobDescription.company_name}`
                : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={startAnalysis}
          disabled={
            !selectedResume ||
            !selectedJobDescription ||
            isPending
          }
          className="inline-flex h-10 flex-none items-center gap-2 rounded-lg border border-line bg-white px-4 text-[13.5px] font-semibold text-ink hover:bg-line-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 text-indigo" />
          Re-run
        </button>
      </div>

      {/* Summary */}

      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
          <Sparkles className="h-4 w-4 text-indigo" />
          AI analysis summary
        </p>

        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          {result.summary}
        </p>
      </div>

      {/* Skill statistics */}

      <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-success-bg text-success">
            <Check className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[13.5px] font-semibold text-ink">
              {result.matchedSkills.length} / {totalSkills}
            </p>
            <p className="text-xs text-muted">
              Matched skills
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-error-bg text-error">
            <X className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[13.5px] font-semibold text-ink">
              {result.missingSkills.length} / {totalSkills}
            </p>
            <p className="text-xs text-muted">
              Missing skills
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-warn-bg text-warn">
            <MinusCircle className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[13.5px] font-semibold text-ink">
              {result.partialSkills.length} / {totalSkills}
            </p>
            <p className="text-xs text-muted">
              Partial matches
            </p>
          </div>
        </div>
      </div>

      {/* Matched and missing skills */}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Matched skills */}

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            Matched skills
          </p>

          {result.matchedSkills.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted">
              No matching skills were identified.
            </p>
          ) : (
            <>
              <ul className="mt-3 flex flex-col gap-2.5">
{visibleMatched.map((item, index) => (
  <li
    key={`${item.skill}-${index}`}
    className="flex items-start gap-2 text-[13.5px] text-ink"
  >
    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" />

    <div>
      <p className="font-medium">{item.skill}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {item.evidence}
      </p>
    </div>
  </li>
))}
              </ul>

              {result.matchedSkills.length > 6 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAllMatched((previous) => !previous)
                  }
                  className="mt-3 text-[12.5px] font-medium text-indigo hover:underline"
                >
                  {showAllMatched
                    ? "Show less"
                    : `+ ${hiddenMatched} more`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Missing skills */}

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-error">
            <XCircle className="h-4 w-4" />
            Missing skills
          </p>

          {result.missingSkills.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted">
              No missing skills were identified.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
{result.missingSkills.map((item, index) => (
  <li
    key={`${item.skill}-${index}`}
    className="flex items-start gap-2 text-[13.5px] text-ink"
  >
    <XCircle className="mt-0.5 h-4 w-4 flex-none text-error" />

    <div>
      <p className="font-medium">{item.skill}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {item.evidence}
      </p>
    </div>
  </li>
))}
            </ul>
          )}
        </div>
      </div>

      {/* Partial matches */}

      {result.partialSkills.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-warn">
            <MinusCircle className="h-4 w-4" />
            Partial matches
          </p>

          <ul className="mt-3 flex flex-col gap-3">
            {result.partialSkills.map((item, index) => (
              <li key={`${item.skill}-${index}`}>
                <p className="text-[13.5px] font-medium text-ink">
                  {item.skill}
                </p>

                <p className="text-xs leading-relaxed text-muted">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}

      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
          <Lightbulb className="h-4 w-4 text-indigo" />
          Recommendations
        </p>

        {result.recommendations.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted">
            No recommendations were provided for this analysis.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {result.recommendations.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-indigo" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preparation plan CTA */}

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl bg-indigo/10 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[14px] font-semibold text-ink">
            Ready to close the gaps?
          </p>

          <p className="text-[12.5px] text-muted">
            Build a personalized preparation plan for your skill gaps.
          </p>
        </div>

        <Link
          href="/dashboard/preparation-plan"
          className="inline-flex h-10 flex-none items-center rounded-lg bg-indigo px-5 text-[13.5px] font-semibold text-white hover:bg-indigo-hover"
        >
          View preparation plan
        </Link>
      </div>
    </div>
  );
};

export default AnalysisContainer;

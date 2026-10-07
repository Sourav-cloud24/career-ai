"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Upload as UploadIcon, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobDescriptionApi } from "../apis/job-description.api";

type ApiJobDescription = {
  id: string;
  job_title: string;
  company_name?: string | null;
  description: string;
  created_at: string;
};

const jdSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Job description is required.")
    .min(50, "Please paste the full job description (at least 50 characters)."),
  title: z.string().trim().min(1, "Job title is required."),
  company: z.string().trim().optional(),
});

type JDValues = z.infer<typeof jdSchema>;

const MAX_CHARS = 15000;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const JobDescriptionContainer = () => {
  const [mode, setMode] = useState<"paste" | "upload">("paste");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<JDValues>({
    resolver: zodResolver(jdSchema),
    defaultValues: { description: "", title: "", company: "" },
  });

  const descriptionValue = watch("description") ?? "";

  const { mutate: saveJobDescription, isPending: isSaving } = useMutation({
    mutationFn: jobDescriptionApi.createJobDescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
      reset();
    },
    onError: (error) => {
      console.error("Failed to save job description:", error);
    },
  });

  const { mutate: deleteJobDescription } = useMutation({
    mutationFn: jobDescriptionApi.deleteJobDescription,
    onMutate: (id: string) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
    },
    onError: (error) => {
      console.error("Failed to delete job description:", error);
    },
    onSettled: () => setDeletingId(null),
  });

  const {
    data: jobDescriptionsResponse,
    isLoading,
    isError,
  } = useQuery<{ data: ApiJobDescription[] }>({
    queryKey: ["job-descriptions"],
    queryFn: jobDescriptionApi.getJobDescriptions,
  });

  const jobDescriptions = jobDescriptionsResponse?.data ?? [];

  const onSubmit = (values: JDValues) => {
    saveJobDescription(values);
  };

  return (
    <div className="flex flex-col px-5 py-6">
      <h1 className="text-2xl font-semibold text-ink">Add job description</h1>
      <p className="mt-1 mb-6 text-[13.5px] text-muted">
        Paste the job description or upload a file. You can add multiple JDs.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tabs */}
        <div className="mb-4 inline-flex rounded-full bg-line-2 p-[3px]">
          <button
            type="button"
            onClick={() => setMode("paste")}
            className={`rounded-full px-4 py-1.5 text-[13px] transition-colors ${
              mode === "paste" ? "bg-white text-ink shadow-sm" : "text-muted"
            }`}
          >
            Paste text
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-full px-4 py-1.5 text-[13px] transition-colors ${
              mode === "upload" ? "bg-white text-ink shadow-sm" : "text-muted"
            }`}
          >
            Upload file
          </button>
        </div>

        {mode === "paste" ? (
          <div>
            <div className="relative">
              <textarea
                {...register("description")}
                maxLength={MAX_CHARS}
                placeholder="Paste the job description here…"
                className={`min-h-[120px] w-full resize-none rounded-lg border px-3.5 py-3 text-[13.5px] text-ink outline-none placeholder:text-muted-2 focus:border-indigo focus:ring-[3px] focus:ring-indigo/15 ${
                  errors.description ? "border-error bg-error-bg" : "border-line"
                }`}
              />
              <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-muted-2">
                {descriptionValue.length}/{MAX_CHARS}
              </span>
            </div>
            {errors.description && (
              <p className="mt-1.5 text-[12.5px] text-error">{errors.description.message}</p>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed border-line bg-line-2 px-5 py-10 text-center">
            <UploadIcon className="mb-3 h-9 w-9 text-indigo" strokeWidth={1.5} />
            <p className="text-sm font-medium text-ink">Drag & drop a file, or browse</p>
            <span className="mt-1 text-[11.5px] text-muted-2">PDF, DOC, DOCX, or TXT</span>
            <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" />
          </label>
        )}

        {/* Title / Company */}
        <div className="mt-3.5 grid grid-cols-2 gap-3.5">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ink">
              Job title <span className="text-error">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Frontend Developer"
              className={`h-[42px] w-full rounded-lg border px-3 text-[13.5px] outline-none placeholder:text-muted-2 focus:border-indigo focus:ring-[3px] focus:ring-indigo/15 ${
                errors.title ? "border-error bg-error-bg" : "border-line"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-[12.5px] text-error">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ink">
              Company name <span className="text-muted-2">(optional)</span>
            </label>
            <input
              {...register("company")}
              placeholder="e.g. Google"
              className="h-[42px] w-full rounded-lg border border-line px-3 text-[13.5px] outline-none placeholder:text-muted-2 focus:border-indigo focus:ring-[3px] focus:ring-indigo/15"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-indigo px-5 text-[13.5px] font-semibold text-white hover:bg-indigo-hover disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save job description"}
        </button>
      </form>

      {/* List */}
      <h3 className="mb-3 mt-7 text-sm font-semibold text-ink">Your job descriptions</h3>
      <div className="flex flex-col gap-2.5">
        {isLoading && (
          <p className="py-6 text-center text-[13.5px] text-muted">Loading job descriptions…</p>
        )}

        {isError && (
          <p className="py-6 text-center text-[13.5px] text-error">
            Couldn't load your job descriptions. Please try again.
          </p>
        )}

        {!isLoading &&
          !isError &&
          jobDescriptions.map((jd) => (
            <div
              key={jd.id}
              className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-3"
            >
              <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                <FileText className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink">{jd.job_title}</p>
                <p className="text-xs text-muted">
                  {jd.company_name ? `${jd.company_name} · ` : ""}Created {formatDate(jd.created_at)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Delete job description"
                disabled={deletingId === jd.id}
                onClick={() => deleteJobDescription(jd.id)}
                className="flex-none rounded-full p-1.5 text-muted hover:bg-error-bg hover:text-error disabled:opacity-50"
              >
                {deletingId === jd.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}

        {!isLoading && !isError && jobDescriptions.length === 0 && (
          <p className="py-6 text-center text-[13.5px] text-muted">
            No job descriptions added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionContainer;
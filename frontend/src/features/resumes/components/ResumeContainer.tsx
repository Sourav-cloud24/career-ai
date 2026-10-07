"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileText,
  MoreVertical,
  Loader2,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "../apis/resume.api";

type ResumeStatus = "processed" | "processing" | "failed";

// Shape returned by the API
type ApiResume = {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  storage_key: string;
  extracted_text: string | null;
  created_at: string;
  updated_at: string;
};

type ApiResumesResponse = {
  success: boolean;
  message: string;
  data: ApiResume[];
};

const STATUS_STYLES: Record<ResumeStatus, string> = {
  processed: "bg-success-bg text-success",
  processing: "bg-warn-bg text-warn",
  failed: "bg-error-bg text-error",
};

const STATUS_LABEL: Record<ResumeStatus, string> = {
  processed: "Processed",
  processing: "Processing",
  failed: "Failed",
};

const FILE_COLOR: Record<"pdf" | "doc", string> = {
  pdf: "bg-[#C4384B]",
  doc: "bg-[#2563C7]",
};

function getFileKind(fileType: string): "pdf" | "doc" {
  return fileType.includes("pdf") ? "pdf" : "doc";
}

function getStatus(resume: ApiResume): ResumeStatus {
  // No extracted_text yet -> still being processed. Adjust if your API
  // exposes an explicit status field instead of inferring it.
  return resume.extracted_text ? "processed" : "processing";
}

function formatSize(bytes: string): string {
  const n = Number(bytes);
  if (Number.isNaN(n)) return bytes;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const ResumeContainer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: resumesResponse,
    isLoading,
    isError,
  } = useQuery<ApiResumesResponse>({
    queryKey: ["resumes"],
    queryFn: resumeApi.getResumes,
  });

  const resumes = resumesResponse?.data ?? [];

  const { mutate: upload, isPending } = useMutation({
    mutationFn: resumeApi.uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.error("Resume upload failed:", error);
    },
  });

  const { mutate: deleteResume } = useMutation({
    mutationFn: resumeApi.deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.error("Resume upload failed:", error);
    },
  });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    upload(file);
  };

  return (
    <div className="flex flex-col px-5 py-6">
      <h1 className="text-2xl font-semibold text-ink">Upload resume</h1>
      <p className="mt-1 mb-6 text-[13.5px] text-muted">
        Upload your resume in PDF, DOC or DOCX format. Max size 10MB.
      </p>

      {/* Dropzone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed px-5 py-12 text-center transition-colors ${
          isPending ? "cursor-wait opacity-70" : "cursor-pointer"
        } ${isDragging ? "border-indigo bg-indigo/5" : "border-line bg-line-2"}`}
      >
        {isPending ? (
          <Loader2
            className="mb-3.5 h-11 w-11 animate-spin text-indigo"
            strokeWidth={1.5}
          />
        ) : (
          <UploadCloud
            className="mb-3.5 h-11 w-11 text-indigo"
            strokeWidth={1.5}
          />
        )}
        <p className="text-sm font-medium text-ink">
          {isPending ? "Uploading…" : "Drag & drop your resume here"}
        </p>
        {!isPending && (
          <>
            <span className="mb-4 text-[12.5px] text-muted">or</span>
            <span className="inline-flex h-10 items-center rounded-lg bg-indigo px-5 text-[13.5px] font-semibold text-white hover:bg-indigo-hover">
              Choose file
            </span>
          </>
        )}
        <span className="mt-3.5 text-[11.5px] text-muted-2">
          Supported formats: PDF, DOC, DOCX &nbsp;•&nbsp; Max size: 10MB
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          disabled={isPending}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Resume list */}
      <div className="mt-5 flex flex-col gap-2.5">
        {isLoading && (
          <p className="py-6 text-center text-[13.5px] text-muted">
            Loading resumes…
          </p>
        )}

        {isError && (
          <p className="py-6 text-center text-[13.5px] text-error">
            Couldn't load your resumes. Please try again.
          </p>
        )}

        {!isLoading &&
          !isError &&
          resumes.map((resume) => {
            const kind = getFileKind(resume.file_type);
            const status = getStatus(resume);
            return (
              <div
                key={resume.id}
                className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-3"
              >
                <div
                  className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-lg text-[10px] font-bold text-white ${FILE_COLOR[kind]}`}
                >
                  {kind === "pdf" ? "PDF" : "DOC"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink">
                    {resume.file_name}
                  </p>
                  <p className="text-xs text-muted">
                    Uploaded {formatDate(resume.created_at)} ·{" "}
                    {formatSize(resume.file_size)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Delete resume"
                  // disabled={isDeleting}
                  onClick={() => deleteResume(resume.id)}
                  className="flex-none rounded-full p-1.5 text-muted hover:bg-error-bg hover:text-error disabled:opacity-50"
                >
                  {/* {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )} */}
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}

        {!isLoading && !isError && resumes.length === 0 && (
          <p className="py-6 text-center text-[13.5px] text-muted">
            No resumes uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeContainer;

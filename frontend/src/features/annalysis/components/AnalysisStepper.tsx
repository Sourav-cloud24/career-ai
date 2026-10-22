import { Check, Loader2, Sparkles } from "lucide-react";

const STEPS = [
  "Reading resume",
  "Reading JD",
  "Analyzing",
  "Generating results",
];
type AnalysisResult = {
  matchScore: number;
  overallRating: "Poor" | "Fair" | "Good" | "Excellent";
  matchedSkills: string[];
  partialSkills: { skill: string; note: string }[];
  missingSkills: string[];
  relevantExperience: string[];
};
type View =
  | { kind: "setup" }
  | { kind: "running"; step: number }
  | { kind: "result"; result: AnalysisResult }
  | { kind: "failed"; message: string };
const AnalysisStepper = ({
  view,
}: {
  view: Extract<View, { kind: "running" }>;
}) => {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="mb-6 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-indigo/10 text-indigo">
        <Sparkles className="h-9 w-9" strokeWidth={1.5} />
      </div>

      <h1 className="text-xl font-semibold text-ink">
        Analyzing your resume &amp; job description
      </h1>
      <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">
        Our AI is comparing your resume with the job description, identifying
        match percentage, skills, and gaps.
      </p>

      {/* Stepper */}
      <div className="mt-8 w-full max-w-lg">
        <div className="flex items-center">
          {STEPS.map((label, i) => {
            const done = i < view.step;
            const current = i === view.step;
            return (
              <div
                key={label}
                className="flex flex-1 items-center last:flex-none"
              >
                <div
                  className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full text-xs font-semibold ${
                    done || current
                      ? "bg-indigo text-white"
                      : "bg-line-2 text-muted-2"
                  }`}
                >
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : current ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-1.5 h-0.5 flex-1 rounded ${
                      i < view.step ? "bg-indigo" : "bg-line"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 flex justify-between">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`w-20 text-[11.5px] ${
                i === view.step ? "font-medium text-ink" : "text-muted"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 max-w-md rounded-lg bg-line-2 px-4 py-3.5 text-[12.5px] text-muted">
        This may take 30 seconds to 2 minutes. Please don&apos;t close this
        window.
      </div>
    </div>
  );
};

export default AnalysisStepper;

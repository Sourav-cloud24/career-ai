import { getJobDescriptionById } from "../job-description/job-description.repository.js";
import { getResumeById } from "../resume/resume.repository.js";
import { analysisResponseSchema } from "./ai.response-schema.js";
import { analysisResultSchema } from "./ai.schema.js";
import { buildAnalysisPrompt } from "./analysis.prompt.js";
import { createAnalysis, getAnalysesByUserId, getAnalysisById } from "./analysis.repository.js";
import { generateStructuredContent } from "./gemini.service.js";

export const analyzeResumeAgainstJob = async ({
  resumeId,
  jobDescriptionId,
  userId,
}) => {
  // 1. Fetch the selected resume belonging to this user.
  const resume = await getResumeById({ resumeId, userId });
  console.log("resumeId, userId-->", resumeId, userId);

  if (!resume) {
    const error = new Error("Resume not found.");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch the selected job description belonging to this user.
  const jobDescription = await getJobDescriptionById({
    jobDescriptionId,
    userId,
  });

  if (!jobDescription) {
    const error = new Error("Job description not found.");
    error.statusCode = 404;
    throw error;
  }

  // 3. Make sure the resume contains extracted text.
  if (!resume.extracted_text?.trim()) {
    const error = new Error(
      "The selected resume has no extracted text. Please upload it again.",
    );
    error.statusCode = 400;
    throw error;
  }

  // 4. Make sure the job description contains usable text.
  if (!jobDescription.description?.trim()) {
    const error = new Error("The selected job description is empty.");
    error.statusCode = 400;
    throw error;
  }

  // 5. Build the prompt using the selected records.
  const prompt = buildAnalysisPrompt({
    resumeText: resume.extracted_text,
    jobDescription: jobDescription.description,
  });

  // 6. Ask Gemini to generate the structured analysis.
  const aiResult = await generateStructuredContent({
    prompt,
    responseSchema: analysisResponseSchema,
  });

  // 7. Validate Gemini's result using Zod.
  const validationResult = analysisResultSchema.safeParse(aiResult);

  if (!validationResult.success) {
    console.error(
      "AI analysis validation failed:",
      validationResult.error.issues,
    );

    const error = new Error(
      "The AI generated an invalid analysis. Please try again.",
    );
    error.statusCode = 502;
    throw error;
  }

  const savedAnalysis = await createAnalysis({
    userId,
    resumeId,
    jobDescriptionId,
    result: validationResult.data,
    model: "gemini",
  });

  return savedAnalysis;
};

export const getAnalysisByIdForUser = async ({ analysisId, userId }) => {
  const analysis = await getAnalysisById({
    analysisId,
    userId,
  });

  if (!analysis) {
    const error = new Error("Analysis not found.");
    error.statusCode = 404;
    throw error;
  }

  return analysis;
};

export const getAnalysesHistory = async ({ userId }) => {
  const analyses = await getAnalysesByUserId({ userId });

  return analyses;
}

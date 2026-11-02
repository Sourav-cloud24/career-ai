import { getAnalysisById } from "../ai/analysis.repository.js";

import { generateStructuredContent } from "../ai/gemini.service.js";

import { preparationPlanSchema } from "./preparation-plan.schema.js";

import { preparationPlanResponseSchema } from "./preparation-plan.response-schema.js";

import {
  createPreparationPlan,
  getPreparationPlanByAnalysisId,
} from "./preparation-plan.repository.js";

export const generatePreparationPlan = async ({ analysisId, userId }) => {
  // 1. Verify that the analysis belongs to this user.
  const analysis = await getAnalysisById({
    analysisId,
    userId,
  });

  if (!analysis) {
    const error = new Error("Analysis not found.");
    error.statusCode = 404;
    throw error;
  }

  if (analysis.status !== "completed") {
    const error = new Error(
      "A preparation plan can only be generated for a completed analysis.",
    );
    error.statusCode = 400;
    throw error;
  }

  // 2. Return the existing plan if one has already been generated.
  const existingPlan = await getPreparationPlanByAnalysisId({
    analysisId,
    userId,
  });

  if (existingPlan) {
    return existingPlan;
  }

  // 3. Build the prompt from the saved analysis result.
  const result =
    typeof analysis.result === "string"
      ? JSON.parse(analysis.result)
      : analysis.result;

  const prompt = `
You are an expert technical interview preparation coach.

Create a personalized preparation plan based on the candidate's
existing resume analysis.

ANALYSIS SUMMARY:
${result.summary}

MATCHED SKILLS:
${JSON.stringify(result.matchedSkills ?? [])}

PARTIAL SKILLS:
${JSON.stringify(result.partialSkills ?? [])}

MISSING SKILLS:
${JSON.stringify(result.missingSkills ?? [])}

RECOMMENDATIONS:
${JSON.stringify(result.recommendations ?? [])}

REQUIREMENTS:
- Create a practical plan lasting 1 to 12 weeks.
- Prioritize high-importance missing skills.
- Include revision and practice for matched skills.
- Include coding exercises and interview practice where relevant.
- Make every day's tasks specific and actionable.
- Each week must contain between 1 and 7 days.
- Each day must include a learning goal, tasks, estimated minutes,
  priority, and a concrete deliverable.
- Keep the plan realistic for someone preparing alongside normal work.
- Return only data matching the requested JSON schema.
`;

  // 4. Generate the structured plan with Gemini.
  const aiResult = await generateStructuredContent({
    prompt,
    responseSchema: preparationPlanResponseSchema,
  });

  // 5. Validate the response before saving it.
  const validationResult = preparationPlanSchema.safeParse(aiResult);

  if (!validationResult.success) {
    console.error(
      "Preparation plan validation failed:",
      validationResult.error.issues,
    );

    const error = new Error(
      "The AI generated an invalid preparation plan. Please try again.",
    );
    error.statusCode = 502;
    throw error;
  }

  // 6. Save the validated plan in PostgreSQL.
  return createPreparationPlan({
    analysisId,
    userId,
    title: "Personalized Interview Preparation Plan",
    plan: validationResult.data,
  });
};

export const getPreparationPlan = async ({ analysisId, userId }) => {
  // Verify that the analysis belongs to this user.
  const analysis = await getAnalysisById({
    analysisId,
    userId,
  });

  if (!analysis) {
    const error = new Error("Analysis not found.");
    error.statusCode = 404;
    throw error;
  }

  const plan = await getPreparationPlanByAnalysisId({
    analysisId,
    userId,
  });

  // No plan is a valid state.
  return plan;
};

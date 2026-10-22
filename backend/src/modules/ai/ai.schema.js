import { z } from "zod";

export const analysisResultSchema = z.object({
  summary: z.string(),

  matchedSkills: z.array(
    z.object({
      skill: z.string(),
      evidence: z.string(),
    }),
  ),

  partialSkills: z.array(
    z.object({
      skill: z.string(),
      reason: z.string(),
    }),
  ),

  missingSkills: z.array(
    z.object({
      skill: z.string(),
      importance: z.enum(["high", "medium", "low"]),
      reason: z.string(),
    }),
  ),

  recommendations: z.array(z.string()),
});

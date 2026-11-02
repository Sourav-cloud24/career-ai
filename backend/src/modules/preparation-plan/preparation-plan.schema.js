import { z } from "zod";

const preparationTaskSchema = z.object({
  dayNumber: z.number().int().min(1).max(7),

  topic: z.string().min(1),

  priority: z.enum(["high", "medium", "low"]),

  learningGoal: z.string().min(1),

  tasks: z.array(z.string().min(1)).min(1),

  estimatedMinutes: z.number().int().min(15).max(480),

  deliverable: z.string().min(1),
});

const preparationWeekSchema = z.object({
  weekNumber: z.number().int().min(1).max(12),

  title: z.string().min(1),

  goal: z.string().min(1),

  days: z.array(preparationTaskSchema).min(1).max(7),
});

export const preparationPlanSchema = z.object({
  overview: z.string().min(1),

  durationWeeks: z.number().int().min(1).max(12),

  weeks: z.array(preparationWeekSchema).min(1).max(12),
});

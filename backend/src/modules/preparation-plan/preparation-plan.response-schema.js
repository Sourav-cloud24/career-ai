export const preparationPlanResponseSchema = {
  type: "OBJECT",
  properties: {
    overview: {
      type: "STRING",
    },
    durationWeeks: {
      type: "INTEGER",
    },
    weeks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          weekNumber: {
            type: "INTEGER",
          },
          title: {
            type: "STRING",
          },
          goal: {
            type: "STRING",
          },
          days: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                dayNumber: {
                  type: "INTEGER",
                },
                topic: {
                  type: "STRING",
                },
                priority: {
                  type: "STRING",
                  enum: ["high", "medium", "low"],
                },
                learningGoal: {
                  type: "STRING",
                },
                tasks: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },
                estimatedMinutes: {
                  type: "INTEGER",
                },
                deliverable: {
                  type: "STRING",
                },
              },
              required: [
                "dayNumber",
                "topic",
                "priority",
                "learningGoal",
                "tasks",
                "estimatedMinutes",
                "deliverable",
              ],
            },
          },
        },
        required: ["weekNumber", "title", "goal", "days"],
      },
    },
  },
  required: ["overview", "durationWeeks", "weeks"],
};

export const analysisResponseSchema = {
  type: "object",

  properties: {
    summary: {
      type: "string",
    },

    matchedSkills: {
      type: "array",

      items: {
        type: "object",

        properties: {
          skill: {
            type: "string",
          },

          evidence: {
            type: "string",
          },
        },

        required: ["skill", "evidence"],
      },
    },

    partialSkills: {
      type: "array",

      items: {
        type: "object",

        properties: {
          skill: {
            type: "string",
          },

          reason: {
            type: "string",
          },
        },

        required: ["skill", "reason"],
      },
    },

    missingSkills: {
      type: "array",

      items: {
        type: "object",

        properties: {
          skill: {
            type: "string",
          },

          importance: {
            type: "string",

            enum: ["high", "medium", "low"],
          },

          reason: {
            type: "string",
          },
        },

        required: ["skill", "importance", "reason"],
      },
    },

    recommendations: {
      type: "array",

      items: {
        type: "string",
      },
    },
  },

  required: [
    "summary",
    "matchedSkills",
    "partialSkills",
    "missingSkills",
    "recommendations",
  ],
};

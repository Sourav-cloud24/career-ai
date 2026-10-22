// import "dotenv/config";

// import {
//     generateStructuredContent,
// } from "./gemini.service.js";

// import {
//     analysisResponseSchema,
// } from "./ai.response-schema.js";

// import {
//     analysisResultSchema,
// } from "./ai.schema.js";

// const test = async () => {
//     try {
//         const result =
//             await generateStructuredContent({
//                 prompt: `
// Analyze this candidate against the following job description.

// Candidate Resume:
// 3 years of frontend development experience.
// Experience with React, JavaScript, Redux, Next.js and REST APIs.

// Job Description:
// Looking for a frontend developer with React, JavaScript,
// Next.js, GraphQL and automated testing experience.

// Identify matched, partial and missing skills.
// Do not invent experience.
// `,

//                 responseSchema:
//                     analysisResponseSchema,
//             });

//         console.log("Gemini response:");

//         console.log(
//             JSON.stringify(
//                 result,
//                 null,
//                 2
//             )
//         );

//         // Zod validation
//         const validationResult =
//             analysisResultSchema.safeParse(
//                 result
//             );

//         if (!validationResult.success) {
//             console.error(
//                 "AI response validation failed:"
//             );

//             console.error(
//                 validationResult.error.format()
//             );

//             return;
//         }

//         console.log(
//             "AI response validation successful!"
//         );

//         console.log(
//             JSON.stringify(
//                 validationResult.data,
//                 null,
//                 2
//             )
//         );

//     } catch (error) {
//         console.error(
//             "Gemini test failed:",
//             error
//         );
//     }
// };

// test();





import "dotenv/config";

import { analyzeResumeAgainstJob } from "./analysis.service.js"

const testAnalysis = async () => {
  try {
    const result = await analyzeResumeAgainstJob({
      resumeId: 7,
      jobDescriptionId: 5,
      userId: 1,
    });

    console.log("Analysis completed successfully!");
    console.dir(result, { depth: null });
  } catch (error) {
    console.error("Analysis failed:", error.message);
    console.error("Status code:", error.statusCode);
  }
};

testAnalysis();



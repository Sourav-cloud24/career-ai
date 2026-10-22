export const buildAnalysisPrompt = ({ resumeText, jobDescription }) => {
  return `
You are an AI career analysis assistant.

Your task is to compare a candidate's resume against a target job description.

Analyze ONLY the information provided in the resume and job description.

IMPORTANT RULES:

1. Never invent skills, experience, projects, tools, certifications, or technologies.

2. A skill should be considered "matched" only when the resume provides credible evidence that the candidate has experience with that skill.

3. A skill should be considered "partial" when the resume shows some related or incomplete experience, but does not fully satisfy the job requirement.

4. A skill should be considered "missing" when the job description requires it and the resume provides no credible evidence of that skill.

5. Related technologies must NOT automatically be treated as equivalent.
   For example:
   - REST APIs does not mean GraphQL.
   - React does not mean Vue.
   - Redux does not mean Zustand.
   - Jest does not automatically mean Cypress.

6. Use the job description to determine which skills are required.

7. Use the resume to determine what evidence the candidate actually has.

8. Every matched skill must include evidence from the resume.

9. Every partial skill must explain why the candidate only partially satisfies the requirement.

10. Every missing skill must explain why it is considered missing.

11. Recommendations must be actionable and focused on helping the candidate close the identified skill gaps.

12. Do not provide recommendations to the hiring manager. Recommendations should be for the candidate.

13. Do not create a numerical match score.

14. Return only information that fits the provided response schema.

CANDIDATE RESUME:

${resumeText}

TARGET JOB DESCRIPTION:

${jobDescription}
`;
};

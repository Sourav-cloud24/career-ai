import pool from "../../config/db.js";


export const createAnalysis = async ({
  userId,
  resumeId,
  jobDescriptionId,
  result,
  model,
}) => {
  const query = `
    INSERT INTO analyses (
      user_id,
      resume_id,
      job_description_id,
      status,
      summary,
      result,
      model,
      prompt_version,
      completed_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING
      id,
      user_id,
      resume_id,
      job_description_id,
      status,
      summary,
      result,
      model,
      prompt_version,
      created_at,
      completed_at
  `;

  const values = [
    userId,
    resumeId,
    jobDescriptionId,
    "completed",
    result.summary,
    JSON.stringify(result),
    model,
    "v1",
  ];

  const { rows } = await pool.query(query, values);
  console.log("rows-->", rows[0])

  return rows[0];
};

export const getAnalysisById = async ({ analysisId, userId }) => {
  const query = `
    SELECT
      id,
      user_id,
      resume_id,
      job_description_id,
      status,
      summary,
      result,
      model,
      prompt_version,
      created_at,
      completed_at
    FROM analyses
    WHERE id = $1
      AND user_id = $2
  `;

  const { rows } = await pool.query(query, [
    analysisId,
    userId,
  ]);

  return rows[0] || null;
};

export const getAnalysesByUserId = async ({ userId }) => {
  const query = `

SELECT
  a.id,
  a.status,
  a.summary,
  a.created_at,
  a.completed_at,
  r.file_name AS resume_name,
  jd.job_title,
  jd.company_name
FROM analyses a
JOIN resumes r
  ON r.id = a.resume_id
JOIN job_descriptions jd
  ON jd.id = a.job_description_id
WHERE a.user_id = $1
ORDER BY a.created_at DESC;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
};

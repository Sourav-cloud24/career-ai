
import pool from "../../config/db.js";

// 1. Get dashboard statistics
export const getDashboardStats = async ({ userId }) => {
  const query = `
    SELECT
      (SELECT COUNT(*)
       FROM resumes
       WHERE user_id = $1) AS total_resumes,

      (SELECT COUNT(*)
       FROM job_descriptions
       WHERE user_id = $1) AS total_job_descriptions,

      (SELECT COUNT(*)
       FROM analyses
       WHERE user_id = $1) AS total_analyses,

      (SELECT COUNT(*)
       FROM analyses
       WHERE user_id = $1
         AND status = 'completed') AS completed_analyses;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows[0];
};


// 2. Get recent analyses
export const getRecentAnalyses = async ({
  userId,
  limit = 5,
}) => {
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
    LEFT JOIN resumes r
      ON r.id = a.resume_id
    LEFT JOIN job_descriptions jd
      ON jd.id = a.job_description_id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2;
  `;

  const { rows } = await pool.query(query, [userId, limit]);

  return rows;
};


// 3. Get latest completed analysis
export const getLatestAnalysis = async ({ userId }) => {
  const query = `
    SELECT
      a.id,
      a.status,
      a.summary,
      a.result,
      a.created_at,
      a.completed_at,
      r.file_name AS resume_name,
      jd.job_title,
      jd.company_name
    FROM analyses a
    LEFT JOIN resumes r
      ON r.id = a.resume_id
    LEFT JOIN job_descriptions jd
      ON jd.id = a.job_description_id
    WHERE a.user_id = $1
      AND a.status = 'completed'
    ORDER BY a.created_at DESC
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows[0] || null;
};

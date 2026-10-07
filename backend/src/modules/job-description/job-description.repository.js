import pool from "../../config/db.js";

export const createJobDescription = async ({
    userId,
    jobTitle,
    companyName,
    description,
}) => {
    const result = await pool.query(
        `
        INSERT INTO job_descriptions (
            user_id,
            job_title,
            company_name,
            description
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            user_id,
            job_title,
            company_name,
            description,
            created_at,
            updated_at
        `,
        [
            userId,
            jobTitle,
            companyName,
            description,
        ]
    );

    return result.rows[0];
};

export const getJobDescriptionsByUserId = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            job_title,
            company_name,
            description,
            created_at,
            updated_at
        FROM job_descriptions
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;
};

export const deleteJobDescription = async ({ jobId, userId }) => {
  const result = await pool.query(
    `
      DELETE FROM job_descriptions
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        user_id,
        job_title,
        company_name,
        description,
        created_at,
        updated_at
    `,
    [jobId, userId]
  );

  return result.rows[0] || null;
};
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
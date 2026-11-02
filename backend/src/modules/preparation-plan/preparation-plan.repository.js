import pool from "../../config/db.js";

export const createPreparationPlan = async ({
  analysisId,
  userId,
  title,
  plan,
}) => {
  const query = `
    INSERT INTO preparation_plans (
      analysis_id,
      user_id,
      title,
      plan
    )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (analysis_id)
    DO NOTHING
    RETURNING
      id,
      analysis_id,
      user_id,
      title,
      plan,
      created_at,
      updated_at
  `;

  const values = [
    analysisId,
    userId,
    title,
    JSON.stringify(plan),
  ];

  const { rows } = await pool.query(query, values);

  // A row was inserted successfully.
  if (rows.length > 0) {
    return rows[0];
  }

  // Another request already inserted this analysis's plan.
  return getPreparationPlanByAnalysisId({
    analysisId,
    userId,
  });
};

export const getPreparationPlanByAnalysisId = async ({
  analysisId,
  userId,
}) => {
  const query = `
    SELECT
      id,
      analysis_id,
      user_id,
      title,
      plan,
      created_at,
      updated_at
    FROM preparation_plans
    WHERE analysis_id = $1
      AND user_id = $2
  `;

  const { rows } = await pool.query(query, [
    analysisId,
    userId,
  ]);

  return rows[0] || null;
};
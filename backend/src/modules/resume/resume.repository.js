import pool from "../../config/db.js";

export const createResume = async ({
  userId,
  fileName,
  fileType,
  fileSize,
  storageKey,
  extractedText = null,
}) => {
  const result = await pool.query(
    `
      INSERT INTO resumes (
        user_id,
        file_name,
        file_type,
        file_size,
        storage_key,
        extracted_text
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        user_id,
        file_name,
        file_type,
        file_size,
        storage_key,
        extracted_text,
        created_at,
        updated_at
    `,
    [userId, fileName, fileType, fileSize, storageKey, extractedText],
  );

  return result.rows[0];
};

export const updateExtractedText = async ({resumeId, extractedText}) => {
  const result = await pool.query(
    `
    UPDATE resumes
    SET
      extracted_text = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      user_id,
      file_name,
      file_type,
      file_size,
      storage_key,
      extracted_text,
      created_at,
      updated_at
    `,
    [extractedText, resumeId]
  );

  return result.rows[0] || null
}
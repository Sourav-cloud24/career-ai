import pool from "../../config/db.js";

export const createRefreshToken = async ({
  userId,
  tokenId,
  expiresAt,
}) => {
  const result = await pool.query(
    `
      INSERT INTO refresh_tokens (
        user_id,
        token_id,
        expires_at
      )
      VALUES ($1, $2, $3)
      RETURNING id, user_id, token_id, expires_at, created_at
    `,
    [userId, tokenId, expiresAt]
  );

  return result.rows[0];
};

export const findRefreshTokenByTokenId = async (tokenId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        user_id,
        token_id,
        expires_at,
        revoked_at,
        created_at
      FROM refresh_tokens
      WHERE token_id = $1
    `,
    [tokenId]
  );

  return result.rows[0] || null;
};

export const revokeRefreshToken = async (tokenId) => {
  await pool.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_id = $1
        AND revoked_at IS NULL
    `,
    [tokenId]
  );
};
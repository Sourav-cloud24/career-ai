export const findUserById = async (userId) => {
  const result = await pool.query(
    `
      SELECT id, full_name, email, created_at, updated_at
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0] || null;
};
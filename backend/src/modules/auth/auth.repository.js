import pool from "../../config/db.js";

export const findUserByEmail = async (email) => {
    const query = `
        SELECT * 
        FROM users
        WHERE email = $1
    `;
    // console.log("query-->", query)

    const result = await pool.query(query, [email])

    return result.rows[0] || null
}

export const createUser = async ({
    fullName,
    email,
    passwordHash,
}) => {
    const query = `
        INSERT INTO users (
            full_name,
            email,
            password_hash
        ) 
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, created_at, updated_at
    `;

    const result = await pool.query(query, [fullName, email, passwordHash])

    return result.rows[0]
}
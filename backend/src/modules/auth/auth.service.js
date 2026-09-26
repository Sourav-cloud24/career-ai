import bcrypt from "bcryptjs"
import { createUser, findUserByEmail } from "./auth.repository.js"
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { findUserById } from "./user.repository.js";


export const registerUser = async ({
    fullName,
    email,
    password,
}) => {
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await createUser({
        fullName,
        email,
        passwordHash,
    })

    return user
}

export const loginUser = async ({
    email,
    password,
}) => {
    const existingUser = await findUserByEmail(email)

    // console.log("existingUser-->", existingUser)

    if (!existingUser) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash)

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    return {
        user: {
            id: existingUser.id,
            fullName: existingUser.full_name,
            email: existingUser.email,
        },
        accessToken,
        refreshToken
    };
}

export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await findUserById(decoded.userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);

    return accessToken;
  } catch (error) {
    if (error.statusCode === 401) {
      throw error;
    }

    const authError = new Error(
      "Invalid or expired refresh token"
    );

    authError.statusCode = 401;

    throw authError;
  }
};
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto";
import { createUser, findUserByEmail } from "./auth.repository.js"
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { findUserById } from "./user.repository.js";
import { createRefreshToken, revokeRefreshToken } from "./refresh-token.repository.js";


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

const tokenId = randomUUID();

const refreshToken = generateRefreshToken(
  existingUser,
  tokenId
);

const expiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);

await createRefreshToken({
  userId: user.id,
  tokenId,
  expiresAt,
});

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

    const storedToken =
      await findRefreshTokenByTokenId(
        decoded.tokenId
      );

    if (!storedToken) {
      const error = new Error(
        "Refresh token session not found"
      );

      error.statusCode = 401;

      throw error;
    }

    if (storedToken.revoked_at) {
      const error = new Error(
        "Refresh token has been revoked"
      );

      error.statusCode = 401;

      throw error;
    }

    if (
      new Date(storedToken.expires_at) <= new Date()
    ) {
      const error = new Error(
        "Refresh token has expired"
      );

      error.statusCode = 401;

      throw error;
    }

    const user = await findUserById(
      decoded.userId
    );

    if (!user) {
      const error = new Error("User not found");

      error.statusCode = 401;

      throw error;
    }

    // Revoke old refresh token
    await revokeRefreshToken(
      decoded.tokenId
    );

    // Create new refresh token
    const newTokenId = randomUUID();

    const newRefreshToken =
      generateRefreshToken(
        user,
        newTokenId
      );

    const newExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await createRefreshToken({
      userId: user.id,
      tokenId: newTokenId,
      expiresAt: newExpiresAt,
    });

    // Create new access token
    const accessToken =
      generateAccessToken(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
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

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    await revokeRefreshToken(decoded.tokenId);
  } catch (error) {
    // Even if the refresh token is invalid or expired,
    // logout should still continue.
  }
};
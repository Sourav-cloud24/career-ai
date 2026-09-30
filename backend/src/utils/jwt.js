import jwt from "jsonwebtoken"

export const generateAccessToken = (user, tokenId) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            tokenId
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "20m",
        }
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    )
}
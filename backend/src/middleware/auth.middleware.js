import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            const error = new Error("Authentication token is required");
            error.statusCode = 401;
            throw error;
        }

        const [scheme, token] = authorizationHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            const error = new Error("Invalid authentication format");
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Authentication token has expired";
        }

        if (error.name === "JsonWebTokenError") {
            error.statusCode = 401;
            error.message = "Invalid authentication token";
        }

        next(error);
    }
}
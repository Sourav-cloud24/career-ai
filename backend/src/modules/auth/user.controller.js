import { success } from "zod"

export const getCurrentUser = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Authenticated user",
            data: {
                user: req.user
            }
        })
    } catch (error) {
        next(error);
    }
}
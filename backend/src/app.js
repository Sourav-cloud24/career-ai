import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CareerAI API is running"
    })
})

app.use("/api/v1/auth", authRoutes)

export default app
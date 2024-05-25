import express from "express"
import { errorMiddleware } from "./middleware/error.middleware"
import cors from "cors"
import dotenvConfig from "./config/dotenv.config"
import { loggerMidleware } from "./middleware/logger.middleware"
import cookieParser from "cookie-parser"
import userRouter from "./route/user.route"
import csvUserRouter from "./route/csv_uploaders/userCsv.route"
const app = express()
app.use(express.json())
app.use(
    cors({
        allowedHeaders: ["Content-Type"],
        methods: ["GET", "POST"],
        origin: dotenvConfig.HOST,
 })
)
app.use(cookieParser(dotenvConfig.SECRET_COOKIE))
app.use(loggerMidleware)
app.use('/api/', csvUserRouter)
app.use('/api/user/', userRouter)

app.use(errorMiddleware)
export default app

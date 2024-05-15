import express from "express"
import logger from "./config/logger.config"
import { errorMiddleware } from "./middleware/error.middleware"
import cors from "cors"
import dotenvConfig from "./config/dotenv.config"
import { loggerMidleware } from "./middleware/logger.middleware"
const app = express()

app.use(
    cors({
        allowedHeaders: ["Content-Type"],
        methods: ["GET", "POST"],
        origin: dotenvConfig.HOST,
    })
)

logger.info(`starting Api at port ${dotenvConfig.PORT}`)

app.use(loggerMidleware)
app.use(errorMiddleware)

export default app

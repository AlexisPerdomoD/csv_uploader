import app from "./app"
import envConfig from "./config/dotenv.config"
import logger from "./config/logger.config"
import dao from "./dao"

["SIGING", "SIGTERM", "SIGQUIT"].forEach((signal) =>
    process.on(signal, async () => {
        await dao.close()
        process.exit(0)
    })
)

const PORT = envConfig.PORT
app.listen(PORT, () => logger.info("App serving on Port ", PORT))

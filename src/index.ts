import app from "./app";
import envConfig from "./config/dotenv.config";

const PORT = envConfig.PORT
app.listen(PORT, ()=>{})

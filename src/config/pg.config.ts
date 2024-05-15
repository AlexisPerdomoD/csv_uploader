import { Pool } from "pg"
import envConfig from "./dotenv.config"
import logger from "./logger.config"
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = envConfig
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: true,
})
// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, _client) => {
    logger.log("fatal", "Unexpected error on idle client" + err)
    process.exit(-1)
})
const close = () => pool.end()
const getClient = async () => {
    try {
        const client = await pool.connect()
        logger.info("Client properly connected to db:" + PGDATABASE)
        return client
    } catch (error) {
        logger.log("fatal", "Error trying to connect db : " + error)
        process.exit(-1)
    }
}
export default {
    close,
    getClient,
} 

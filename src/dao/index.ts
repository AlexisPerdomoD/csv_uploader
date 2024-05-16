import { PoolClient } from "pg"
import pgConfig from "../config/pg.config"
import PostgreSQLManager from "./postgreSQL"

class DataAccessObject {
    private client: PoolClient | null = null
    close = () => pgConfig.close()
    private async getClient() {
        if (!this.client) {
            this.client = await pgConfig.getClient()
            return this.client
        }
        return this.client
    }
    //postgreSQL manager
    pm = new PostgreSQLManager(this.getClient)
}
export default new DataAccessObject()

import { PoolClient } from "pg"
import pgConfig from "../config/pg.config"
import PostgreSQLManager from "./postgreSQL"
import UserManager from "./user"

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
    // others database managers 


    //ApiUsersManager
    um =  new UserManager(this.getClient)
}
export default new DataAccessObject()

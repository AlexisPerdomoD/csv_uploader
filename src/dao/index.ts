import { PoolClient } from "pg"
import pgConfig from "../config/pg.config"
import { Res } from "../model"
import { User } from "../model/csv_model/user.model"

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
    // userUploader:Promise<Res<User>>
}
export default new DataAccessObject()

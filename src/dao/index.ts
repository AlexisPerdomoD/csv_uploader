import { PoolClient } from "pg"
import pgConfig from "../config/pg.config"
import PostgresUploader from "./postgreSQL"
import UserManager from  "./user"
import { User, UserInfo } from "../model/csv_model/user.model"
import { Uploader } from "./uploaders.model"

class DataAccessObject {
    //sql client for sql
    private client: PoolClient | null = null
    // close data bases, 1 for now 
    close = () => pgConfig.close()
    // method requires to do a query in postgreSQL managers and Uploaders (pg)
    private async getClient() {
        if (!this.client) {
            this.client = await pgConfig.getClient()
            return this.client
        }
        return this.client
    }
    //postgreSQL Uploaders 
    usersUploader:Uploader<UserInfo, User> = new PostgresUploader<UserInfo, User>(this.getClient)
    // others database Uploaders and managers  

    //ApiUsersManager used to controle sessions 
    um =  new UserManager(this.getClient)
}
export default new DataAccessObject()

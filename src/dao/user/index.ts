import { PoolClient, QueryResult } from "pg"
import { ApiUser, ApiUserInfo } from "../../model/user.model"
import ApiErrorManager, { ErrorCode } from "../../model/error/error.model"

export default class UserManager{
    #gC: () => Promise<PoolClient>
    constructor(getClient: () => Promise<PoolClient>) {
        this.#gC = getClient
    }
    async createUser(ui:ApiUserInfo){
        const client = await this.#gC()
        const user:QueryResult<ApiUser> = await client.query({
            text:`INSERT INTO api_users(name,password, email, age, role)
                values($1,$2,$3,$4,$5) RETURNING*;`,
            values:[ui.name,ui.password, ui.email, ui.age, ui.role]
        })
        return user.rows[0]
    }
    async getUser(email:string){
        const client = await this.#gC()
        const user:QueryResult<ApiUser> = await client.query({
            text:'SELECT * FROM api_users WHERE email = $1;',
            values:[email]
        })
        if(user.rowCount === 0)throw new ApiErrorManager({
                message:'not found',
                code:ErrorCode.GENERAL_USER_ERROR,
                status:404,
            })
        return user.rows[0]
    }
 }
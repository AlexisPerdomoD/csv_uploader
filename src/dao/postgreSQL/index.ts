import {PoolClient} from "pg";
import {CsvIssues, Data, Res} from "../../model";

class PostgreSQLManager{
    #gC:() => Promise<PoolClient>
    constructor(getClient:()=>Promise<PoolClient>){
        this.#gC = getClient
    }
    async upload<T>(data:Data<T>):Promise<Res<T & {id:number}>>{
        //Succeed type is a element properly insert in a postgreSQL data base 
        // Succeed type is just the returning row from a successfull row insertion
        // this step is necessary since data base must check at the very least uniques fields 
        type Succeed = T & {id:number}
        const success:Succeed[] = []
        const errors:CsvIssues[] = [] 
        return {
            ok:true,
            data:{
                success,
                errors
            }
        }
    }
}


export default PostgreSQLManager

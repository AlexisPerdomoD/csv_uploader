import { Schema } from "zod"
import { CsvIssues, Data } from "../model"
import { createReadStream, unlinkSync } from "fs"
import csv from "csv-parser"
import ApiErrorManager, {ErrorCode} from "../model/error/error.model"

export const validateFile = <T>(
    path: string,
    schema: Schema
): Promise<Data<T & { row: number }>> => new Promise((resolve, _reject)=>{
    const data: Data<T & { row: number }> = {
        valids: [],
        errors: [],
    }
    let currentRow = 0
    createReadStream(path)
        .pipe(csv())
        .on("data", (row) => {
            const validatedRow = schema.safeParse(row)
            if (validatedRow.success)
                data.valids.push({ ...validatedRow.data, row: currentRow })
            else {
                const error: CsvIssues = {
                    row: currentRow,
                    details: {},
                }
                for (let issue of validatedRow.error.errors) {
                    error.details[`${issue.path[0]}`] = issue.message + (issue.path.length > 1 
                        ? ` at key or position ${issue.path[1]}` : '')
                }
                data.errors.push(error)
            }
            currentRow++
        })
        .on("end", () => {
            // removes file
            unlinkSync(path)
            resolve(data)
        })
        .on('error', (err)=> {
            //removes file
            unlinkSync(path)
            throw new ApiErrorManager({
                message:'something went wrong reading the file, file may be corrupted',
                code:ErrorCode.INTERNAL_SERVER_ERROR,
                status:500,
                cause:err
            })
        })
})
// uses for validate data comming in the body of the request when revalidating data
export const validateBody = <T>(collection:any[], schema:Schema):Data<T & {row:number}>=>{
    const data:Data<T & {row:number}> = {
        valids:[],
        errors:[]
    }
    for(let i = 0; i < collection.length; i++){
        const doc = schema.safeParse(collection[i])
        if(doc.success){
            data.valids.push({...doc.data, row:i})
        }else {
                const error: CsvIssues = {
                    row: i,
                    details: {},
                }
                for (let issue of doc.error.errors) {
                    error.details[`${issue.path[0]}`] = issue.message + (issue.path.length > 1 
                        ? ` at key or position ${issue.path[1]}` : '')
                }
                data.errors.push(error)
            }


    }
    return data
}

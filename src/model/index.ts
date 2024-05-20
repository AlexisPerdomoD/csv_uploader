export type CsvIssues = {
    row: number
    details: {
        [key: string]: string
    }
}
// base model interface extends object, requires every csv model to be an object
// interface B extends Object {} 
// interface S(succeed) extends B return value from db 
// interface I(indexed) 
export interface Data<Base>{
    valids: (Base & {row:number})[]
    errors: CsvIssues[]
}
// type used to send the final response with the Succeed type from insertions to db and the information about the ones that did not make it.
export type Res<T> = {
    ok: true
    data: {
        success: T[]
        errors: CsvIssues[]
    }
}



export type CsvIssues ={
    row:string;
    [key:string]: string;
}
export type Res<T> = {
    ok:true,
    data:{
        success:T[],
        errors:CsvIssues[]
    }
}
export type ErrHttp = {
    message?:string,
    status:number,
    cause?:string,
    name?:string
}

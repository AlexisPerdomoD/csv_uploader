//postgreSQL Data type
import { QueryConfig } from "pg"
import { Data} from "."

// this Type also includes the QueryConfig for pg required for insert into the specific table from this type of db.
export interface PostgreSQLData<B> extends Data<B>{
    config: (data: B) => QueryConfig
}

export enum PostgresConstrainsErrCode {
    UniqueViolation = '23505',
    ForeignKeyViolation = '23503',
    NotNullViolation = '23502',
    CheckViolation = '23514',
    ExclusionViolation = '23P01',
    IntegrityConstrain_violation = '23000',
    Restric_Violation = '23001',
}

export enum PostgresInternalErrorCode { 
    InternalError = 'XX000',
    DataCorrupted = 'XX001',
    IndexCorrupted = 'XX002',
} 


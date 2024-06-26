import {PoolClient} from "pg"
 import { CsvIssues, Res } from "../../model"
import {
    PostgreSQLData,
    PostgresConstrainsErrCode,
} from "../../model/postgreSQL.model"
import ApiErrorManager, { ErrorCode } from "../../model/error/error.model"
import { Uploader } from "../uploaders.model"

class PostgresUploader
    <
        Base extends object, 
        Succeed extends Base
    > 
    implements Uploader<Base, Succeed>
{
    #gC: () => Promise<PoolClient>

    constructor(getClient: () => Promise<PoolClient>) {
        this.#gC = getClient
    }

    async upload(data: PostgreSQLData<Base>): Promise<Res<Succeed>> {
        const success: Succeed[] = []
        const errors: CsvIssues[] = data.errors
        const client = await this.#gC()
        // insert elements checking for UNIQUE constains
        // any other kind of error will throw an error and send a fail response
        for (const r of data.valids) {
            try {
                const insertedRow = await client.query(data.config(r))
                success.push(insertedRow.rows[0] as Succeed)
            } catch (err) {
                if (err instanceof Error) {
                    if ("code" in err) {
                        if (
                            err.code ===
                            PostgresConstrainsErrCode.UniqueViolation
                        ) {
                            errors.push({
                                row: r.row,
                                details: {
                                    unique_validation:
                                        "detail" in err &&
                                        typeof err.detail === "string"
                                            ? err.detail                                            
                                            : "one or some fields failed UNIQUE requirement",
                                },
                            })
                            continue
                        }
                        if (
                            Object.values(PostgresConstrainsErrCode).includes(
                                err.code as PostgresConstrainsErrCode
                            )
                        )
                            ApiErrorManager.generateModelIncompatibilityDataBaseError(
                                err
                            )
                    }
                    ApiErrorManager.generateExternalServiceError(
                        "PostgreSql",
                        err
                    )
                }
                throw new ApiErrorManager({
                    status: 500,
                    message: "Fatal: error did not provided any information",
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                })
            }
        }
        return {
            ok: true,
            data: {
                success,
                errors,
            },
        }
    }
}

export default PostgresUploader
// duplicate key example error
// {
//   "name": "error",
//   "length": 268,
//   "severity": "ERROR",
//   "code": "23505",
//   "detail": "Key (campo1, campo2)=(valor_duplicado1, valor_duplicado2) already exists.",
//   "schema": "public",
//   "table": "nombre_de_la_tabla",
//   "constraint": "nombre_de_la_restriccion_unique",
//   "file": "nbtinsert.c",
//   "line": "534",
//   "routine": "_bt_check_unique"
// }

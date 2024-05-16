import { NextFunction, Request, Response } from "express"
import { PostgreSQLData } from "../model/postgreSQL.model"
import ApiErrorManager, { ErrorCode } from "../model/error/error.model"
import { UserInfo, getConfig, userSchema } from "../model/csv_model/user.model"
import path from "path"
import { validateFile } from "../utility/validateFile.util"
import factory from "../dao"
const pm = factory.pm
export const postgreSqlUsersUploaderController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file) return ApiErrorManager.generateMissingFileError()
        const pathToFile = path.isAbsolute(req.file.path)
            ? path.join(__dirname, req.file.path)
            : req.file.path
        const data: PostgreSQLData<UserInfo> = {
            config: getConfig,
            ...(await validateFile<UserInfo>(pathToFile, userSchema)),
        }
        // not sure
        // if (data.valids.length  === 0)return res.json({
        // ok:true,
        // success:[],
        // errors: data.errors
        // })
        if (data.valids.length === 0)
            return res.status(400).json({
                message:
                    "none of the rows on the file was properly validated for the model provided, none was upload, verify csv rows file fits the user model",
                status: 400,
                code: ErrorCode.INVALID_TYPE_ERROR,
            })
        return res.json(await pm.upload(data))
    } catch (err) {
        next(err)
    }
}

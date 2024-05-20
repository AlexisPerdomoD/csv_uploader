import { NextFunction, Request, Response } from "express"
import { PostgreSQLData } from "../model/postgreSQL.model"
import ApiErrorManager, { ErrorCode } from "../model/error/error.model"
import { UserInfo, getConfig, userSchema } from "../model/csv_model/user.model"
import { validateFile , validateBody} from "../utility/validateFile.util"
import factory from "../dao"
const userUploader = factory.usersUploader


 
export const postgresUsersUploaderFromFileCtr = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.file === undefined) return next(ApiErrorManager.generateMissingFileError())
        const data = await validateFile<UserInfo>(req.file.path, userSchema)
        // not sure
        // if (data.valids.length  === 0)return res.json({
        // ok:true,
        // success:[],
        // errors: data.errors
        // })
        if(data.valids.length === 0)
             return res.status(400).json({
                message:
                    "none of the rows on the file was properly validated for the model provided, none was upload, verify csv rows file fits the user model",
                status: 400,
                code: ErrorCode.INVALID_TYPE_ERROR,
            })
        const parsedData:PostgreSQLData<UserInfo> ={
        config:getConfig,
        ...data
        }
        return res.json(await userUploader.upload(parsedData))
    } catch (err) {
        next(err)
    }
}

export const postgresUserUploaderCtr = async(req:Request, res:Response, next:NextFunction) =>{
     try{
        const collection = req.body
        if(!Array.isArray(collection)) throw new ApiErrorManager({
            message:'endpoint expects an objects Array to be validated',
            status:400, 
            code: ErrorCode.INVALID_TYPE_ERROR,
        })
        const data = validateBody<UserInfo>(collection, userSchema)
        if(data.valids.length === 0)
             return res.status(400).json({
                message:
                    "none of the rows on the file was properly validated for the model provided, none was upload, verify csv rows file fits the user model",
                status: 400,
                code: ErrorCode.INVALID_TYPE_ERROR,
            })
        const parsedData:PostgreSQLData<UserInfo> ={
        config:getConfig,
        ...data
        }
        return res.json(await userUploader.upload(parsedData))
    }catch(err){
        next(err)
    }

}

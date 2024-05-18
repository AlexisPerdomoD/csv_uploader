import { NextFunction, Request, Response } from "express"
import ApiErrorManager from "../model/error/error.model"
import  jwt  from 'jsonwebtoken';
import dotenvConfig from "../config/dotenv.config";
import { tokenInfoSchema } from "../model/user.model";

export const isAdm = (req:Request, _res:Response, next:NextFunction) =>{
    const token:string = req.signedCookies.token
    try {
        if(token === undefined)ApiErrorManager.generateAuthenticationError()

        const logInfo = jwt.verify(token, dotenvConfig.SECRET_TOKEN || '')

        const tokenInfo = tokenInfoSchema.safeParse(logInfo)

        if(tokenInfo.error || tokenInfo.data.role !== 'admin')ApiErrorManager.generateAuthorizationError()
        return next()
    } catch (error) {
        ApiErrorManager.generateAuthenticationError()
    }
}
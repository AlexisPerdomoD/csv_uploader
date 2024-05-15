import {NextFunction, Request, Response} from "express"
import logger from "../config/logger.config"

export const loggerMidleware = (req:Request, _res:Response, next:NextFunction)=>{
    logger.http(`${req.method} request in http://${req.headers.host}${req.originalUrl} - ${new Date().toLocaleTimeString()}`)
    next()
}

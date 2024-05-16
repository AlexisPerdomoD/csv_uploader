import { NextFunction, Request, Response } from "express"
import { ErrInterface, ErrorCode } from "../model/error/error.model"
import logger from "../config/logger.config"
import { MulterError } from "multer"
export const errorMiddleware = (
    e: Error | ErrInterface,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    //error comming from ErrInterface
    if ("status" in e && "message" in e) {
        logger.debug(`error incomming status:${e.status} ${e.name}`)
        e.cause && logger.log("fatal", e.cause)
        return res.status(e.status).json({
            name: e.name || "Error",
            message: e.message,
            status: e.status,
            code: e.code,
        })
    }
    // multer internal errors
    if (e instanceof MulterError) {
        return res.status(500).json({
            message:
                e.message ||
                "Error: there was some problem while loading your file",
            status: 500,
            code: ErrorCode.EXTERNAL_SERVICE_ERROR,
            name: e.name,
            field: e.field,
        })
    }

    logger.log(
        "fatal",
        `error status lost, process probably dead
        ${e.name} 
        ${e.message}
        ${e.cause}
        `
    )
    return res.status(500).json({
        error: ErrorCode.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "something when wrong, please try again later",
    })
}

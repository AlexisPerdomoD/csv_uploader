// ErrInterface can be use for custom ErrorManagers implementations
// since errorsMiddleware uses it as first reference follows by Error general type
export interface ErrInterface extends Error {
    message: string
    status: number
    cause?: Error
    name: string
    code: ErrorCode
}

export enum ErrorCode {
    ROUTING_ERROR = "ROUTING_ERROR",
    INVALID_TYPE_ERROR = "INVALID_TYPE_ERROR",
    NOT_AUTHORIZATION = "NOT_AUTHORIZATION",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    GENERAL_USER_ERROR = "GENERAL_USER_ERROR",
    LIMIT_ARISED_ERROR = "LIMIT_ARISED_ERROR",
}

export type ErrorParams = {
    status: number
    message: string
    code: ErrorCode
    cause?: Error
}

class ApiErrorManager extends Error implements ErrInterface {
    status: number
    code: ErrorCode
    cause?: Error

    constructor({ message, status, code, cause }: ErrorParams) {
        super(message)
        this.name = this.constructor.name
        this.status = status
        this.code = code
        if (cause) this.cause = cause
    }
    static generateMissingFileError = () =>{
        throw new this({
                message:'not file was uploaded',
                status:400,
                code:ErrorCode.GENERAL_USER_ERROR
            })
    }
    static generateAuthenticationError = () => {
        const message = `Authentication error: You need to log in to access this resource.`
        throw new this({
            code: ErrorCode.NOT_AUTHORIZATION,
            status: 401,
            message,
        })
    }
    static generateAuthorizationError = () => {
        const message = `Authorization error: You are not authorized to access this resource.`
        throw new this({
            code: ErrorCode.NOT_AUTHORIZATION,
            status: 403,
            message,
        })
    }
    static generateExceededSizeLimitError = () => {
        const message = `Exceeded Size Limit Error: the Size of the file was too large`
        throw new this({
            code: ErrorCode.LIMIT_ARISED_ERROR,
            status: 413,
            message,
        })
    }
    static generateExternalServiceError = (
        serviceName: string,
        cause: Error
    ) => {
        const message = `Error communicating with ${serviceName} service.`
        throw new this({
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            status: 500,
            cause,
            message,
        })
    }
    
    static generateModelIncompatibilityDataBaseError(cause:Error){
        const message = 'there is some validations errors the data base throws not including unique fields errors, please check compatibility between your ts model and your data base tables'
        throw new this({
            code: ErrorCode.EXTERNAL_SERVICE_ERROR,
            status:500,
            message,
            cause
        })
    }
}

export default ApiErrorManager

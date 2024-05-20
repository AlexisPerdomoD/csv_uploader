import {Router} from "express";
import uploaderMiddleware from "../../middleware/csvValidation.middleware";
import {postgresUsersUploaderFromFileCtr, postgresUserUploaderCtr} from "../../controller/uploader.controller";
import { isAdm } from "../../middleware/authentication.middleware";
//upload users database
const csvUserPostgresRouter = Router()

csvUserPostgresRouter.post('/upload/user',
    isAdm, 
    uploaderMiddleware.single('csv_file'), 
    async(req, res, next) => postgresUsersUploaderFromFileCtr(req, res, next)
)

csvUserPostgresRouter.post('/upload/user/json', 
    isAdm,
    postgresUserUploaderCtr
)

export default csvUserPostgresRouter 

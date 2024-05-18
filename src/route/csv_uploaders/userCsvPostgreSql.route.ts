import {Router} from "express";
import uploaderMiddleware from "../../middleware/csvValidation.middleware";
import {postgreSqlUsersUploaderController} from "../../controller/uploader.controller";

const csvUserPostgresRouter = Router()
csvUserPostgresRouter.post('upload', 
    uploaderMiddleware.single('csv_file'), 
    async(req, res, next) => postgreSqlUsersUploaderController(req, res, next)
)
export default csvUserPostgresRouter 

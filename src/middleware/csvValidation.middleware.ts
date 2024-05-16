import multer from 'multer'
import ApiErrorManager, {ErrorCode} from '../model/error/error.model'
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, '/tmp/csv')
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const uploaderMiddleware  = multer({
    fileFilter(_req, file, next) {
        if(file.mimetype !== 'text/csv' || !file.originalname.match(/\.(csv)$/))
            throw new ApiErrorManager({
                message:'the file uploaded does not provide or is not the right mimetype or file extension, this endpoints only allows csv uploads',
                status:400,
                code: ErrorCode.INVALID_TYPE_ERROR
            })
        // files larger than 10.5MB 
        if(file.size > 10.5 * 1024 * 1024)
            throw new ApiErrorManager({
                status:413,
                message:'the file Exceeded the limit 20MB, payload too large',
                code:ErrorCode.LIMIT_ARISED_ERROR
            })
        next(null, true)
    },
    limits:{
        fileSize:11 * 1024 * 1024,
    },
    storage 
})


export default uploaderMiddleware

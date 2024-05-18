import multer from 'multer'
import ApiErrorManager, {ErrorCode} from '../model/error/error.model'
import path from 'path'
const storage = multer.diskStorage({
  destination: path.join(__dirname,'/tmp/csv/'),
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
    
next(null, true)
},
    limits:{
        fileSize:11 * 1024 * 1024,
    },
    storage 
})


export default uploaderMiddleware

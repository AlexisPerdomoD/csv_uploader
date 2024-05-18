import { Router } from "express";
import { loginSchema } from "../model/user.model";
import ApiErrorManager, { ErrorCode } from "../model/error/error.model";
import dao from "../dao";
import { checkPass } from "../utility/hasher.util";
import jwt from 'jsonwebtoken'
import dotenvConfig from "../config/dotenv.config";
const userRouter = Router()

userRouter.post('/login', async(req, res, next)=>{
    try {
        const loginInfo = loginSchema.safeParse(req.body)
        if(loginInfo.error) throw new ApiErrorManager({
            message:loginInfo.error.errors[0].path.join(" ") +": "+ loginInfo.error.errors[0].message,
            code: ErrorCode.INVALID_TYPE_ERROR,
            status:400
        })
        const {email, password} = loginInfo.data
        const user = await dao.um.getUser(email)
        const isAuthenticated = checkPass(password, user)
        if(!isAuthenticated) throw new ApiErrorManager({
            status:401,
            message:'invalid credentials',
            code:ErrorCode.NOT_AUTHORIZATION
        })
        const data = jwt.sign({
                email: user.email,
                role: user.role
             }, 
             dotenvConfig.SECRET_TOKEN || '', 
             {expiresIn:"1h"}
        )
        
        res.cookie("token", data, {
            httpOnly:true,
            maxAge:1000 * 60 * 60,//1h,
            signed:true
        })
        res.send({
            ok:true,
            message:'logged in'
        })
    } catch (error) {
        next(error)
    }
})

export default userRouter
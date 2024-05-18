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
        const {email, password} = req.body
        const loginInfo = loginSchema.safeParse({
            email,
            password
        })
        if(loginInfo.error) throw new ApiErrorManager({
            message:loginInfo.error.errors[0].path[0] + loginInfo.error.errors[0].message,
            code: ErrorCode.INVALID_TYPE_ERROR,
            status:400
        })
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
        req.cookies("token", data, {
            httpOnly:true,
            maxAge:1000 * 60 * 60,//1h,
            signed:true
        })
        console.log(req.signedCookies)
        res.send({
            ok:true,
            message:'logged in'
        })
    } catch (error) {
        next(error)
    }
})

export default userRouter
import bcrypt from "bcrypt"
import { ApiUser } from "../model/user.model"


export const signPass = (password:string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// compare password
export const checkPass = (password:string, user:ApiUser) => bcrypt.compareSync(password, user.password)
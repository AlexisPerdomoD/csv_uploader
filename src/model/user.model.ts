import z from "zod"

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export const apiUserSchema = z.object({
    name: z
        .string({
            required_error: "name must not be empty",
            invalid_type_error: "name must be an string",
        })
        .min(1, "name must have at least one character"),
    email: z
        .string({
            invalid_type_error: "email must be an string",
            required_error: "email must not be empty",
        })
        .email("email must have a valid email format"),
    age: z.number({
        invalid_type_error:'age must be a number type'
    }).min(1, 'age can not be zero or less').int('age must be an integer'),
    role: z
        .enum(["user", "admin"], {
            message: "role must be an string valid, wether 'user' or 'admin'",
            invalid_type_error:
                "role must be an string valid, wether 'user' or 'admin'",
        })
        .default("user"),
    password:z.string().min(8, 'password must be at least 8 characters long').regex(regex, 'password did not met the required charaters to include')
})

export type ApiUserInfo = z.infer<typeof apiUserSchema>
export type ApiUser = ApiUserInfo & {id:number}

export const loginSchema = z.object({
    email: z
        .string({
            invalid_type_error: "email must be an string",
            required_error: "email must not be empty",
        })
        .email("email must have a valid email format"),
    password:z.string().min(8, 'password must be at least 8 characters long').regex(regex, 'invalid credentials')
},{
    message:'this end point expected a object with email  and password with a valid format, please check your credentials',
    invalid_type_error:'this end point expected a object email and password keys',
    required_error:'this end point expected a object with email and password but got undefined on both or one of them'
})
export const tokenInfoSchema = z.object({
    email: z
    .string()
    .email(),
    role:z.string().max(5)
})

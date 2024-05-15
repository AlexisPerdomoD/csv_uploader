import z from "zod"

export const userSchema = z.object({
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
    age: z
        .number({
            invalid_type_error: "age must be an integer type number",
        })
        .int("age must be an integer")
        .min(1, "age must be a valid number higher than 0"),
    role: z
        .enum(["user", "admin"], {
            message: "role must be an string valid, wether 'user' or 'admin'",
            invalid_type_error:
                "role must be an string valid, wether 'user' or 'admin'",
        })
        .default("user"),
})

export type UserInfo = z.infer<typeof userSchema>
export type User = UserInfo & { id: number }

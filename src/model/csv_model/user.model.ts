import {QueryConfig} from "pg"
import z from "zod"
//since every field of csv rows are string (even numbers) we import a custom type which validates if the field age can be parse into a valid number. custom zod types can be found in index.ts in model directory.
import {numberInStringMinAge} from "."
//Schema used to validate type errors on csv collection after convertion to json files model[]
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
    age: numberInStringMinAge,
    role: z
        .enum(["user", "admin"], {
            message: "role must be an string valid, wether 'user' or 'admin'",
            invalid_type_error:
                "role must be an string valid, wether 'user' or 'admin'",
        })
        .default("user"),
})
//type infer by schema extraction, references the rows model.
export type UserInfo = z.infer<typeof userSchema>
//type which references the type return by database after inserting data.
//this case Postgres return every field plus an id type number.
export type User = UserInfo & { id: number }


//Postgres models require also a method getConfig which recives as parameter the Base model (UserInfo) and returns a QueryConfig type to be used by an pg client, the required fields are text which includes the query and values to point the order of model fields to be inserted.

//this methods is required because of the PostgresData interface extends of Data generic type.
//others extends Data types may require diferent methods or fields to be implemented.
export const getConfig = (ui:UserInfo):QueryConfig =>{
    return {
         text:`INSERT INTO users(name, email, age, role)
            VALUES($1, $2, $3, $4) RETURNING *;`,
        values:[ui.name, ui.email, ui.age, ui.role]  
    }
}

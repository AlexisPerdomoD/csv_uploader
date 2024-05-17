import { z } from "zod"
//since csv-parser only returns json files with strings this step is necessary
export const numberInString = z.string().transform((val, ctx) => {
    const parsed = parseInt(val)
    if (isNaN(parsed)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not a int number was provided",
        })

        // This is a special symbol you can use to
        // return early from the transform function.
        // It has type `never` so it does not affect the
        // inferred return type.
        return z.NEVER
    }
    return parsed
})
export const numberInStringMinAge = z.string().transform((val, ctx) => {
    const parsed = parseInt(val)
    if (isNaN(parsed)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not a int number was provided",
        })

        // This is a special symbol you can use to
        // return early from the transform function.
        // It has type `never` so it does not affect the
        // inferred return type.
        return z.NEVER
    }
    if (parsed < 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "age must be a valid number higher than 0",
        })
        return z.NEVER
    }
    return parsed
})
export const numberFloatString = z.string().transform((val, ctx) => {
    const parsed = parseFloat(val)
    if (isNaN(parsed)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not a float valid number was provided",
        })
        return z.NEVER
    }
    return parsed
})

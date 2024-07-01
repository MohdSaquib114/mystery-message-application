import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(4,{message:"username must be at least 4 characters"})
    .max(20,{message:"username must not be more than 20 characters"})
    .regex(/^[a-zA-Z0-9_]+$/,{message:"User name must not containt any specaial characters"})

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be at least 6 character long"}).max(20, {message:"Password must be leass than 20 characters"}   )
})
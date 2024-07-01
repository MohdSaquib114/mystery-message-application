import {z} from "zod"

export  const messageSchema = z.object({
    content:z.string()
    .min(4, {message:"Message must be at least 4 character long"})
    .max(300, {message:"Message must be no longer than 300 character long"})
})
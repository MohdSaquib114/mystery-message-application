import {z} from "zod"

export  const messageResponseSchema = z.object({
    content:z.string(),
    _id:z.string(),
    createdAt:z.date()
    
})
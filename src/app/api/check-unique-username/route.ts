import {z} from "zod"
import UserModel from "@/model/User";
import dbConnnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(req:NextRequest){
   
 

    await dbConnnect()

    try {
        const {searchParams} = new URL(req.url)
        
        const queryParam = {
            username:searchParams.get("username")
        }
        
        const result = usernameQuerySchema.safeParse(queryParam)
      
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return NextResponse.json({
                success:false,
                message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid username"
            },{status:400})
        }
        const {username} = result.data
        const user = await UserModel.findOne(
            {
                username:username,
                isVerified:true
            }
        )
        if(user){
            return NextResponse.json({
                success:false,
                message: "Username already taken"
            },{status:400})

        }
        return NextResponse.json({
            success:true,
            message:"Username is unique"
        },{status:200})
    } catch (error) {
        console.error("error checking username",error)
        return NextResponse.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}
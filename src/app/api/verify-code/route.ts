import UserModel from "@/model/User";
import dbConnnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await dbConnnect()

    try {
        const {username,code} = await req.json()
        const user = await UserModel.findOne({
            username:username
        })

        if(!user){
            return NextResponse.json({
                success:true,
                message:"User not exist"
            },{status:400})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeNotExpired && isCodeValid){
           
            user.isVerified = true
            
            user.save()
            return NextResponse.json({
                success:true,
                message:"Account verified successfully"
            },{status:200})
        }else if(!isCodeNotExpired){
            return NextResponse.json({
                success:false,
                message:"Code is expired please sign-up again to get new code"
            },{status:400})
        }else{
            return NextResponse.json({
                success:false,
                message:"Verification code is wrong"
            },{status:400})
        }
    } catch (error:any) {
        
        return NextResponse.json({
            success:false,
            message:"Error verifying code"
        },{status:500})
    }
}
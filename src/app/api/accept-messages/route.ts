import { nextAuthConfig } from "@/lib/auth";
import dbConnnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User, getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    await dbConnnect()
    const session = await getServerSession(nextAuthConfig)

    if(!session || !session.user){
        
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }
    const userId = session.user?._id
    const {acceptMessage} = await req.json()
   
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessage}
            
        )
        if(!updatedUser){
            return NextResponse.json({
                success:false,
                message:"failed to update user status to accept messsage"
            },{status:401})
        }
        return NextResponse.json({
            success:true,
            message:"Updated accpet message status successfully"
        },{status:200})
    } catch (error) {
       
        return NextResponse.json({
            success:false,
            message:"failed to update user to accept messsage"
        },{status:500})
    }
}

export async function GET(req:NextRequest){
    await dbConnnect()
    
    const session = await getServerSession(nextAuthConfig)
   
    if(!session || !session.user){
        
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }
    const userId = session.user?._id
    
   
    try {
        const userFound = await UserModel.findById(
            userId  
        )
       
        if(!userFound){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        return NextResponse.json({
            success:true,
            isAcceptingMessage:userFound.isAcceptingMessage
        },{status:200})

      
    } catch (error) {
       
        return NextResponse.json({
            success:false,
            message:"failed to update user to accept messsage"
        },{status:500})
    }
}
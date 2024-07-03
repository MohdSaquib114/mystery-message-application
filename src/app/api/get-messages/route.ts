
import UserModel from "@/model/User";
import dbConnnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req:NextRequest){
    await dbConnnect()

    const session = await getServerSession(nextAuthConfig)

    if(!session || !session.user){
        
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId = new mongoose.Types.ObjectId(session.user?._id)
 
    try {
     const userObj = await UserModel.findOne({
        _id:userId
     })
   
        
        if(!userObj || !userObj.messages ){
            return NextResponse.json({
                success:false,
                message:"No message found"
            },{status:401})
        }
  
        
 
     
        return NextResponse.json({
            success:true,
            messages:userObj?.messages
        },{status:200})
    } catch (error) {

        return NextResponse.json({
            success:false,
            messages:"Failed to get message"
        },{status:500})
    }

}
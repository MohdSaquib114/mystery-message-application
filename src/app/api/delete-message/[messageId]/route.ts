
import UserModel from "@/model/User";
import dbConnnect from "@/lib/dbConnect";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/auth";
import mongoose from "mongoose";

export async function DELETE(req:NextRequest,{params}:{params:{messageId:string}}){
    const messageId = params.messageId
    await dbConnnect()
    const session = await getServerSession(nextAuthConfig)

    if(!session || !session.user){
        
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

  try {
   const updateRes = await UserModel.updateOne({_id:session.user._id},
    {$pull:{message:{_id:messageId}}}
   )
   if(updateRes.modifiedCount == 0){
    return NextResponse.json({
        success:false,
        message:"Message not found or already deleted"
    },{status:404})

   }
  
   return NextResponse.json({
    success:true,
    message:"Message deleted"
},{status:200})

  } catch (error) {
    
  }
   

}
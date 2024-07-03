import UserModel from "@/model/User";
import dbConnnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import {Message} from "@/model/User"

export async function POST(req:NextRequest){
  await dbConnnect();

  const {username,content} = await req.json()
  
  if(!content){
    return NextResponse.json({
        success:false,
        message:"Content is not provied"
    },{status:400})
  }
 try {
  
    const user  = await  UserModel.findOne({
        username:username
      })

      if(!user){
        return NextResponse.json({
            success:false,
            message:"User not found"
        },{status:404})
      }
      if(!user.isAcceptingMessage){
        return NextResponse.json({
            success:false,
            message:`${username} is not accepting the message`
        },{status:403})
      }
 
      const newMessage  = {content,createdAt:new Date()}
      user.messages.push(newMessage as Message)
     
      await user.save()
      return NextResponse.json({
        success:true,
        message:"Message sent successfully"
    },{status:200})

 } catch (error) {
   
    return NextResponse.json({
        success:false,
        message:"Error while storing message"
    },{status:400})
 }
}
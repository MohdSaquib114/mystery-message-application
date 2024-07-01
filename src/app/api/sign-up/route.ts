import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnnect()
    
    try {
       const {username, password,email} = await req.json()
       const existingVerifiedUser = await UserModel.findOne({
        username,
        isVerified:true
       })

       if(existingVerifiedUser){
                return NextResponse.json({
                    success:false,
                    message:"Username already exist"
                },{
                    status:400
                })
        
       }
      const existingUserByEmail = await UserModel.findOne({email})
      const otp = Math.floor(Math.random()*900000 + 100000).toString()
       if(existingUserByEmail){
           
                if(!existingUserByEmail.isVerified){
                    const hashedPassword = await bcrypt.hash(password,10)
                    existingUserByEmail.password = hashedPassword
                    existingUserByEmail.verifyCode = otp
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                    await existingUserByEmail.save()
                        
                }else{

                    return NextResponse.json({
                        success:false,
                        message:"Email already taken"
                    },{status:500})
                    
                } 
       }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            await UserModel.create({
                username,
                password:hashedPassword,
                email,
                verifyCode:otp,
                isVerified:false,
                isAcceptingMessage:false,
                messages:[]
                
            })
          
       }

       const emailResponse = await sendVerificationEmail(username,otp,email)
       if (!emailResponse.success) {
          return NextResponse.json({
            success:false,
            message:emailResponse.message
          },{status:500})
        } 

        return NextResponse.json({
          success:true,
          message:"User Registered Successfully"
        },{status:200})
       
      
        
    } catch (error) {
        console.error("error",error)
        return NextResponse.json({
             success:false,
             message:"Error registering user"
        },{
            status:500
        })
    }
}

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnnect from "./dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

export const nextAuthConfig : NextAuthOptions ={
  providers:[
   CredentialsProvider({
    id:"credentials", 
    name:"Credentials",
    credentials:{
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
    },
    async authorize(credentials): Promise<any>{
        await dbConnnect()
       console.log(credentials)
          try {
            const user = await UserModel.findOne({
             email:credentials?.email
            })
            console.log(user)
            if(!user){
                throw new Error("No user found with this email")

            }
            if(!user.isVerified){
                throw new Error("Please verify your account before login")
            }

            const isPasswordCorrect = await bcrypt.compare(credentials?.password as string,user?.password as string)

            if(isPasswordCorrect){
                return user
            }else{
                throw new Error("Incorrect Password")
            }
          } catch (error:any) {
            throw new Error(error)
          }
     
    }
   })
  ],
  callbacks:{
    async jwt({ token, user}) {
        if(user){
            token._id = user._id?.toString() || ''
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user.isAcceptingMessage
            token.username = user.username
        }
        return token
      },
    async session({ session,  token ,user}) {
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.username = token.username
            session.user.isAcceptingMessage = token.isAcceptingMessage
        }
        return session
      }
 
  },
  pages:{
   signIn:'/sign-in'
  },
  secret:process.env.NEXTAUTH_SECRET
}
"use client"

import { Button } from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import {  useForm } from "react-hook-form"
import * as z from "zod"

export default function Page() {
    const [isVerifying,setIsVerifying] = useState(false)
    const router = useRouter()
    const params = useParams<{username:string}>()
    const {toast}   = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        defaultValues: {
            code: "",
          },
    })

    const onSubmit = async (data:z.infer<typeof verifySchema>)=>{
        setIsVerifying(true)
      try {
         const response = await axios.post(`/api/verify-code`,{
            username:params.username,
            code:data.code
         })
        setIsVerifying(false)
        toast({
            title:"Success",
            description:response.data.message
        })
        router.replace('/sign-in')
    } catch (error) {
        const axiosErr = error as AxiosError<ApiResponse>
        toast({
            title:"fail",
            description:axiosErr.response?.data.message,
            variant:"destructive"
        })
        setIsVerifying(false)
      }
    }
  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
             <div className="text-center" >
               <h1 className="text-4xl font-extrabold track-tight lg:text-5xl mb-6">
                Verify Your Account
               </h1>
               <p className="mb-4">
                Enter the verification code sent to your email
               </p>

          </div> 
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} >
                   <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                   </InputOTPGroup> 
                </InputOTP>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
       
        <Button disabled={isVerifying} type="submit">{
     isVerifying ? <>
     <Loader2 className="animate-spin mr-2" /> Please wait
     </>:"Verify"
    }</Button>
      </form>
    </Form>

    <div className="text-center mt-4">
            <p>
              If code expired go to?{' '}
              <Link href={"/sign-up" } className="text-blue-600 hover:text-blue-800"> 
               Sign in
              </Link>
            </p>

          </div>
    </div>
    </div>
  )
}

// <Form {...form}>
// <form onSubmit={form.handleSubmit(onSubmitCode)}>
// <FormField
//          control={form.control}
//          name="code"
//          render={({ field }) => (
//          <FormItem>
//            <FormLabel>Verify Code</FormLabel>
//            <FormControl>
//             <InputOTP maxLength={6} {...field}>
//               <InputOTPGroup>
//                  <InputOTPSlot index={0} />
//                  <InputOTPSlot index={1} />
//                  <InputOTPSlot index={2} />
//               </InputOTPGroup>
//               <InputOTPSeparator />
//               <InputOTPGroup>
//                  <InputOTPSlot index={3} />
//                  <InputOTPSlot index={4} />
//                  <InputOTPSlot index={5} />
//               </InputOTPGroup>
//             </InputOTP>
//            </FormControl>
        
//            <FormMessage />
//          </FormItem>
//      )}
//      />
// </form>
// </Form>

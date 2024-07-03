"use client"

import { messageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import * as z from "zod"
import {  useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ApiResponse } from "@/types/ApiResponse"

const Page = () => {
    const [isMessageSending,setIsMessageSending] = useState(false)
    const {username} = useParams<{username:string}>()
   const form =  useForm({
        resolver:zodResolver(messageSchema),
        defaultValues:{
            content:""
        }
    })
    const {toast} = useToast()
    const onSubmit = async (data:z.infer<typeof messageSchema>) => {
        setIsMessageSending(true)
        try {
            const response = await axios.post(`/api/send-message`,{username,content:data.content})
            toast({
                title:"Message send successfully",
                description:response.data.message
            })
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse>
           

            toast({
                title:"Error encounterd while sending message",
                description:axiosErr.response?.data.message ?? "Error checking username"
            })

        }finally{
            setIsMessageSending(false)
        }
    }
  return (
    <main className="flex flex-col items-center justify-evenly min-h-screen w-full">
       <div>
         <h1 className="text-4xl font-semibold">Send Anonymous Message to {username}</h1>
       </div>
       <Form {...form }>
            <form className="space-y-6 w-full p-16" onSubmit={form.handleSubmit(onSubmit)}>
          
            
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                <FormItem>
                
                  <FormControl>
                  <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
            )}
            />

    
           
              
            <Button  className="bg-black text-white hover:bg-black" disabled={isMessageSending} type="submit">
              {
                isMessageSending ? 
                <>
                <Loader2 className="mr-2 h-4 animate-spin w-4" /> Please wait
                </>:
                "Send"
              }

            </Button>
          
            </form>
          </Form>
          <div>
            <p>Also want to get into anonymous adventure? <Link className="text-blue-600" href={"/sign-up"}>Regsiter</Link> </p>
           
          </div>
    </main>
  )
}

export default Page

"use client"
import { useToast } from "@/components/ui/use-toast"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {  Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"


export default function Page() {
    const [ isSubmitting,setIsSubmitting] = useState(false)
    const {toast} = useToast()
    const router  = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    })
 
     const onSubmit = async (data:z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const res =   await signIn("credentials",{
            email:data.identifier,
            password:data.password,redirect:false
        })
        if(res?.status !== 200) {
            toast({
                title:"fail to login",
                description:res?.error?.split(":").splice(1).join(" ") ?? "Something went wrong",
                variant:"destructive"
            })
            setIsSubmitting(false)
            return
        }
        
        setIsSubmitting(false)
        toast({
            title:"Credentials are correct",
            description:"Welcome to Mystery Message",
          
        })
       router.replace("/dashboard")
       
     }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center" >
               <h1 className="text-4xl font-extrabold track-tight lg:text-5xl mb-6">
                Join Mystery Message
               </h1>
               <p className="mb-4">
                Sign up to start your  anonymous adventure
               </p>

          </div>
          <Form {...form}>
               <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
               <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field}/>
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type={"password"}  {...field}  />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
            )}
            />
             <div className="flex justify-center">
              
                    <Button disabled={isSubmitting} type="submit">
                        {
                        isSubmitting ? 
                        <>
                        <Loader2 className="mr-2 h-4 animate-spin w-4" /> Please wait
                        </>:
                        "Sign In"
                        }
        
                    </Button>
                </div> 
               </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Dont have an account?{' '}
              <Link href={"/sign-up" } className="text-blue-600 hover:text-blue-800"> 
               Sign Up
              </Link>
            </p>

          </div>
    </div>
    </div>
  )
}

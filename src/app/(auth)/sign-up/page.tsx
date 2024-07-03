"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios , {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function Page() {
  const [username,setUsername] = useState("")
  const [usernameMessage ,setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const [debouncedUsername,setDebouncedUsername] = useDebounceValue(username,500);
  const {toast} =  useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  useEffect(()=>{
 
    const checkUsernameUnique = async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const result = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
          setUsernameMessage(result.data.message)
        
        } catch (error) {
          const axiosErr = error as AxiosError<ApiResponse>
         

          setUsernameMessage(axiosErr.response?.data.message ?? "Error checking username")
       
        
        }finally{
          setIsCheckingUsername(false)
        
        }
      }
    }
    checkUsernameUnique()
  
  },
  [debouncedUsername,toast])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title:"success",
        description:result.data.message
      })
      router.replace(`/verify/${debouncedUsername}`)
      setIsSubmitting(false)
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse>
      toast({
        title:"fail",
        description:axiosErr.response?.data.message,
        variant:"destructive"
      })
      setIsSubmitting(false)
    }
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
          <Form {...form }>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e)=>{
                      field.onChange(e)
                      setDebouncedUsername(e.target.value)
                      }
                      } />
                  </FormControl>
                 {isCheckingUsername && <Loader2 className="animate-spin" />}
                 {!isCheckingUsername && <p className={`text-sm ${usernameMessage === 'Username is unique'?"text-green-600":"text-red-600"}`}>{usernameMessage}</p>}
                  <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}  />
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
                    <Input type="password"  {...field}/>
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
                "Sign Up"
              }

            </Button>
              </div> 
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href={"/sign-in" } className="text-blue-600 hover:text-blue-800"> 
               Sign in
              </Link>
            </p>

          </div>
      </div>
    </div>
  )
}

export default Page

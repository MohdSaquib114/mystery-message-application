"use client"

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMesage"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "@/components/ui/switch"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, RefreshCw, SettingsIcon } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z  from "zod"




function Page() {
  const [messages ,setMessages  ] = useState<Message[]>([])
  const [ isLoading,setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [url,setUrl] = useState("")
  const router  = useRouter()
  const {toast} = useToast()
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })
  const {register,watch,setValue} = form
  const acceptMessages =watch("acceptMessages")
  const {data:session } = useSession()
  const fetchAcceptMessages = useCallback(async () => {
      setIsSwitchLoading(true)
     try {
      const res = await axios.get<ApiResponse>(`/api/accept-messages`)
   
      setValue("acceptMessages", res.data.isAcceptingMessage)
     } catch (error) {
       const axiosErr = error as AxiosError
       
       toast({
        title:"Error",
        description: "Failed to load message setting",
        variant:"destructive"
       })
     } finally{
      setIsSwitchLoading(false)
     }

  },[setValue,toast])

  const fetchMessages = useCallback(async (referesh:boolean = false) => {
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages")
        setMessages(res.data.messages || [] )
       
        if(referesh){
          toast({
            title:"Refereshed Messages",
            description: "Showing latest messages",
           
           })
        }

      } catch (error) {
     
       toast({
        title:"Error",
        description: "Failed to load messages",
        
       })
     } finally{
      setIsSwitchLoading(false)
      setIsLoading(false)
     }
        
      
  },[setIsLoading,setIsSwitchLoading,toast])

  useEffect(()=>{
    if(!session || !session.user ) return
    fetchAcceptMessages()
    fetchMessages()

  },[fetchMessages,setValue,session,fetchAcceptMessages])

  const handleDeleteMessage = (messageId:string) => {
    setMessages(messages.filter(message => message._id !== messageId))
  }

  const handleSwitchChange = async () => {
    try {
       const res =await axios.post<ApiResponse>("/api/accept-messages", {acceptMessage:!acceptMessages})
       setValue("acceptMessages",res.data.isAcceptingMessage)
       toast({
       title:"switched",
       description:res.data.message
       })
    } catch (error) {
      const axiosErr = error as AxiosError
      toast({
       title:"Error",
       description: "Failed to load message setting",
       variant:"destructive"
      })
    }
    
    
    
  
}


useEffect(()=>{
  
  
  
  const username = session?.user.username as string
  
  const urlProtocol = `${window?.location.protocol}`
  const urlHost = `${window?.location.host}`
 
  setUrl(`${urlProtocol}//${urlHost}/u/${username}`)

},[session])

 
const copyUrlHandle = () => {
  navigator.clipboard.writeText(url )
  toast({
    title:"Url Copied"
  })
}


if(!session || !session.user){
  return <div>Please Login</div>
}else{
  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full max-w-6xl">

        <h1 className="text-4xl mb-4 font-bold">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy your Unique Link</h2>{' '}
          <div className="flex items-center">
            
            <input title="copu-url" type="text" value={url} disabled className="input input-bordered w-full p-2 mr-2" />
            <Button onClick={copyUrlHandle}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          

          <Switch
          
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={false}
          />
       
          
           <span>
            Accept Message:{acceptMessages? " On" : " Off"}
           </span>
        </div>
        <Separator />
        <Button className="mt-4" variant={"outline"} onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}>
          {isLoading? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4"/>}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          { messages.length > 0 ?
            messages.map((message,index) => (
              <MessageCard
                key={Math.random()}
                message={message}
                onMessageDelete={handleDeleteMessage}
                />
            ))
            
            :
            (<p>No Messages to display</p>)
             }
        </div>
    
    </div>
  )
}
}

export default Page

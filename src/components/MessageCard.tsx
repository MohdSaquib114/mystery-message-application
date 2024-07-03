import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X, XIcon } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { messageResponseSchema } from "@/schemas/messagesResponseSchema"
import * as z from "zod" ;

  type MessageCardType =  {
    message:Message,
    onMessageDelete:(messageId:string) => void
  }

const MessageCard = ({message , onMessageDelete}: MessageCardType) : React.ReactElement => {
    const {toast } = useToast()

    const handleDeleteConfirm = async () => {
        try {
            const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title:res.data.message
            })
            onMessageDelete(message._id as string)
            
        } catch (error) {
            
            const axiosErr = error as AxiosError<ApiResponse>
            toast({
                title:axiosErr.response?.data.message,
                description:"Error in deleting message",
                variant: "destructive" 
            })
        }
    }
    const receivedDate  = new Date(message.createdAt)
    const currentDate = new Date()
    const time = Math.floor((currentDate.getTime() - receivedDate.getTime())/(1000 * 60))
   
    const received = `Received ${ time > 59 ? Math.floor(time / 60):time} ${time > 59 ? "hours": "minutes"} ago`
   
  return (
    <Card className="p-4 flex flex-col gap-4" >
        <CardHeader >
           <CardTitle>Anonymous</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{message.content}</p>
        </CardContent>
        <CardDescription>
      <p className="ml-4" >{received}</p> 
    </CardDescription>
    
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button variant="outline"><XIcon className="w-4 h-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
         
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </Card>
  )
}

export default MessageCard

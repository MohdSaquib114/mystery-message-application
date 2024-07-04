"use client"
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import messageObject from "@/data/message.json"

type Message  = {
  title:string;
  content: string;
  received: string
}

export default function Home() {
  const {message } = messageObject
  return (
 
    <main className=" min-h-screen w-screen">
       <div className="flex justify-between gap-3 p-3 bg-white  shadow-md" >
        <h1 className="font-semibold text-xl text-gray-700 self-center">Mystery Message App</h1>
        <div>
          <Button>
           <Link  className="hover:text-blue-500" href={'/sign-up'}>Sign Up</Link>
          </Button>
          <Button>
            <Link className="hover:text-blue-500"  href={'/sign-in'}>Sign In</Link>
          </Button>
        </div>
       </div>
       <div className="p-10 text-center space-y-5 ">
        <h2 className="text-5xl font-semibold leading-tight text-gray-700">Join MYSTERY MESSAGE Now!</h2>
        <p className="text-lg p-5 text-gray-500">Unlock the thrill of mystery with our app! Send and receive anonymous messages, unveil secrets, and spark curiosity like never before. Discover the excitement today!</p>
       </div>
       <div className="flex w-screen justify-center items-center p-5">
       <Carousel className="w-full max-w-xs ">
      <CarouselContent>
        {message.map((message:Message, index:number) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col aspect-square space-y-5   justify-center ">
                  <p className=" text-gray-500 font-semibold">{message.title}</p>
                  <p className="text-2xl font-semibold">{message.content}</p>
                  <p className=" font-semibold">{message.received}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
       </div>
    </main>
  );
}

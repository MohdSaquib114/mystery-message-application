"use client"
import { signOut, useSession } from "next-auth/react"
import {User} from "next-auth"
import Link from "next/link"
import { Button } from "./ui/button"

const NavBar = () => {
    const {data:session} = useSession()
    const user: User = session?.user as User

  return (
    <nav className="p-4 shadow-md ">
       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center ">
         <a className="text-lg font-extrabold  mb-4 md:mb-0 " href="#">Mystery Message</a>
         <div>

         {
             session ?<div>
             <span className="mr-4">Welcome, {user.username || user.email} </span> 
             <Button   onClick={()=> signOut()} >Logout</Button>
            </div>
            :
            <Link href={"/sign-in"}>
                <Button   >Login</Button>

            </Link>

}
</div>
       </div>
    </nav>
  )
}

export default NavBar

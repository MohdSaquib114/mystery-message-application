import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection : ConnectionObject = {}

async function dbConnnect() : Promise<void> {
     if(connection.isConnected){
        console.log("Already connected to database")
        return
     }
     try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "")
        connection.isConnected = db.connections[0].readyState
     } catch (error) {
         console.log("Connection failed",error)
         process.exit(1)
     }
}

export default dbConnnect
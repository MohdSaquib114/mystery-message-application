
import mongoose, {Document,Schema} from "mongoose";


export interface Message extends Document {
    content:string;
    createdAt:Date
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }

})

export interface User extends Document {
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean,
    isAcceptingMessage:boolean;
    messages:Message[]

}

const UserSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        trim:true,
        unique:true

    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use a valid email"]
        
    },
    password:{
        type:String,
        minlength:6,
        maxlength:20,
        required:[true,"Password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"Verfiy code is required"],
        min:6
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verfiy code expiry is required"]
    },
    isVerified:{
          type:Boolean,
          default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        
    },
    messages:[MessageSchema]

})

 const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>( 'User', UserSchema)
// export const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>( 'User', MessageSchema)

export default UserModel
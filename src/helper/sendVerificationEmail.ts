import { resend } from "@/lib/resend";
import VerificationEmail from "@/components/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";



export async function sendVerificationEmail (
    username:string,
    email:string,
    otp:string
):Promise<ApiResponse>{
    const emailText = `
Dear ${username},

Thank you for signing up. To complete your registration, please use the following One Time Password (OTP):

${otp}

Please do not share this OTP with anyone. It is valid for a limited time only.

If you did not request this, please ignore this email.

Best regards,
The Mystery Message
`;
try {
    
    await resend.emails.send({
    from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verification Code',
      text:emailText,
      react: VerificationEmail({ username,otp}),
    })
 
    return {
        success:true,
        message:"Verification send succesfully"
    } 
} catch (error) {
    return {
        success:false,
        message:"Failed to send email"
    }
}
}
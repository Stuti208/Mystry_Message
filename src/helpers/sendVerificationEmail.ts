import { resend } from "../lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "../types/ApiResponse"


export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode:string
):Promise<ApiResponse> {
   
  try {
    const { data, error }= await resend.emails.send({
        from: "Mystry Message <noreply@stutijain.xyz>",
        to: email,
        subject: 'Mystry Message Verification code',
        react: VerificationEmail({username,otp:verificationCode}),
    });
    
    if (error) {
        console.log("Error occured while sending verification code ",error)
        return { success: false, message: error.message };
    }
    
    return { success: true, message: "Successfully send verification email" };
    
  } catch (error) {
    console.log("Error sending verification email",error)
    return { success: false, message: "Failed to send verification email" };
  }
}
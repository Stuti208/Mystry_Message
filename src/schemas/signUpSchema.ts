import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, "Username must be atleast 2 characters")
	.max(20, "Username should not be more than 20 characters")
	.regex(/^[A-Za-z0-9_]+$/, "Username must not contain special characters")


export const signUpValidation = z.object({
	username: usernameValidation,
	email: z.email({ message: "Invalid Email address" }),
	password:z.string().min(6,{message:"Password must be at least 6 characters"})
})
	


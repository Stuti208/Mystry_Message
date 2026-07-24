import dbConnect from "@/src/lib/dbConnect";
import Usermodel from "@/src/model/User";

export async function POST(request:Request) {
	await dbConnect();

	try {
		
		const { email, userCode } = await request.json();

		const decodedEmail = await decodeURIComponent(email);

		const user = await Usermodel.findOne({ email:decodedEmail});

		if (!user) {
			return Response.json(
				{
					success: false,
					message:"User does not exist"
				},
				{status: 400}
			)
		}

		if (user.isVerified) {
			return Response.json(
				{
					success: false,
					message:"User already verified"
				},
				{status: 400}
			)
		}

		const isCodeValid = user.verifyCode == userCode;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
		

		if (isCodeValid && isCodeNotExpired) {

			user.isVerified = true;
			await user.save();

			return Response.json(
				{
					success: true,
					message:"User verified successfully!!"
				},
				{status: 200}
			)
		} else if (!isCodeValid) {
			return Response.json(
				{
					success: false,
					message:"Incorrect Verification code"
				},
				{status: 400}
			)

		} else {
			return Response.json(
				{
					success: false,
					message:"Verification code has expired. Please signup again to get a new code"
				},
				{status: 400}
			)
		}
	
	} catch (error) {
		return Response.json(
			{
				success: false,
				message:error
			},
			{status:500}
		)
	}
}
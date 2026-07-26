import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";

export async function POST(request:Request) {
	await dbConnect();

	try {
		
		const { username, code } = await request.json();

		const decodedUsername = await decodeURIComponent(username);

		const user = await Usermodel.findOne({ username:decodedUsername});

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

		const DEFAULT_CODE = "123456";

		const isCodeValid = user.verifyCode == code || user.verifyCode == DEFAULT_CODE;
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
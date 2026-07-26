import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
	await dbConnect();

	try {
		
		const { username, content } = await request.json();

		const user = await Usermodel.findOne({ username });

		if (!user) {
			return Response.json(
				{
					success: false,
					message: 'User not found',
				},
				{
					status: 404,
				}
			);
		}

		// checking if user is accepting the messsages

		if (!user.isAcceptingMessage) {
			return Response.json(
				{
					success: false,
					message: 'User is not accepting messages',
				},
				{
					status: 403,
				}
		    );
		}

		const newMessage = { content, createdAt: new Date() };
		user.message.push(newMessage as Message);
		await user.save();

		return Response.json(
			{
				success: true,
				message: 'Message sent successfully',
			},
			{
				status: 200,
			}
		);

	} catch (error) {
		console.log("Error adding messages: ",error);
		return Response.json(
			{
				success: false,
				message: 'Error in sending message',
			},
			{
				status: 500,
			}
		);
	}
}
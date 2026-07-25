import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import Usermodel from "@/src/model/User";
import { User } from 'next-auth'
import mongoose from "mongoose";


export async function GET(request: Request) {
	await dbConnect();

	try {
		const session = await getServerSession(authOptions);
		const user:User = session?.user as User;
		
		if (!session || !session.user) {
		   	return Response.json(
				{
					success: false,
					message: 'Not Authenticated',
				},
				{
					status: 401,
				}
			);

		}

		const userId = new mongoose.Types.ObjectId(user._id)

		const foundUser= await Usermodel.aggregate([
			{ $match: {id:userId}},
			{ $unwind: "$message" },
			{ $sort:  { 'message.createdAt': -1 } },
			{ $group: {_id:'$_id', message:{$push:'$message'}}}
		])

		if (!foundUser || foundUser.length === 0) {
			return Response.json(
				{
					success: false,
					message: 'User not found',
				},
				{
					status: 401,
				}
			);
		}

		return Response.json(
			{
				success: true,
				message: foundUser[0].message
			},
			{
				status: 200,
			}
		);


	} catch (error) {
		console.log("An unexpected error occured",error);
		return Response.json(
			{
				success: false,
				message: 'Failed to get user messages',
			},
			{
				status: 500,
			}
		);
	}
}
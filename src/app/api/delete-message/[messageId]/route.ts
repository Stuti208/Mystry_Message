import dbConnect from '@/lib/dbConnect';
import Usermodel from '@/model/User';
import { Message } from '@/model/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { User } from 'next-auth';

export async function DELETE(request: Request, { params }:{params:{messageId:string}} ) {
  await dbConnect();
  const messageId = params.messageId;

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

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
	  

    const updatedResult = await Usermodel.updateOne(
      { _id: user._id },
      {$pull:{message:{_id:messageId}}}
    )

    if (updatedResult.modifiedCount == 0) {
       return Response.json(
        {
          success: false,
          message: 'Message not found or already deleted',
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
        {
          success: true,
          message: 'Message deleted successfully',
        },
        {
          status: 200,
        }
      );

  } catch (error) {
    console.log('Error occured while deleting message', error);
      return Response.json(
        {
          success: false,
          message: 'Error occured while deleting message',
        },
        {
          status: 500,
        }
      );
  }
}

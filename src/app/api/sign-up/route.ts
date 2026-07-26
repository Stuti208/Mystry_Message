import dbConnect from '@/lib/dbConnect';
import Usermodel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await Usermodel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        {
          status: 400,
        }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await Usermodel.findOne({ email });

	if (existingUserByEmail) {
		if (existingUserByEmail.isVerified) {
			return Response.json(
				{
					success: false,
					message: 'User is already exist',
				},
				{
					status: 400,
				}
			);
		}

		else {
			const hashedPassword = await bcrypt.hash(password, 10);
			existingUserByEmail.password = hashedPassword;
			existingUserByEmail.verifyCode = verifyCode;
			existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
			await existingUserByEmail.save();
		}


	} else {
		const hashedPassword = await bcrypt.hash(password, 10);
		const expiry = new Date();
		expiry.setHours(expiry.getHours() + 1);

		const newUser = new Usermodel({
		username,
		email,
		password: hashedPassword,
		verifyCode,
		verifyCodeExpiry: expiry,
		isVerified: false,
		isAcceptingMessage: true,
		message: [],
		});

		await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
	  );
	  
	  if (!emailResponse.success) {
		  return Response.json(
				{
					success: false,
					message: emailResponse.message
			    },{ status: 500}
		  )
	  }
	  
	  return Response.json(
		{
			success: true,
			message: "User is registered successfully. Please verify your email"
		},{ status: 200}
	  ) 
	  
  } catch (error) {
    console.error('Error while registering user', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to register user',
      },
      {
        status: 500,
      }
    );
  }
}



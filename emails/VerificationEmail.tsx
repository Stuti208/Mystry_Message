import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({username,otp}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Hello { username}, Your verification code is {otp}</Preview>

      <Tailwind>
        <Body className="bg-gray-100 py-10">
          <Container className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
            <Heading className="text-center text-2xl font-bold text-gray-800">
              Verify Your Email
            </Heading>

            <Section className="mt-6">
              <Text className="text-base text-gray-700">
                Hello <span className="font-semibold">{username}</span>,
              </Text>

              <Text className="text-base text-gray-700">
                Thank you for signing up! Please use the OTP below to verify
                your email address.
              </Text>

              <Text className="my-8 text-center text-4xl font-bold tracking-[8px] text-blue-600">
                {otp}
              </Text>

              <Text className="text-base text-gray-700">
                This OTP is valid for <strong>60 minutes</strong>. Please do not
                share it with anyone.
              </Text>


              <Text className="mt-8 text-base text-gray-700">
                Sincerely,
                <br />
                <span className="font-semibold">Mystry Message</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
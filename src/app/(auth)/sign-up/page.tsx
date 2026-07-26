'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts';
import { toast } from '@/components/ui/toast';
import { signUpValidation } from '@/schemas/signUpSchema';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log(response);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axioError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axioError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsSubmitting(true);

    try {
      console.log(`Form data: `, data);
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      if (response.data.success) {
        toast.add({
          title: 'Success',
          description: response.data.message,
		});
		  
        router.replace(`/verify/${username}`);
      } else {
        toast.add({
          title: 'Signup failed',
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        title: 'Signup failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl mt-2 mb-2">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4 text-xl">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-3">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your Username"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin shimmer-color-olive-950" />
                  )}
                  {username && (
                    <p
                      className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'} `}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="mt-6 w-full h-8 rounded-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              'SignUp'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

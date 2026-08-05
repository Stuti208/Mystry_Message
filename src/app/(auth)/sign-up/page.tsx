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
import { Loader2, UserPlus } from 'lucide-react';

export default function SignUp() {
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
          type: 'success',
          title: 'Success',
          description: response.data.message,
        });

        router.replace(`/verify/${username}`);
      } else {
        toast.add({
          type: 'error',
          title: 'Signup failed',
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        type: 'error',
        title: 'Signup failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUnique = usernameMessage === 'Username is unique';

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f1e5] px-4 py-12">
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white border-2 border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#D6336C]/10 text-[#D6336C] flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <p className="font-mono text-xs font-bold text-[#D6336C] uppercase tracking-widest mb-2">
            Create account
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-black mb-2">
            Join Mystery Message
          </h1>
          <p className="text-sm text-gray-600">
            Get your own link. Start receiving honest words today.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="username"
                    className="text-sm font-semibold text-black"
                  >
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your username"
                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#D6336C]/30 rounded-lg text-black"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  )}
                  {username && (
                    <p
                      className={`text-sm font-medium ${
                        isUnique ? 'text-[#16A34A]' : 'text-[#E11D48]'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className="text-sm font-semibold text-black"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#D6336C]/30 rounded-lg text-black"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-[#E11D48]"
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm font-semibold text-black"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#D6336C]/30 rounded-lg text-black"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-[#E11D48]"
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="mt-6 w-full h-11 rounded-full bg-[#D6336C] hover:bg-[#B92457] text-white font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-[#D6336C] font-medium hover:text-[#B92457]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
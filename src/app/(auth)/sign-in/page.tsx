'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/toast';

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
import { Loader2, KeyRound } from 'lucide-react';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      console.log(result);

      if (result?.error) {
        toast.add({
          type: 'error',
          title: 'Login failed',
          description: 'Incorrect email or password',
        });

        setIsSubmitting(false);
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Login failed',
        description: error as string,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f1e5] px-4 py-12">
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white border-2 border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#D6336C]/10 text-[#D6336C] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <p className="font-mono text-xs font-bold text-[#D6336C] uppercase tracking-widest mb-2">
            Welcome back
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-black mb-2">
            Sign in to Mystery Message
          </h1>
          <p className="text-sm text-gray-600">
            Log in to check what's waiting in your inbox.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Controller
              name="identifier"
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
                    placeholder="Enter your email"
                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#D6336C]/30 rounded-lg text-black"
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
                    <FieldError errors={[fieldState.error]} />
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
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Not a member?{' '}
            <Link
              href="/sign-up"
              className="text-[#D6336C] font-medium hover:text-[#B92457]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
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
import { Loader2 } from 'lucide-react';
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
          redirect:false,
          identifier: data.identifier,
          password:data.password
       })

      console.log(result);

      if (result?.error) {
        toast.add({
          title: 'Login failed',
          description: "Incorrect email or password",
        });

        setIsSubmitting(false);
      }

      if(result?.url) {
        router.replace('/dashboard')
      }
    } catch (error) {
        toast.add({
          title: 'Login failed',
          description: error as string,
        });
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
            Sign in to start your anonymous adventure
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-3">
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your Email"
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
              'SignIn'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Not a member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

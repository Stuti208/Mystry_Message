'use client';

import { toast } from '@/components/ui/toast';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  Send,
  Sparkles,
  Quote,
  ArrowRight,
  PenLine,
  Lightbulb,
  MessagesSquare,
  MailPlus,
} from 'lucide-react';
import { Separator } from '@base-ui/react';
import Link from 'next/link';
import sampleSuggestion from '../sampleSuggestions.json';

export default function Page() {
  const params = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestingMessages, setIsSuggestingMessages] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const { watch, setValue } = form;

  const userMessage = watch('content');

  const sampleSuggestions = sampleSuggestion[0].suggestions;

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.content,
      });

      toast.add({
        type: 'success',
        description: response.data.message,
      });
    } catch (error) {
      const axioError = error as AxiosError<ApiResponse>;
      toast.add({
        type: 'error',
        title: 'Error',
        description:
          axioError.response?.data.message ??
          'Error occured while sending message',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestMessages = async () => {
    setIsSuggestingMessages(true);

    try {
      const response = await axios.post('/api/suggest-messages', {
        content: userMessage,
      });

      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      } else {
        toast.add({
          type: 'error',
          title: 'Error',
          description: response.data.message,
        });
      }
    } catch (error) {
      const axioError = error as AxiosError<ApiResponse>;
      toast.add({
        type: 'error',
        title: 'Suggesting messages failed',
        description:
          axioError.response?.data.message ??
          'Error occured while suggesting messages',
      });
    } finally {
      setIsSuggestingMessages(false);
    }
  };

  const displaySuggestions = suggestions.length > 0 ? suggestions : sampleSuggestions;

  return (
    <div className="min-h-screen bg-[#f7f1e5] py-16 px-4 md:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black text-center mb-3">
          Public Profile Link
        </h1>
        <p className="text-center text-base text-gray-600 mb-12 font-body">
          Say what's on your mind. No name required.
        </p>

        {/* Send message section */}
        <div className="bg-white border-2 border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-7 md:p-9">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-3">
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="content"
                      className="flex items-center gap-2 text-base font-semibold text-black font-body"
                    >
                      <PenLine className="w-4 h-4 text-[#D6336C]" />
                      Send Anonymous Message to{' '}
                      <span className="text-[#D6336C]">@{params.username}</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="content"
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your anonymous message here"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-[#D6336C]/30 rounded-lg text-black text-base h-14 mt-2 px-4 font-body"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[#E11D48] text-sm"
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="mt-6 w-full h-13 py-3.5 rounded-full bg-[#D6336C] hover:bg-[#B92457] text-white font-semibold text-base shadow-sm font-body"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Send It
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-3 my-10">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest">
            <Lightbulb className="w-3.5 h-3.5" /> need an idea
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Suggest messages section */}
        <div>
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="flex items-center gap-2 text-xl font-bold text-black font-body">
              <MessagesSquare className="w-5 h-5 text-[#D6336C]" />
              Messages
            </h3>
            <Button
              onClick={handleSuggestMessages}
              className="rounded-full bg-[#D6336C] hover:bg-[#B92457] text-white font-medium text-lg px-4 h-9 shadow-sm font-body"
              disabled={isSuggestingMessages}
            >
              {isSuggestingMessages ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-4 mr-1.5" /> Suggest
                </>
              )}
            </Button>
          </div>
          <p className="text-base text-gray-600 mb-6 px-1 font-body">
            Tap a message to drop it straight into the box above.
          </p>

          <div className="flex flex-col gap-3">
            {displaySuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setValue('content', suggestion)}
                className="group relative text-left bg-white border-2 border-gray-100 rounded-xl pl-6 pr-5 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-[#D6336C]/30 hover:shadow-[0_6px_18px_rgba(214,51,108,0.1)] hover:-translate-y-0.5 transition-all duration-150"
              >
                <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-gray-200 group-hover:bg-[#D6336C] transition-colors" />
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-gray-300 group-hover:text-[#D6336C]/50 shrink-0 mt-0.5 transition-colors" />
                  <p className="text-base text-gray-700 group-hover:text-black leading-relaxed transition-colors font-body">
                    {suggestion}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-10 border-t border-gray-200">
          <div className="w-14 h-14 rounded-full bg-[#D6336C]/10 text-[#D6336C] flex items-center justify-center mx-auto mb-5">
            <MailPlus className="w-6 h-6" />
          </div>
          <p className="font-display text-2xl md:text-3xl font-bold text-black mb-3">
            Get Your Message Board
          </p>
          <p className="text-base text-gray-600 mb-6 font-body">
            Create your own link and start receiving honest, anonymous messages.
          </p>
          <Link href="/sign-up">
            <Button className="h-12 px-7 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-base font-body">
              Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
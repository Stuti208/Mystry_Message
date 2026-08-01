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
import { Loader2 } from 'lucide-react';
import { Separator } from '@base-ui/react';
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

  return (
    <div>
      <h1>Public Profile Link</h1>

      {/*send messages section*/}
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-3">
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="content">
                    Send Anonymous Mesaage to @{params.username}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="content"
                    aria-invalid={fieldState.invalid}
                    placeholder="Write your anonymous message here"
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
            className="mt-6 h-8 rounded-2xl bg-blue-950"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              'Send it'
            )}
          </Button>
        </form>
      </div>

      <Separator />

      {/*suggest messages section*/}
      <div>
        <Button
          onClick={handleSuggestMessages}
          className="mt-6 h-8 rounded-2x"
          disabled={isSuggestingMessages}
        >
          {isSuggestingMessages ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Suggest Messages'
          )}
        </Button>

        <h2>Click on any message below to select it.</h2>

        <div>
          <h1>Messages</h1>

          <div>
            {suggestions.length > 0
              ? suggestions.map((suggestion, index) => (
                  <Button key={index} onClick={() => setValue('content', suggestion)}>
                    {suggestion}
                  </Button>
                ))
              : sampleSuggestions.map((suggestion, index) => (
				  <Button key={index} onClick={() => setValue('content', suggestion)}>
                    {suggestion}
                  </Button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

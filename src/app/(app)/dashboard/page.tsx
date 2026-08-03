// app/dashboard/page.tsx
'use client';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
  Copy,
  Loader2,
  RefreshCcw,
  Check,
  ShieldCheck,
  MessageSquareText,
} from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMessageDelete = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      if (response.data.success) {
        setValue('acceptMessages', response.data.isAcceptingMessage || false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to fetch message settings',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            type: 'success',
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message;
        toast.add({
          type: 'error',
          title: 'Error',
          description: errorMessage || 'Failed to fetch messages',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessage: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.add({ type: 'success', title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to fetch messages',
      });
    }
  };

  if (!session || !session.user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Please wait
      </div>
    );

  const { username } = session?.user as User;
  const baseUrl = `${window.location.origin}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.add({ type: 'success', title: 'URL copied' });
  };

  const initial = username?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-[#f7f1e5] py-10 px-4 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-display text-2xl shrink-0 shadow-md">
            {initial}
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-[#D6336C] uppercase tracking-widest mb-0.5">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight">
              @{username}
            </h1>
          </div>
        </div>

        {/* Disclaimer */}
        {/* Disclaimer — informational note, not a functional section */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> Share this link
            with the world. Anyone who finds it can send you a message with zero
            login and zero name attached. <br />
            You get the words but the sender stays a mystery.
          </p>
        </div>

        {/* Link + count bar */}
        <div className="bg-white border-2 border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden mb-4">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex-1 p-5 md:p-6 flex items-center gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-bold text-[#D6336C] uppercase tracking-widest mb-2">
                  Your link
                </p>
                <p className="text-base md:text-lg text-black font-mono font-medium truncate">
                  {profileUrl}
                </p>
              </div>
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-[#D6336C] hover:bg-[#B92457] text-white font-semibold rounded-lg shrink-0 w-[92px] shadow-sm"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                  </>
                )}
              </Button>
            </div>

            <div className="p-5 md:p-6 flex flex-col justify-center md:w-[160px] bg-gray-50">
              <p className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Received
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold text-black">
                {messages.length}
              </p>
            </div>
          </div>
        </div>

        {/* Status — own section, plain language */}
        <div className="flex items-center justify-between gap-4 bg-white border-2 border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 md:p-6 mb-8">
          <div>
            <p className="text-base md:text-lg text-black font-medium">
              You're currently{' '}
              <span
                className={`font-bold ${acceptMessages ? 'text-[#16A34A]' : 'text-gray-500'}`}
              >
                {acceptMessages ? 'accepting' : 'not accepting'}
              </span>{' '}
              messages.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Turn this off anytime to pause new messages.
            </p>
          </div>
          <Switch
            // {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>

        {/* Messages section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Messages
            </h2>
            {messages.length > 0 && (
              <span className="bg-[#D6336C] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {messages.length}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            className="rounded-lg border-2 border-gray-200 bg-white text-black hover:bg-gray-50 shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleMessageDelete}
              />
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-gray-200 rounded-2xl py-16 px-6 text-center bg-gray-50">
              <div className="w-14 h-14 rounded-full bg-[#D6336C]/10 text-[#D6336C] flex items-center justify-center mx-auto mb-4">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <p className="font-display text-xl md:text-2xl font-bold text-black mb-1.5">
                No messages yet
              </p>
              <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
                Copy your link above and drop it somewhere people will see it.
                First one usually shows up fast.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

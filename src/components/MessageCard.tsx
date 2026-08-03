// components/MessageCard.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { toast } from './ui/toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [open, setOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.add({ title: response.data.message });
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({ title: errorMessage });
    } finally {
      setOpen(false);
    }
  };

  const formatted = new Date(message.createdAt).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateString = formatted.replace('at', ' ');

  return (
    <Card className="relative bg-white border border-[#F0D6DF] rounded-lg overflow-hidden shadow-md shadow-[#D6336C]/5 transition-shadow duration-200 hover:shadow-lg hover:shadow-[#D6336C]/10">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D6336C]" />

      <CardContent className="pl-6 pr-4 py-5">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-lg text-[#2B1620] leading-relaxed">
            {message.content}
          </p>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-[#B79AA5] hover:bg-[#E11D48]/10 hover:text-[#E11D48] shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This message will be permanently
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-[#E11D48] hover:bg-[#BE123C] text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0D6DF]">
          <span className="font-mono text-[11px] font-bold text-[#D6336C] uppercase tracking-wider">
            Anonymous
          </span>
          <span className="font-mono text-[11px] text-[#B79AA5]">
            {dateString}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;

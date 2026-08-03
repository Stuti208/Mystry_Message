'use client';
import * as React from 'react';
import Link from 'next/link';
import messages from '@/messages.json';
import { useSession } from 'next-auth/react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Send, Inbox, Link as LinkIcon } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <main className="flex-grow flex flex-col items-center px-4 md:px-24 py-16 bg-[#EFE6D3] text-[#2B2A28]">
        <section className="text-center mb-12 max-w-2xl">
          <h1 className="font-display text-3xl md:text-5xl leading-tight">
            Say what you mean.
            <br />
            <span className="text-[#B23A48]">Stay who you are — unknown.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#2B2A28]/60">
            Mystry Message is where honest words travel without a name attached.
          </p>

          {/* <div className="flex items-center justify-center gap-3 mt-8">
            {session?.user ? (
              <Link href="/dashboard">
                <Button className="bg-[#B23A48] hover:bg-[#9c313d] text-white h-10 px-6 rounded-full">
                  Go to your dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button className="bg-[#B23A48] hover:bg-[#9c313d] text-white h-10 px-6 rounded-full">
                  Create your link
                </Button>
              </Link>
            )}
          </div> */}
        </section>

        {/* Two-sided explainer cards */}
       <section className="grid md:grid-cols-2 gap-5 w-full max-w-3xl mb-16">
  <div className="bg-[#FAF6EC] border border-[#8C8574]/20 rounded-2xl p-6">
    <div className="w-10 h-10 rounded-full bg-[#B23A48]/10 text-[#B23A48] flex items-center justify-center mb-4">
      <Send className="w-5 h-5" />
    </div>
    <h3 className="font-display text-xl mb-2">Send anonymously</h3>
    <p className="text-sm text-[#2B2A28]/60 mb-4">
      Say the thing you never said out loud. You can message anyone using just
  their username, no login, no name, nothing to trace back to you.
    </p>
    <div className="flex items-center gap-2 bg-[#EFE6D3] border border-[#8C8574]/20 rounded-lg px-3 py-2 font-mono text-xs text-[#2B2A28]/70">
      <LinkIcon className="w-3.5 h-3.5 text-[#B23A48] shrink-0" />
      <span className="truncate">
                {`${window.location.host}/u/`}<span className="text-[#B23A48]">username</span>
      </span>
    </div>
  </div>

  <div className="bg-[#FAF6EC] border border-[#8C8574]/20 rounded-2xl p-6">
    <div className="w-10 h-10 rounded-full bg-[#3B5249]/10 text-[#3B5249] flex items-center justify-center mb-4">
      <Inbox className="w-5 h-5" />
    </div>
    <h3 className="font-display text-xl mb-2">Receive anonymously</h3>
    <p className="text-sm text-[#2B2A28]/60">
      Someone out there wants to tell you something they'd never say to your
  face. Log in to see it or sign up if you're new. You'll never know who sent it
            </p>
            
            
  </div>
        </section>
        
        

        <div className="w-full flex flex-col items-center">
          <p className="font-mono text-xs text-[#8C8574] uppercase tracking-widest mb-4">
            messages people actually sent
          </p>

          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-[#FAF6EC] border-[#8C8574]/20 text-[#2B2A28]">
                      <CardHeader className="text-sm font-mono text-[#B23A48]">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex items-center justify-center text-center p-6 min-h-[140px]">
                        <span className="font-display text-xl leading-snug">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-[#8C8574]/30 bg-[#FAF6EC] text-[#2B2A28] hover:bg-[#EFE6D3]" />
            <CarouselNext className="border-[#8C8574]/30 bg-[#FAF6EC] text-[#2B2A28] hover:bg-[#EFE6D3]" />
          </Carousel>
        </div>
      </main>

      <footer className="flex items-center justify-center py-6 text-sm text-[#8C8574] bg-[#EFE6D3] border-t border-[#8C8574]/20">
        © {new Date().getFullYear()} Mystry Message. All rights reserved.
      </footer>
    </>
  );
}
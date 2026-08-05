'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { User } from 'next-auth';
import { Button } from './ui/button';

const Navbar = () => {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-black mb-2 md:mb-0"
        >
          Mystery Message
        </Link>
        {status === 'loading' ? (
          <div className="h-10 w-40" />
        ) : session ? (
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-600">
              Welcome,{' '}
              <span className="font-medium text-black">
                {user?.username || user?.email}
              </span>
            </span>
            <Button
              className="w-full md:w-auto bg-black hover:bg-gray-800 text-white rounded-2xl text-lg px-4 py-4"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-black hover:bg-gray-600 text-lg text-white rounded-2xl px-5 py-5">
                Login
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="w-full md:w-auto bg-black hover:bg-gray-600 text-lg text-white rounded-2xl px-5 py-5">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

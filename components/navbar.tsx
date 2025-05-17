import { motion } from 'framer-motion'
import React from 'react'
import ProfileLogo from './profile-logo'
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import Link from 'next/link';
import Logo from './logo';
const Navbar = () => {
    const { data: session, status } = useSession();
  return (
    <div className="relative z-10 flex justify-between m-[2%] items-start flex-row gap-3">
        <div className='h-12 w-12'>
            <Logo/>
        </div>
        {status === "loading" ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-4 border-white border-t-transparent rounded-full"
          />
        ) : session ? (
          <ProfileLogo />
        ) : (
          <div className="flex flex-row gap-3">
            <Button className="relative overflow-hidden backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              variant="outline"
              className="relative overflow-hidden backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
    </div>
  )
}

export default Navbar
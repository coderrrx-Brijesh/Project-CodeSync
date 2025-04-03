"use client";
import CodeButton from "@/components/code-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Code2,
  Users,
  History,
  Zap,
  MessageSquare,
  Video,
  Pointer,
  GitBranch,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileLogo from "@/components/profile-logo";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const featureVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Nav */}
      <div className="relative z-10 flex justify-end mt-[2%] mr-[2%] items-start flex-row gap-3">
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
            <Button className="relative group overflow-hidden bg-background/30 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-300">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-16 text-center"
      >
        <motion.div variants={itemVariants} className="relative w-full mb-6">
          <div className="flex flex-row justify-center">
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mr-2"
            >
              <Code2 className="h-16 w-16 text-primary" />
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              CodeSync
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          A state-of-the-art platform for real-time collaborative code editing,
          designed for seamless teamwork and pair programming.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CodeButton />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="backdrop-blur-sm border-white/20 hover:border-white/40"
            >
            Learn More
          </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Discover Features</span>
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </div>

      {/* Timeline Features Section */}
      <div className="container mx-auto px-4 py-12 relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent transform -translate-x-1/2 z-0"></div>

        {/* Feature 1: Live Cursors - Left Side */}
        <div className="flex flex-col md:flex-row items-center mb-24 relative">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 pr-8 md:text-right"
          >
            <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mb-6"
              >
                <motion.div
                  whileHover={{
                    rotate: [0, 15, 0, -15, 0],
                    transition: { duration: 0.5 },
                  }}
                  className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ml-auto md:ml-auto"
                >
                  <Pointer className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                Live Cursors
              </h3>
              <p className="text-muted-foreground relative z-10">
                See your teammates' cursors and selections in real-time, making
                collaboration intuitive and natural. Each collaborator has their
                own uniquely colored cursor.
              </p>
            </Card>
          </motion.div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
            >
              <Pointer className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
            {/* Live Cursors Interactive Demo */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <div className="p-5 font-mono text-sm">
                <div className="mb-3 text-sm text-muted-foreground">index.js - Multiple users editing</div>
                
                <div className="relative px-4 py-3 bg-black/30 rounded-md">
                  {/* Code area with multiple cursors */}
                  <div className="space-y-2 font-mono">
                    <div className="relative">
                      <span className="text-blue-400">function</span> <span className="text-green-400">calculateTotal</span><span>(items) {`{`}</span>
                      
                      {/* User 1 cursor - Canva style */}
                      <motion.div 
                        initial={{ left: 10, top: 0 }}
                        animate={{ 
                          left: [10, 150, 200, 150, 10],
                          top: [0, 0, 0, 0, 0]
                        }}
                        transition={{ 
                          duration: 5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                        className="absolute z-10"
                      >
                        {/* Cursor flag with name */}
                        <div className="absolute -top-8 -left-1 flex flex-col items-center">
                          <div className="px-2 py-1 rounded-md bg-blue-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Alex
                          </div>
                          <div className="w-2 h-2 bg-blue-500 rotate-45 mt-[1px]"></div>
                        </div>
                        {/* Cursor I-beam */}
                        <div className="h-5 w-0.5 bg-blue-500"></div>
                        {/* Mouse cursor */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -left-2 -top-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                            <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="1" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <div className="ml-4 relative">
                      <span className="text-purple-400">return</span> <span className="text-foreground">items.</span><span className="text-yellow-300">reduce</span><span className="text-foreground">((</span><span className="text-orange-300">sum</span><span className="text-foreground">, </span><span className="text-orange-300">item</span><span className="text-foreground">) => {`{`}</span>
                      
                      {/* User 2 cursor with selection effect - Canva style */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.3 }}
                        className="absolute -top-1 left-[60px] right-[120px] h-7 bg-green-500/20 rounded-sm border-l-2 border-r-2 border-green-500/70"
                      />
                      
                      <motion.div 
                        initial={{ left: 220, top: 2 }}
                        animate={{ 
                          left: [220, 60, 60, 180, 220],
                          top: [2, 2, 2, 2, 2]
                        }}
                        transition={{ 
                          duration: 8,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                        className="absolute z-10"
                      >
                        {/* Cursor flag with name */}
                        <div className="absolute -top-8 -left-1 flex flex-col items-center">
                          <div className="px-2 py-1 rounded-md bg-green-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Maria
                          </div>
                          <div className="w-2 h-2 bg-green-500 rotate-45 mt-[1px]"></div>
                        </div>
                        {/* Cursor I-beam */}
                        <div className="h-5 w-0.5 bg-green-500"></div>
                        {/* Mouse cursor */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -left-2 -top-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                            <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="1" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div className="ml-8 relative">
                      <span className="text-purple-400">return</span> <span className="text-foreground">sum + item.</span><span className="text-blue-300">price</span><span className="text-foreground">;</span>
                      
                      {/* User 3 cursor */}
                      <motion.div 
                        initial={{ left: 100 }}
                        animate={{ 
                          left: [100, 220, 240, 220, 100],
                        }}
                        transition={{ 
                          duration: 6,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 1
                        }}
                        className="absolute h-5 w-2 bg-pink-500 opacity-80"
                      >
                        <div className="absolute -top-6 -left-1 px-2 py-1 rounded text-[10px] bg-pink-500 text-white whitespace-nowrap">
                          Sarah
                        </div>
                      </motion.div>
                    </div>

                    <div className="ml-4"><span className="text-foreground">{`}`}, </span><span className="text-orange-300">0</span><span className="text-foreground">);</span></div>
                    <div className="text-foreground">{`}`}</div>
                  </div>
                </div>
                
                {/* Collaborators list */}
                <div className="mt-4 flex items-center justify-between px-2">
                  <div className="text-xs text-muted-foreground">3 collaborators online</div>
                  <div className="flex -space-x-1">
                    <div className="relative w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-30">
                      <span>A</span>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                          <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-20">
                      <span>M</span>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                          <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-10">
                      <span>J</span>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                          <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notification popups */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3, duration: 0.5 }}
                className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded px-3 py-2 text-xs border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Maria is selecting code</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2: Real-time Collaboration - Right Side */}
        <div className="flex flex-col md:flex-row items-center mb-24 relative">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pr-8 mt-8 md:mt-0"
          >
            {/* Real-time Collaboration Interactive Demo */}
            <div className="rounded-xl overflow-hidden bg-black/20 border border-white/10 backdrop-blur-md shadow-xl">
              <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
                <div className="text-sm">CodeSync Session</div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Live</div>
              </div>
              
              <div className="p-4">
                <div className="bg-black/30 rounded-md p-3 border border-white/5 font-mono text-sm overflow-hidden">
                  {/* Code that gets typed in real-time */}
                  <div className="space-y-1">
                    <div><span className="text-blue-400">import</span> <span className="text-green-300">React</span> <span className="text-blue-400">from</span> <span className="text-yellow-300">'react'</span>;</div>
                    <div><span className="text-blue-400">import</span> <span className="text-green-300">{'{ useState }'}</span> <span className="text-blue-400">from</span> <span className="text-yellow-300">'react'</span>;</div>
                    <div>&nbsp;</div>
                    
                    <div className="relative">
                      <span className="text-blue-400">function</span> <span className="text-green-300">UserProfile</span><span className="text-foreground">({`{`} userData {`}`}) {`{`}</span>
                      
                      {/* Typing animation indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                        className="absolute -right-5 top-1 text-blue-400 text-xs"
                      >
                        ●
                      </motion.div>
                    </div>
                    
                    <div className="ml-4 relative">
                      <span className="text-purple-400">const</span> <span className="text-foreground">[</span><span className="text-blue-300">isLoading</span><span className="text-foreground">, </span>
                      
                      {/* Animated typing effect */}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      >
                        <span className="text-blue-300">setIsLoading</span><span className="text-foreground">] = </span><span className="text-purple-400">useState</span><span className="text-foreground">(</span><span className="text-orange-300">false</span><span className="text-foreground">);</span>
                      </motion.span>
                    </div>
                    
                    <div className="ml-4 relative">
                      {/* Animated typing of new line */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 2, duration: 0.5 }}
                      >
                        <span className="text-purple-400">const</span> <span className="text-foreground">[</span><span className="text-blue-300">profileData</span><span className="text-foreground">, </span><span className="text-blue-300">setProfileData</span><span className="text-foreground">] = </span><span className="text-purple-400">useState</span><span className="text-foreground">(userData);</span>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 3, duration: 0.5 }}
                    >
                      <div className="ml-4">&nbsp;</div>
                      <div className="ml-4"><span className="text-purple-400">useEffect</span><span className="text-foreground">(() => {`{`}</span></div>
                      <div className="ml-8"><span className="text-foreground">// Load user data from API</span></div>
                      <div className="ml-8 relative">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">loadUserData</span> <span className="text-foreground">= </span><span className="text-purple-400">async</span><span className="text-foreground">() => {`{`}</span>
                        
                        {/* Current typing cursor */}
                        <motion.div
                          animate={{ opacity: [0, 1, 1, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 0,
                          }}
                          className="absolute h-4 w-1.5 bg-white right-0 ml-1 top-1"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Change indicators */}
                <div className="mt-4 bg-background/30 backdrop-blur-sm rounded-md p-2 border border-white/10">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold mt-0.5">J</div>
                    <div>
                      <div className="text-xs font-medium">John added useEffect hook</div>
                      <div className="text-xs text-muted-foreground mt-0.5">5 seconds ago</div>
                    </div>
                  </div>
                </div>
                
                {/* User activity */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] z-20">J</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] z-10">T</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Editing now</div>
                  </div>
                  
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 4, duration: 0.5 }}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span>Changes saved</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
            >
              <Users className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
            <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mb-6"
              >
                <motion.div
                  whileHover={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5 },
                  }}
                  className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <Users className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                Real-time Collaboration
              </h3>
              <p className="text-muted-foreground relative z-10">
                Code together in real-time with your team members, seeing
                changes instantly as they type. Never wait for pull requests to
                see code updates.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Feature 3: Video Calls - Left Side */}
        <div className="flex flex-col md:flex-row items-center mb-24 relative">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 pr-8 md:text-right"
          >
            <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mb-6"
              >
                <motion.div
                  whileHover={{ y: [0, -5, 0], transition: { duration: 0.5 } }}
                  className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ml-auto"
                >
                  <Video className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                Integrated Video Calls
              </h3>
              <p className="text-muted-foreground relative z-10">
                Communicate with your team through seamless, built-in video
                conferencing. Discuss code changes without switching between
                different applications.
              </p>
            </Card>
          </motion.div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
            >
              <Video className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
            {/* Video Call Interactive Demo */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <div className="bg-black/50 py-2 px-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="text-sm text-white/90">CodeSync Meeting</div>
                </div>
                <div className="text-xs text-white/70">23:14</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 p-3">
                {/* Main video */}
                <div className="col-span-3 aspect-video bg-black/70 rounded-md overflow-hidden relative border border-white/10">
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 0.8, 0.7],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5"
                  />
                  
                  {/* Randomly generated particles to simulate video noise */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        animate={{
                          opacity: [0, 1, 0],
                          x: Math.random() * 100 + "%",
                          y: Math.random() * 100 + "%",
                        }}
                        transition={{
                          duration: Math.random() * 2 + 1,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded bg-black/50 text-white/80 border border-white/10 flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    <span>Code Review Session</span>
                  </div>
                </div>
                
                {/* Participant videos */}
                <div className="aspect-video bg-black/60 rounded-md overflow-hidden relative border border-white/10">
                  <motion.div
                    animate={{ 
                      opacity: [0.6, 0.7, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"
                  />
                  <div className="absolute bottom-1 left-1 text-[10px] px-1 rounded bg-black/50 text-white/80">
                    Alex K.
                  </div>
                </div>
                
                <div className="aspect-video bg-black/60 rounded-md overflow-hidden relative border border-white/10">
                  <motion.div
                    animate={{ 
                      opacity: [0.6, 0.7, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"
                  />
                  <div className="absolute bottom-1 left-1 text-[10px] px-1 rounded bg-black/50 text-white/80">
                    Sarah J.
                  </div>
                </div>
                
                <div className="aspect-video bg-black/60 rounded-md overflow-hidden relative border border-white/10">
                  <motion.div
                    animate={{ 
                      opacity: [0.6, 0.7, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300">
                      Joining...
                    </div>
                  </motion.div>
                  <div className="absolute bottom-1 left-1 text-[10px] px-1 rounded bg-black/50 text-white/80">
                    Marcus P.
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center items-center gap-2 py-3 border-t border-white/10 bg-black/30">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
                >
                  <Video className="h-4 w-4 text-primary" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
                >
                  <MessageSquare className="h-4 w-4 text-primary" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
                >
                  <Users className="h-4 w-4 text-primary" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center backdrop-blur-sm border border-red-500/30"
                >
                  <Video className="h-4 w-4 text-white" />
                </motion.button>
              </div>
              
              {/* Screen Share Indicator */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3, duration: 0.5 }}
                className="absolute top-12 right-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-xs border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Screen sharing active</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Feature 4: File System - Right Side */}
        <div className="flex flex-col md:flex-row items-center mb-24 relative">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pr-8 mt-8 md:mt-0"
          >
            {/* Synchronized File System Interactive Demo */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <div className="text-sm">Project Explorer</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Synced</span>
                </div>
              </div>
              
              <div className="p-3 max-h-[320px] overflow-y-auto text-sm font-mono">
                {/* Project folder structure with visual change indicators */}
                <div className="space-y-0.5">
                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📁</div>
                    <span className="font-medium">project-codesync</span>
                  </div>
                  
                  <div className="ml-5">
                    <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                      <div className="mr-2 text-muted-foreground">📁</div>
                      <span>app</span>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="ml-5 overflow-hidden"
                    >
                      <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                        <div className="mr-2 text-muted-foreground">📄</div>
                        <span>page.tsx</span>
                        <div className="ml-2 flex">
                          <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center py-1.5 px-2 rounded bg-primary/10 cursor-pointer">
                        <div className="mr-2 text-muted-foreground">📄</div>
                        <span>layout.tsx</span>
                        <div className="ml-2 flex">
                          <div className="w-2 h-2 rounded-full bg-blue-500/70 animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                        <div className="mr-2 text-muted-foreground">📄</div>
                        <span>globals.css</span>
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                      <div className="mr-2 text-muted-foreground">📁</div>
                      <span>components</span>
                    </div>
                    
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ delay: 2, duration: 0.5 }}
                      className="ml-5 overflow-hidden"
                    >
                      <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                        <div className="mr-2 text-muted-foreground">📄</div>
                        <span>Button.tsx</span>
                      </div>
                      
                      <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                        <div className="mr-2 text-muted-foreground">📄</div>
                        <span>Card.tsx</span>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3, duration: 0.5 }}
                        className="flex items-center py-1.5 px-2 rounded-md hover:bg-white/5 cursor-pointer relative border border-purple-500/30 bg-purple-500/10"
                      >
                        <div className="mr-2 text-muted-foreground">📄</div>
                        <span className="text-purple-300">FileExplorer.tsx</span>
                        <div className="ml-2 flex">
                          <div className="rounded-full px-1.5 py-0.5 bg-purple-500/20 text-[10px] text-purple-300">
                            New
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📁</div>
                    <span>public</span>
                  </div>
                  
                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>package.json</span>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4, duration: 0.5 }}
                    className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer"
                  >
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>README.md</span>
                    <div className="ml-2 flex">
                      <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Activity and Status */}
              <div className="p-3 border-t border-white/10 bg-background/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="relative w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-30">
                        <span>A</span>
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                            <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-20">
                        <span>M</span>
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                            <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-10">
                        <span>J</span>
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                            <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">3 collaborators</span>
                  </div>
                </div>
              </div>
              
              {/* Activity Notifications */}
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 3.5, duration: 0.5 }}
                className="absolute bottom-14 right-3 bg-background/80 backdrop-blur-sm rounded-md p-3 text-xs border border-purple-500/30 max-w-[80%] shadow-lg shadow-purple-500/10"
              >
                <div className="flex items-start gap-2">
                  <div className="relative w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background mt-0.5">
                    <span>M</span>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                        <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-xs">Maria created <span className="text-purple-300 font-semibold">FileExplorer.tsx</span></div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 6v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Just now
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* File Operation Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.5, duration: 0.3 }}
                className="absolute bottom-24 left-28 bg-background/90 backdrop-blur-md rounded-md shadow-lg border border-white/10 text-sm overflow-hidden"
              >
                <div className="py-1">
                  <div className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                    <div className="text-primary text-xs">+</div>
                    <span>New File</span>
                  </div>
                  <div className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                    <div className="text-primary text-xs">+</div>
                    <span>New Folder</span>
                  </div>
                  <div className="border-t border-white/10 my-1"></div>
                  <div className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                    <Code2 className="h-3 w-3 text-primary" />
                    <span>Open</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
            >
              <Layers className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
            <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mb-6"
              >
                <motion.div
                  whileHover={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5 },
                  }}
                  className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <Layers className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                Synchronized File System
              </h3>
              <p className="text-muted-foreground relative z-10">
                Your entire project structure synchronized in real-time. Create,
                rename, and modify files with instant updates across all team
                members.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Feature 5: Version Control - Left Side */}
        <div className="flex flex-col md:flex-row items-center mb-24 relative">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 pr-8 md:text-right"
          >
            <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mb-6"
              >
                <motion.div
                  whileHover={{
                    rotate: [0, 15, 0, -15, 0],
                    transition: { duration: 0.5 },
                  }}
                  className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ml-auto"
                >
                  <GitBranch className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                Git Integration
              </h3>
              <p className="text-muted-foreground relative z-10">
                Seamlessly integrate with Git workflows. Commit, branch, and
                manage your repositories directly from the CodeSync interface
                with visual change indicators.
              </p>
            </Card>
          </motion.div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
            >
              <GitBranch className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
            {/* Git Integration Interactive Demo */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <div className="text-sm">Git Control</div>
                </div>
                <div className="bg-background/20 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>main</span>
                </div>
              </div>
              
              <div className="p-4">
                {/* Branch Visualization */}
                <div className="relative h-20 mb-4 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 80">
                    {/* Main branch */}
                    <path d="M20,40 L380,40" stroke="#444" strokeWidth="2" />
                    
                    {/* Feature branch */}
                    <path d="M100,40 C120,40 120,20 140,20 L240,20" stroke="#666" strokeWidth="2" />
                    
                    {/* Merge branch back */}
                    <path d="M240,20 C260,20 260,40 280,40" stroke="#666" strokeWidth="2" />
                    
                    {/* Commit dots */}
                    <circle cx="20" cy="40" r="5" fill="#444" />
                    <circle cx="60" cy="40" r="5" fill="#444" />
                    <circle cx="100" cy="40" r="5" fill="#444" />
                    <circle cx="140" cy="20" r="5" fill="#666" />
                    <circle cx="180" cy="20" r="5" fill="#666" />
                    <circle cx="240" cy="20" r="5" fill="#666" />
                    <circle cx="280" cy="40" r="5" fill="#8844dd" />
                    
                    {/* Animated highlighted commit dot */}
                    <motion.circle 
                      cx="280" 
                      cy="40" 
                      r="8" 
                      fill="transparent"
                      stroke="#8844dd"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        r: [5, 10, 5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                    
                    <circle cx="340" cy="40" r="5" fill="#444" />
                    
                    {/* Branch labels */}
                    <text x="180" y="15" fontSize="10" fill="#888">feature/user-auth</text>
                    <text x="340" y="35" fontSize="10" fill="#888">main</text>
                  </svg>
                </div>
                
                {/* Commit Details */}
                <div className="bg-black/30 rounded-md p-3 border border-white/5 font-mono text-sm mb-4">
                  <div className="flex gap-2 items-center">
                    <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">HEAD</div>
                    <div className="text-green-400">main</div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <GitBranch className="h-2 w-2 text-primary" />
                      </div>
                      <div className="text-muted-foreground">Last commit:</div>
                      <div className="font-medium">8c42a1</div>
                      <div className="text-muted-foreground">by</div>
                      <div className="font-medium">Alex K.</div>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      Merge: <span className="text-blue-400">feature/user-auth</span> → <span className="text-green-400">main</span>
                    </div>
                    
                    <div className="mt-2 text-xs text-primary">
                      Added user authentication system with JWT support
                    </div>
                  </motion.div>
                </div>
                
                {/* Changed Files */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>Changed files</span>
                    <span>+412 −28</span>
                  </div>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="space-y-1 overflow-hidden"
                  >
                    <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-green-500">
                      <div className="flex items-center gap-1">
                        <div className="text-green-500">+</div>
                        <span>auth/login.tsx</span>
                      </div>
                      <div className="text-green-500">+124</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-green-500">
                      <div className="flex items-center gap-1">
                        <div className="text-green-500">+</div>
                        <span>auth/register.tsx</span>
                      </div>
                      <div className="text-green-500">+156</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-yellow-500">
                      <div className="flex items-center gap-1">
                        <div className="text-yellow-500">~</div>
                        <span>lib/auth.tsx</span>
                      </div>
                      <div><span className="text-green-500">+98</span> <span className="text-red-500">−12</span></div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-yellow-500">
                      <div className="flex items-center gap-1">
                        <div className="text-yellow-500">~</div>
                        <span>components/Navbar.tsx</span>
                      </div>
                      <div><span className="text-green-500">+34</span> <span className="text-red-500">−16</span></div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-primary/20 text-primary text-xs rounded-md flex-1 text-center cursor-pointer"
                  >
                    New Branch
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-background/30 text-xs rounded-md flex-1 text-center cursor-pointer"
                  >
                    Commit Changes
                  </motion.div>
                </div>
              </div>
              
              {/* Notification Popup */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3, duration: 0.5 }}
                className="absolute top-12 right-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-xs border border-white/10 max-w-[60%]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Pull request #42 merged successfully</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Feature 6: Chat - Right Side */}
        <div className="flex flex-col md:flex-row items-center relative">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pr-8 mt-8 md:mt-0"
          >
            {/* Chat Integration Interactive Demo */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <div className="text-sm">Team Chat</div>
                </div>
                <div className="bg-primary/20 px-2 py-0.5 rounded-full text-xs">
                  3 online
                </div>
              </div>
              
              <div className="flex flex-col h-[320px]">
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {/* Chat messages */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] border border-blue-500/30 mt-0.5">A</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-xs">Alex</div>
                        <div className="text-[10px] text-muted-foreground">10:42 AM</div>
                      </div>
                      <div className="mt-1 p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs">
                        I just pushed the auth updates to the feature branch. Can someone review?
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] border border-green-500/30 mt-0.5">S</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-xs">Sarah</div>
                        <div className="text-[10px] text-muted-foreground">10:45 AM</div>
                      </div>
                      <div className="mt-1 p-2 rounded-md bg-green-500/10 border border-green-500/20 text-xs">
                        I'll take a look at it now. Did you add the JWT refresh logic?
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] border border-blue-500/30 mt-0.5">A</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-xs">Alex</div>
                        <div className="text-[10px] text-muted-foreground">10:47 AM</div>
                      </div>
                      <div className="mt-1 p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs">
                        Yes, check auth.tsx line 42. I implemented token rotation.
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] border border-green-500/30 mt-0.5">S</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-xs">Sarah</div>
                        <div className="text-[10px] text-muted-foreground">10:49 AM</div>
                      </div>
                      <div className="mt-1 space-y-2">
                        <div className="p-2 rounded-md bg-green-500/10 border border-green-500/20 text-xs">
                          Perfect! The implementation looks good. I like how you handled token expiration.
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-md p-2 text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Code2 className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">auth.tsx, line 42-46</span>
                          </div>
                          <div className="font-mono bg-black/30 p-2 rounded text-[10px] text-green-300">
                            const refreshToken = async () => {`{`}<br />
                            &nbsp;&nbsp;if (isRefreshing) return await tokenPromise;<br />
                            &nbsp;&nbsp;tokenPromise = performRefresh();<br />
                            &nbsp;&nbsp;return await tokenPromise;<br />
                            {`}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] border border-purple-500/30 mt-0.5">M</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-xs">Maria</div>
                        <div className="text-[10px] text-muted-foreground">10:52 AM</div>
                      </div>
                      <div className="mt-1 p-2 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs">
                        <div className="mb-1">Just joined the chat. Can I help with testing?</div>
                        <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                          <span>Typing...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Chat input */}
                <div className="p-3 border-t border-white/10 bg-black/20">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-black/30 rounded-md px-3 py-2 text-xs border border-white/10">
                      Type your message...
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/20 text-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4 20-7Z"/>
                        <path d="M22 2 11 13"/>
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Code Snippet Popup */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 4.5, duration: 0.5 }}
                className="absolute bottom-20 right-4 bg-background/90 backdrop-blur-md rounded-md p-2 text-xs border border-white/10 max-w-[80%]"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Code2 className="h-3 w-3 text-primary" />
                    <span>Share code snippet</span>
                  </div>
                  <div className="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer">×</div>
                </div>
                <div className="bg-black/50 p-2 rounded font-mono text-[10px] border border-white/10">
                  <div className="text-muted-foreground"># Select language</div>
                  <div className="mt-1">Paste code here...</div>
                </div>
                <div className="mt-2 flex justify-end">
                  <div className="px-2 py-1 bg-primary/20 text-primary rounded cursor-pointer text-[10px]">Share</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
            >
              <MessageSquare className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
            <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mb-6"
              >
                <motion.div
                  whileHover={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5 },
                  }}
                  className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <MessageSquare className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">
                Chat Integration
              </h3>
              <p className="text-muted-foreground relative z-10">
                Built-in chat functionality allows team members to communicate
                without leaving the coding environment. Discuss code and share
                ideas in real-time.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Code Editor Showcase */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Experience Collaborative Coding</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how CodeSync transforms the way your team writes code together, with real-time edits, live cursors, and instant feedback.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto backdrop-blur-sm bg-black/30 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Editor Top Bar */}
          <div className="flex items-center bg-black/50 px-4 py-2">
            <div className="flex space-x-2 mr-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-xs text-gray-400">project/app.js</div>
            <div className="text-xs text-gray-400">JavaScript</div>
          </div>

          {/* Editor Content */}
          <div className="p-4 font-mono text-sm leading-6 overflow-x-auto">
            <div className="flex">
              <div className="text-gray-500 pr-4 select-none text-right w-10">
                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <div className="text-blue-400">import <span className="text-green-400">React</span> from <span className="text-yellow-400">'react'</span>;</div>
                <div className="text-blue-400">import <span className="text-green-400">{'{ useState }'}</span> from <span className="text-yellow-400">'react'</span>;</div>
                <div className="text-blue-400">import <span className="text-green-400">CodeEditor</span> from <span className="text-yellow-400">'./CodeEditor'</span>;</div>
                <div>&nbsp;</div>
                
                {/* Live cursor effect */}
                <div className="relative">
                  <span className="text-purple-400">function </span>
                  <span className="text-yellow-300">CodeSyncApp</span>
                  <span className="text-foreground">() {'{'}</span>
                  <motion.div 
                    initial={{ opacity: 0, left: -20 }}
                    animate={{ 
                      opacity: 1, 
                      left: [80, 100, 120, 130, 120], 
                      top: [0, 2, 0, -2, 0] 
                    }}
                    transition={{ 
                      duration: 4,
                      times: [0, 0.2, 0.5, 0.8, 1],
                      delay: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="absolute top-0 z-10"
                  >
                    {/* Cursor flag with name */}
                    <motion.div 
                      className="absolute -top-8 -left-1 flex flex-col items-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                    >
                      <div className="px-2 py-1 rounded-md bg-blue-500 text-white text-[10px] whitespace-nowrap shadow-md">
                        Alex
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rotate-45 mt-[1px]"></div>
                    </motion.div>
                    {/* Cursor I-beam */}
                    <div className="h-5 w-0.5 bg-blue-500"></div>
                    {/* Mouse cursor */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        rotate: [0, 5, 0, -5, 0] 
                      }}
                      transition={{ 
                        opacity: { delay: 0.2 },
                        rotate: { 
                          duration: 5, 
                          repeat: Infinity, 
                          repeatType: "reverse" 
                        }
                      }}
                      className="absolute -left-2 -top-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                        <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="1" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="ml-4">
                  <span className="text-blue-400">const</span> <span className="text-foreground">[</span><span className="text-green-400">code</span>
                  <span className="text-foreground">, </span>
                  <span className="text-green-400">setCode</span>
                  <span className="text-foreground">] = </span>
                  <span className="text-purple-400">useState</span>
                  <span className="text-foreground">(</span>
                  <span className="text-yellow-400">''</span>
                  <span className="text-foreground">);</span>
                </div>
                
                <div className="relative ml-4">
                  <span className="text-blue-400">const</span> <span className="text-foreground">[</span><span className="text-green-400">collaborators</span>
                  
                  {/* Second cursor effect */}
                  <motion.div 
                    initial={{ opacity: 0, left: 50 }}
                    animate={{ 
                      opacity: 1, 
                      left: [120, 140, 150, 160, 150], 
                      top: [0, -2, 0, 2, 0]
                    }}
                    transition={{ 
                      duration: 4.5,
                      times: [0, 0.2, 0.5, 0.8, 1],
                      delay: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="absolute top-0 z-10"
                  >
                    {/* Cursor flag with name */}
                    <motion.div 
                      className="absolute -top-8 -left-1 flex flex-col items-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                    >
                      <div className="px-2 py-1 rounded-md bg-pink-500 text-white text-[10px] whitespace-nowrap shadow-md">
                        Sarah
                      </div>
                      <div className="w-2 h-2 bg-pink-500 rotate-45 mt-[1px]"></div>
                    </motion.div>
                    {/* Cursor I-beam */}
                    <div className="h-5 w-0.5 bg-pink-500"></div>
                    {/* Mouse cursor */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        rotate: [0, -5, 0, 5, 0] 
                      }}
                      transition={{ 
                        opacity: { delay: 0.2 },
                        rotate: { 
                          duration: 4, 
                          repeat: Infinity, 
                          repeatType: "reverse" 
                        }
                      }}
                      className="absolute -left-2 -top-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                        <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="1" />
                      </svg>
                    </motion.div>
                  </motion.div>
                  
                  <span className="text-foreground">, </span>
                  <span className="text-green-400">setCollaborators</span>
                  <span className="text-foreground">] = </span>
                  <span className="text-purple-400">useState</span>
                  <span className="text-foreground">([])</span><span className="text-foreground">;</span>
                </div>
                
                <div className="ml-4 relative">
                  {/* Animated typing effect */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 3,
                      delay: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                    className="absolute inset-0 bg-primary/10 overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-blue-400">const</span> <span className="text-green-400">syncChanges</span> <span className="text-foreground">= () => {'{'}</span>
                    <span className="text-purple-400"> socket</span><span className="text-foreground">.</span><span className="text-green-400">emit</span><span className="text-foreground">(</span><span className="text-yellow-400">'code:update'</span><span className="text-foreground">, code);</span> <span className="text-foreground">{'}'};</span>
                  </motion.div>
                  <span className="invisible">const syncChanges = () => {" socket.emit('code:update', code); "};</span>
                </div>
                
                <div className="ml-4">&nbsp;</div>
                <div className="ml-4"><span className="text-purple-400">return</span> <span className="text-foreground">(</span></div>
                <div className="ml-8"><span className="text-foreground">{'<'}</span><span className="text-green-400">CodeEditor</span></div>
                <div className="ml-12"><span className="text-blue-400">value</span><span className="text-foreground">={'{'}code{'}'}</span></div>
                <div className="ml-12"><span className="text-blue-400">onChange</span><span className="text-foreground">={'{'}setCode{'}'}</span></div>
                <div className="ml-12"><span className="text-blue-400">collaborators</span><span className="text-foreground">={'{'}collaborators{'}'}</span></div>
                <div className="ml-8"><span className="text-foreground">{'/>'}</span></div>
                <div className="ml-4"><span className="text-foreground">);</span></div>
                <div><span className="text-foreground">{'}'}</span></div>
              </div>
            </div>
          </div>
          
          {/* Cursors */}
          <div className="absolute right-4 top-16 space-y-3 bg-background/30 p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3 text-xs">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-semibold shadow-sm shadow-blue-500/20"></div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-background rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                    <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                  </svg>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white">Alex</span>
                <span className="text-[10px] text-blue-300">editing</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-semibold shadow-sm shadow-pink-500/20"></div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-background rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                    <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                  </svg>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white">Sarah</span>
                <span className="text-[10px] text-pink-300">viewing</span>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5, duration: 0.5 }}
              className="flex items-center gap-3 text-xs"
            >
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-semibold shadow-sm shadow-green-500/20"></div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-background rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                    <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                  </svg>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white">Maria</span>
                <span className="text-[10px] text-green-300">joined</span>
              </div>
            </motion.div>
          </div>
          
          {/* Chat bubble */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 0.5 }}
            className="absolute left-36 bottom-16 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 p-3 rounded-lg max-w-xs text-xs shadow-lg"
          >
            <div className="flex items-start gap-2">
              <div className="relative w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold shadow-md">
                <span>S</span>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                    <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-semibold text-pink-300">Sarah</p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-1"
                >
                  Let's add WebRTC support for the video calls next
                </motion.p>
                
                {/* Code snippet */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="bg-background/30 p-2 rounded border border-pink-500/20 font-mono text-[10px] text-pink-200">
                    <div className="text-blue-400">import</div>
                    <div className="ml-2">{'{ useVideoCall }'} <span className="text-blue-400">from</span> <span className="text-yellow-400">'@codesync/video'</span>;</div>
                  </div>
                </motion.div>
                
                <div className="mt-1 text-[9px] text-muted-foreground flex items-center justify-end">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                    transition={{ delay: 3, duration: 0.5 }}
                    className="flex items-center overflow-hidden whitespace-nowrap"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Seen
                  </motion.div>
                </div>
              </div>
            </div>
            <motion.div 
              className="absolute -bottom-2 left-3 w-4 h-4 bg-pink-500/20 border-b border-r border-pink-500/30 transform rotate-45"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            
            {/* Reply indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6, duration: 0.5 }}
              className="absolute -bottom-8 left-10 flex items-center"
            >
              <div className="relative w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold mr-2 shadow-sm">
                <span>A</span>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-background rounded-full flex items-center justify-center">
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                    <path d="M4 2L20 18L13 18L11 22L8 12L4 2Z" fill="currentColor" stroke="white" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
              <motion.div
                animate={{ 
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="text-[10px] text-blue-300"
              >
                Alex is typing...
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-lg rounded-xl border border-white/10 p-8 overflow-hidden relative"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 -top-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold mb-4 relative z-10"
          >
            Ready to transform your coding workflow?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground mb-8 relative z-10"
          >
            Start collaborating with your team in real-time today. No more merge conflicts, no more waiting for PR reviews.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10"
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Start Coding Together
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Code2 className="h-6 w-6 text-primary mr-2" />
            <p className="text-muted-foreground">
              © 2024 CodeSync. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white\/5 {
          background-size: 40px 40px;
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
        }
      `}</style>
    </main>
  );
}

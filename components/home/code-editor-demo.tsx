import React from 'react'
import {motion} from "framer-motion"
const CodeEditorDemo = () => {
  return (
          <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Experience Collaborative Coding
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto mb-4"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how CodeSync transforms the way your team writes code together,
              with real-time edits, live cursors, and instant feedback.
            </p>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative max-w-5xl h-[500px] mx-auto backdrop-blur-sm bg-black/30 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Editor Top Bar */}
            <div className="flex items-center bg-black/50 px-4 py-2">
              <div className="flex space-x-2 mr-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center text-xs text-gray-400">
                project/app.js
              </div>
              <div className="text-xs text-gray-400">JavaScript</div>
            </div>
  
            {/* Editor Content */}
            <div className="p-4 font-mono text-sm leading-6 overflow-x-auto">
              <div className="flex">
                <div className="text-gray-500 pr-4 select-none text-right w-10">
                  1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
                  10
                  <br />
                  11
                  <br />
                  12
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <div className="text-blue-400">
                    import <span className="text-green-400">React</span> from{" "}
                    <span className="text-yellow-400">'react'</span>;
                  </div>
                  <div className="text-blue-400">
                    import{" "}
                    <span className="text-green-400">{"{ useState }"}</span> from{" "}
                    <span className="text-yellow-400">'react'</span>;
                  </div>
                  <div className="text-blue-400">
                    import <span className="text-green-400">CodeEditor</span> from{" "}
                    <span className="text-yellow-400">'./CodeEditor'</span>;
                  </div>
                  <div>&nbsp;</div>
  
                  {/* Live cursor effect */}
                  <div className="relative">
                    <span className="text-purple-400">function </span>
                    <span className="text-yellow-300">CodeSyncApp</span>
                    <span className="text-foreground">() {"{"}</span>
  
                    {/* Alex typing cursor (fixed with name at top right) */}
                    <motion.div
                      initial={{ opacity: 0, left: -20 }}
                      animate={{
                        opacity: 1,
                        left: [80, 100, 120, 130, 120],
                        top: [0, 2, 0, -2, 0],
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
                      {/* Typing cursor with label */}
                      <div className="flex items-center">
                        {/* Vertical I-beam cursor */}
                        <div className="h-5 w-0.5 bg-blue-500"></div>
                        {/* Label at top right */}
                        <div className="absolute -top-6 left-2 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] whitespace-nowrap shadow-md">
                          Alex
                        </div>
                      </div>
                    </motion.div>
  
                    {/* Alex mouse cursor (floating separately) */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        left: [50, 80, 100, 60, 50],
                        top: [20, 30, 10, 5, 20],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="absolute z-20"
                    >
                      <div className="relative">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-blue-500"
                        >
                          <path
                            d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                            fill="currentColor"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                        {/* Name below mouse cursor */}
                        <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] whitespace-nowrap shadow-md">
                          Alex
                        </div>
                      </div>
                    </motion.div>
                  </div>
  
                  <div className="ml-4">
                    <span className="text-blue-400">const</span>{" "}
                    <span className="text-foreground">[</span>
                    <span className="text-green-400">code</span>
                    <span className="text-foreground">, </span>
                    <span className="text-green-400">setCode</span>
                    <span className="text-foreground">] = </span>
                    <span className="text-purple-400">useState</span>
                    <span className="text-foreground">(</span>
                    <span className="text-yellow-400">''</span>
                    <span className="text-foreground">);</span>
                  </div>
  
                  <div className="relative ml-4">
                    <span className="text-blue-400">const</span>{" "}
                    <span className="text-foreground">[</span>
                    <span className="text-green-400">collaborators</span>
                    {/* Sarah typing cursor (fixed with name at top right) */}
                    <motion.div
                      initial={{ opacity: 0, left: 50 }}
                      animate={{
                        opacity: 1,
                        left: [120, 140, 150, 160, 150],
                        top: [0, -2, 0, 2, 0],
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
                      {/* Typing cursor with label */}
                      <div className="flex items-center">
                        {/* Vertical I-beam cursor */}
                        <div className="h-5 w-0.5 bg-pink-500"></div>
                        {/* Label at top right */}
                        <div className="absolute -top-6 left-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] whitespace-nowrap shadow-md">
                          Sarah
                        </div>
                      </div>
                    </motion.div>
                    {/* Sarah mouse cursor (floating separately) */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        left: [160, 190, 170, 140, 160],
                        top: [30, 20, 40, 45, 30],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1,
                      }}
                      className="absolute z-20"
                    >
                      <div className="relative">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-pink-500"
                        >
                          <path
                            d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                            fill="currentColor"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                        {/* Name below mouse cursor */}
                        <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] whitespace-nowrap shadow-md">
                          Sarah
                        </div>
                      </div>
                    </motion.div>
                    <span className="text-foreground">, </span>
                    <span className="text-green-400">setCollaborators</span>
                    <span className="text-foreground">] = </span>
                    <span className="text-purple-400">useState</span>
                    <span className="text-foreground">([])</span>
                    <span className="text-foreground">;</span>
                  </div>
  
                  <div className="ml-4 relative">
                    {/* Animated typing effect with Maria's cursor */}
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
                      <span className="text-blue-400">const</span>{" "}
                      <span className="text-green-400">syncChanges</span>{" "}
                      <span className="text-foreground">= () {"=> {"}</span>
                      <span className="text-purple-400"> socket</span>
                      <span className="text-foreground">.</span>
                      <span className="text-green-400">emit</span>
                      <span className="text-foreground">(</span>
                      <span className="text-yellow-400">'code:update'</span>
                      <span className="text-foreground">, code);</span>{" "}
                      <span className="text-foreground">{"}"};</span>
                      {/* Maria typing cursor at the end of the line */}
                      <div className="inline-block relative ml-1 w-1"></div>
                    </motion.div>
                    <span className="invisible">
                      const syncChanges = () {"=> {"} socket.emit('code:update',
                      code); {"}"};
                    </span>
                  </div>
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
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-blue-500"
                    >
                      <path
                        d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="0.5"
                      />
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
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-pink-500"
                    >
                      <path
                        d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="0.5"
                      />
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
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-green-500"
                    >
                      <path
                        d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="0.5"
                      />
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
              className="absolute right-4 bottom-16 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 p-3 rounded-lg max-w-xs text-xs shadow-lg"
            >
              <div className="flex items-start gap-2">
                <div className="relative w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold shadow-md">
                  <span>S</span>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-pink-500"
                    >
                      <path
                        d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="0.5"
                      />
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
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="bg-background/30 p-2 rounded border border-pink-500/20 font-mono text-[10px] text-pink-200">
                      <div className="text-blue-400">import</div>
                      <div className="ml-2">
                        {"{ useVideoCall }"}{" "}
                        <span className="text-blue-400">from</span>{" "}
                        <span className="text-yellow-400">'@codesync/video'</span>
                        ;
                      </div>
                    </div>
                  </motion.div>
  
                  <div className="mt-1 text-[9px] text-muted-foreground flex items-center justify-end">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      transition={{ delay: 3, duration: 0.5 }}
                      className="flex items-center overflow-hidden whitespace-nowrap"
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-1"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Seen
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
  
  )
}

export default CodeEditorDemo
import React from 'react'
import {motion} from "framer-motion"
import { createCursorAnimation } from '@/lib/animation-types'
const LiveCursorDemo = () => {
  return (
    <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
          >
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <div className="p-5 font-mono text-sm">
                <div className="mb-3 text-sm text-muted-foreground">
                  index.js - Multiple users editing
                </div>

                <div className="relative px-4 py-3 bg-black/30 rounded-md">
                  {/* Code area with multiple cursors */}
                  <div className="space-y-2 font-mono">
                    <div className="relative">
                      <span className="text-blue-400">function</span>{" "}
                      <span className="text-green-400">calculateTotal</span>
                      <span>(items) {`{`}</span>
                      {/* User 1 cursor - Canva style */}
                      <motion.div
                        {...createCursorAnimation(
                          [
                            [10, 150, 200, 150, 10],
                            [0, 0, 0, 0, 0],
                          ],
                          5
                        )}
                        className="absolute z-10"
                      >
                        {/* Typing cursor with name at top right */}
                        <div className="flex items-center">
                          {/* Vertical I-beam cursor */}
                          <div className="h-5 w-0.5 bg-blue-500"></div>
                          {/* Name label */}
                          <div className="absolute -top-6 left-2 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Alex
                          </div>
                        </div>
                      </motion.div>
                      {/* User 1 - Mouse cursor floating separately */}
                      <motion.div
                        {...createCursorAnimation(
                          [
                            [50, 100, 150, 80, 50],
                            [30, 40, 60, 50, 30],
                          ],
                          8
                        )}
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

                          {/* Mouse cursor name below */}
                          <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Alex
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="ml-4 relative">
                      <span className="text-purple-400">return</span>{" "}
                      <span className="text-foreground">items.</span>
                      <span className="text-yellow-300">reduce</span>
                      <span className="text-foreground">((</span>
                      <span className="text-orange-300">sum</span>
                      <span className="text-foreground">, </span>
                      <span className="text-orange-300">item</span>
                      <span className="text-foreground">) {"=> {"}</span>
                      {/* User 2 cursor with selection effect - Canva style */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.3 }}
                        className="absolute -top-1 left-[60px] right-[120px] h-7 bg-green-500/20 rounded-sm border-l-2 border-r-2 border-green-500/70"
                      />
                      {/* User 2 - Typing cursor */}
                      <motion.div
                        {...createCursorAnimation(
                          [
                            [220, 60, 60, 180, 220],
                            [2, 2, 2, 2, 2],
                          ],
                          8
                        )}
                        className="absolute z-10"
                      >
                        {/* Typing cursor with name at top right */}
                        <div className="flex items-center">
                          {/* Vertical I-beam cursor */}
                          <div className="h-5 w-0.5 bg-green-500"></div>
                          {/* Name label */}
                          <div className="absolute -top-6 left-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Maria
                          </div>
                        </div>
                      </motion.div>
                      {/* User 2 - Mouse cursor floating separately */}
                      <motion.div
                        {...createCursorAnimation(
                          [
                            [80, 120, 200, 140, 80],
                            [20, 35, 15, 5, 20],
                          ],
                          7,
                          0.5
                        )}
                        className="absolute z-20"
                      >
                        <div className="relative">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-green-500"
                          >
                            <path
                              d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                              fill="currentColor"
                              stroke="white"
                              strokeWidth="1.5"
                            />
                          </svg>

                          {/* Mouse cursor name below */}
                          <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Maria
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="ml-8 relative">
                      <span className="text-purple-400">return</span>{" "}
                      <span className="text-foreground">sum + item.</span>
                      <span className="text-blue-300">price</span>
                      <span className="text-foreground">;</span>
                      {/* User 3 - Mouse cursor floating separately */}
                      <motion.div
                        {...createCursorAnimation(
                          [
                            [180, 240, 140, 100, 180],
                            [25, 15, 40, 20, 25],
                          ],
                          9,
                          1.5
                        )}
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

                          {/* Mouse cursor name below */}
                          <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] whitespace-nowrap shadow-md">
                            Sarah
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="ml-4">
                      <span className="text-foreground">{`}`}, </span>
                      <span className="text-orange-300">0</span>
                      <span className="text-foreground">);</span>
                    </div>
                    <div className="text-foreground">{`}`}</div>
                  </div>
                </div>

                {/* Collaborators list */}
                <div className="mt-4 flex items-center justify-start px-2">
                  <div className="text-xs text-muted-foreground">
                    3 collaborators online
                  </div>
                  <div className="flex -space-x-1">
                    <div className="relative w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-30">
                      <span>A</span>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
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
                      </div>
                    </div>
                    <div className="relative w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-20">
                      <span>M</span>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-purple-500"
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
                    <div className="relative w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-10">
                      <span>J</span>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
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
          )
}

export default LiveCursorDemo
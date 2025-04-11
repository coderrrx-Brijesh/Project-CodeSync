import React from 'react'
import { Card } from './card'
import { Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

const AiCodingShowcase = () => {
  return (
    <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-md"></div>
              <Card className="relative h-full p-6 backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden">
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 rounded-full bg-background/50 flex items-center justify-center">
                    <Cpu className="h-10 w-10 text-emerald-400" />
                    <motion.div
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-full h-full rounded-full border-2 border-emerald-400/30"
                    ></motion.div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  AI Coding Assistant
                </h3>
                <div className="bg-black/40 rounded-lg overflow-hidden mb-4 h-[62%]">
                  <div className="bg-black/60 p-2 text-sm border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span>CodeSync AI</span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs">AI</span>
                      </div>
                      <div>
                        <p className="text-xs bg-emerald-500/10 p-2 rounded-md max-w-[220px]">
                          How can I help you with your code today?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                      <div>
                        <p className="text-xs bg-blue-500/10 p-2 rounded-md max-w-[220px]">
                          Can you help me optimize this function for better
                          performance?
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs">ME</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs">AI</span>
                      </div>
                      <div>
                        <p className="text-xs bg-emerald-500/10 p-2 rounded-md max-w-[220px]">
                          Of course! I notice a few opportunities for
                          optimization:
                          <br />
                          <br />
                          1. You could use memoization to cache results
                          <br />
                          2. The loop can be simplified with Array.reduce()
                          <br />
                          3. Consider using a more efficient data structure
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/60 p-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask the AI assistant..."
                      className="bg-background/20 text-xs p-2 rounded-md w-full outline-none border border-white/10"
                    />
                    <button className="bg-emerald-500/80 p-1 rounded-md">
                      <span className="text-xs">Ask</span>
                    </button>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-sm">
                      Code generation and auto-completion
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-sm">
                      Bug detection and code optimization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-sm">
                      Natural language code explanation
                    </span>
                  </li>
                </ul>
            </Card>
    </div>
  )
}

export default AiCodingShowcase
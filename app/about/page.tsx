"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function About() {
  const teamMembers = [
    {
      name: "Brijesh Singh",
      role: "Founder & Lead Developer",
      imageSrc: "/images/brijesh.jpg",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
    },
    {
      name: "Abhinav Arya",
      role: "Backend Engineer",
      imageSrc: "/images/abhinav.png",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
    },
    {
      name: "Alok Kumar",
      role: "AI Engineer",
      imageSrc: "/images/alok.png",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Main lighting effects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Back to Home button */}
      <div className="relative z-10 flex justify-start mt-[2%] ml-[2%]">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Button
            variant="ghost"
            size="sm"
            className="relative backdrop-blur-md bg-background/20 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 pt-16 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
          About Us
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "180px" }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16"
        >
          Meet the talented team behind CodeSync who are passionate about
          creating the ultimate collaborative coding experience.
        </motion.p>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.2, duration: 0.5 }}
              className="relative"
            >
              {/* Photo Frame with Glow Effect */}
              <div className="relative group mb-6">
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: index * 0.7,
                  }}
                  className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-xl blur-md"
                />
                <div className="relative rounded-xl overflow-hidden aspect-square border border-white/10 shadow-xl glass-effect">
                  <div className="absolute inset-0 bg-gradient-to-br from-background/70 to-background/40 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                      <motion.a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      >
                        <Github size={20} />
                      </motion.a>
                      <motion.a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      >
                        <Linkedin size={20} />
                      </motion.a>
                      <motion.a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      >
                        <Twitter size={20} />
                      </motion.a>
                    </div>
                  </div>
                  <div className="relative h-full w-full">
                    {/* Image placeholder - replace with actual images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent" />
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-white/50">Photo</span>
                    </div>
                    {/* Uncomment this when you have actual images */}
                    <Image
                      src={member.imageSrc}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                  className="h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 mx-auto mt-3"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Company Story Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-md opacity-70"></div>
          <Card className="relative p-8 backdrop-blur-md bg-background/30 border border-white/10">
            <h2 className="text-3xl font-bold mb-6 relative">
              Our Story
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2023, CodeSync began with a simple mission: to
                eliminate the barriers that slow down collaborative coding. Our
                founders, who experienced firsthand the frustrations of
                traditional collaborative workflows, set out to create a
                platform that would transform how development teams work
                together.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                What started as a small project has grown into a comprehensive
                platform that combines real-time code editing, integrated
                communication tools, and powerful AI assistance. Today, CodeSync
                is used by development teams around the world, from small
                startups to large enterprises.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team continues to innovate and expand the platform's
                capabilities, always with our core mission in mind: to make
                collaborative coding seamless, efficient, and enjoyable.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

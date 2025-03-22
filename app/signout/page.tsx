"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LogoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect to login if there is no active session
    if (status !== "loading" && !session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Sign Out</CardTitle>
              <CardDescription className="text-center">
                Are you sure you want to sign out?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <LogOut className="h-16 w-16 text-muted-foreground" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full"
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyEmailPage() {
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [email, setEmail] = useState("");
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  
  useEffect(() => {
    // Set email from URL parameter if provided
    if (emailParam) {
      setEmail(emailParam);
    }
    
    // Skip verification process if we're in resend mode (no token)
    if (!token) {
      setVerificationState("resend");
      return;
    }
    
    const verifyEmail = async () => {
      try {
        // In a real app, you would make an API call to verify the token
        // Mock API call with a delay to simulate network request
        setTimeout(() => {
          // For demo, randomly succeed or fail
          if (token === "demo-success-token") {
            setVerificationState("success");
          } else {
            setVerificationState("error");
          }
        }, 2000);
      } catch (err) {
        setVerificationState("error");
      }
    };
    
    verifyEmail();
  }, [token, emailParam]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResendLoading(true);
    
    try {
      // In a real app, you would make an API call to resend the verification email
      // Mock API call with a delay
      setTimeout(() => {
        setIsResendLoading(false);
        setResendSuccess(true);
      }, 1500);
    } catch (err) {
      setIsResendLoading(false);
    }
  };

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

  const renderVerificationContent = () => {
    switch (verificationState) {
      case "loading":
        return (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
            />
            <h3 className="text-xl font-semibold">Verifying your email</h3>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        );
        
      case "success":
        return (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-semibold">Email verified!</h3>
            <p className="text-muted-foreground">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Button 
              onClick={() => router.push("/signin")}
              className="mt-2"
            >
              Go to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
        
      case "error":
        return (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center"
            >
              <XCircle className="h-8 w-8 text-red-600" />
            </motion.div>
            <h3 className="text-xl font-semibold">Verification failed</h3>
            <p className="text-muted-foreground">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
            <Button 
              variant="outline"
              onClick={() => setVerificationState("resend")}
              className="mt-2"
            >
              Resend verification email
            </Button>
          </div>
        );
        
      case "resend":
        return (
          <>
            {resendSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 flex flex-col items-center text-center gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Verification email sent</h3>
                <p className="text-muted-foreground">
                  We've sent a verification email to <span className="font-medium">{email}</span>. 
                  Please check your inbox and click the verification link.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button 
                    onClick={() => {
                      setResendSuccess(false);
                      setEmail("");
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleResend} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full font-medium" 
                  disabled={isResendLoading}
                >
                  {isResendLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Resend verification email
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-6"
      >
        <Link 
          href="/signin" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
        
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Email Verification</h1>
          <p className="text-muted-foreground">
            {verificationState === "resend" 
              ? "Resend your verification email" 
              : "Verify your email address to continue"}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {verificationState === "resend" 
                  ? "Resend Verification" 
                  : "Verify Email"}
              </CardTitle>
              <CardDescription>
                {verificationState === "resend" 
                  ? "Enter your email to receive a new verification link" 
                  : "Complete your account setup by verifying your email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderVerificationContent()}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Mail,
  ArrowLeft,
} from "lucide-react";
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
import { sendVerificationEmail } from "@/lib/send-verification-email";

export default function VerifyEmailPage() {
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error" | "resend" | "justSignedUp">("loading");
  const [email, setEmail] = useState("");
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const status = searchParams.get("status"); // For success redirects from API
  const justSignedUp = searchParams.get("justSignedUp");

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  useEffect(() => {
    // Set email from URL parameter if provided
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // Check if we were redirected after successful verification
    if (status === "success") {
      setVerificationState("success");
      return;
    }

    // If the user just signed up, show the justSignedUp state
    if (justSignedUp === "true") {
      setVerificationState("justSignedUp");
      return;
    }

    // If no token is provided, show the resend form
    if (!verifyToken) {
      setVerificationState("resend");
      return;
    }

    // Verify token by calling the API
    const verifyEmail = async () => {
      try {
        // Make sure we have an email to use
        const emailToUse = emailParam ? decodeURIComponent(emailParam) : email;
        
        if (!emailToUse) {
          setErrorMessage("Email address is missing");
          setVerificationState("error");
          return;
        }
        
        // Call the verification API endpoint
        const response = await fetch(`/api/auth/verify-email?token=${verifyToken}&email=${encodeURIComponent(emailToUse)}`);
        const data = await response.json();
        
        if (response.ok) {
          setVerificationState("success");
        } else {
          setErrorMessage(data.error || "Verification failed");
          setVerificationState("error");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "An unknown error occurred");
        setVerificationState("error");
      }
    };

    verifyEmail();
  }, [verifyToken, emailParam, status, email, justSignedUp]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResendLoading(true);
    setErrorMessage("");
    setResendSuccess(false);
    
    if (!email) {
      setErrorMessage("Please enter your email address");
      setIsResendLoading(false);
      return;
    }
    
    try {
      // Get user data from our API endpoint 
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const userData = await response.json();
      
      if (!response.ok) {
        throw new Error(userData.error || 'Failed to fetch user data');
      }

      if (userData.isVerified) {
        // If already verified, show success state
        setVerificationState("success");
        return;
      }

      // Use the fetched data to send a new verification email
      await sendVerificationEmail({
        firstName: userData.firstName,
        email,
        verifyToken: userData.verifyToken,
      });

      setResendSuccess(true);
    } catch (err: any) {
      console.error("Resend error:", err);
      setErrorMessage(err.message || "Failed to resend verification email");
    } finally {
      setIsResendLoading(false);
    }
  };

  const renderVerificationContent = () => {
    switch (verificationState) {
      case "loading":
        return (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-white border-t-transparent"
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
              Your email has been successfully verified. You can now sign in.
            </p>
            <Button onClick={() => router.push("/signin")} className="mt-2">
              Go to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case "justSignedUp":
        return (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"
            >
              <Mail className="h-8 w-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-semibold">Verification email sent!</h3>
            <p className="text-muted-foreground">
              We've sent a verification email to <span className="font-medium">{email}</span>.
              Please check your inbox and click the verification link.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Don't see the email? Check your spam folder or resend the verification email below.
            </p>
            <Button 
              onClick={handleResend} 
              variant="outline" 
              className="mt-4"
              disabled={isResendLoading}
            >
              {isResendLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Resend verification email
                  <Mail className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <div className="w-full mt-6 pt-6 border-t border-border">
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground"
                onClick={() => router.push("/signin")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            </div>
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
              {errorMessage || "The verification link is invalid or has expired. Please request a new verification email."}
            </p>
            <Button variant="outline" onClick={() => setVerificationState("resend")} className="mt-2">
              Resend verification email
            </Button>
          </div>
        );
      case "resend":
        return resendSuccess ? (
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
              Please check your inbox and click the link.
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
          <form onSubmit={handleResend} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full"
                disabled={isResendLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isResendLoading || !email}
            >
              {isResendLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Send verification email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Email Verification
          </h1>
          <p className="text-sm text-muted-foreground">
            Verify your email to complete your account setup
          </p>
        </div>

        <Card>
          <CardContent className="p-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {renderVerificationContent()}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

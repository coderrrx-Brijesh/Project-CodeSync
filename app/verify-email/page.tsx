"use client";

import { useState, useEffect, Suspense } from "react";
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
import emailjs from "@emailjs/browser";

// Loading component for Suspense fallback
function VerificationLoading() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8 px-4">
      <Card className="border-border/40 shadow-lg w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            Loading verification page...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            <h3 className="text-xl font-semibold">Loading</h3>
            <p className="text-muted-foreground">
              Please wait while we prepare the verification page...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main component that uses useSearchParams
function VerifyEmailContent() {
  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error" | "resend" | "justSignedUp"
  >("loading");
  const [email, setEmail] = useState("");
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyToken = searchParams?.get("token");
  const emailParam = searchParams?.get("email");
  const status = searchParams?.get("status"); // For success redirects from API
  const justSignedUp = searchParams?.get("justSignedUp");

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    // Initialize EmailJS
    if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }

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
        const response = await fetch(
          `/api/auth/verify-email?token=${verifyToken}&email=${encodeURIComponent(emailToUse)}`
        );
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
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.error || "Failed to fetch user data");
      }

      if (userData.isVerified) {
        // If already verified, show success state
        setVerificationState("success");
        return;
      }

      // Use the fetched data to send a new verification email with EmailJS
      await sendVerificationEmail({
        firstName: userData.firstName,
        email,
        verifyToken: userData.verifyToken,
      });

      setResendSuccess(true);
    } catch (err: any) {
      console.error("Email verification error:", err);
      setErrorMessage(err.message || "Failed to send verification email");
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
              {errorMessage ||
                "We couldn't verify your email. Please try again."}
            </p>
            <div className="flex flex-col gap-2 mt-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setVerificationState("resend")}
              >
                Try Again
              </Button>
              <Button onClick={() => router.push("/signup")}>
                Back to Sign Up
              </Button>
            </div>
          </div>
        );
      case "justSignedUp":
        return (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <Mail className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-semibold">Check your email</h3>
            <p className="text-muted-foreground">
              We've sent a verification email to{" "}
              <span className="font-medium">{email}</span>. Please check your
              inbox and click the link to verify your account.
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              <p>
                Didn't receive an email?{" "}
                <button
                  onClick={() => setVerificationState("resend")}
                  className="text-primary hover:underline font-medium"
                >
                  Resend verification email
                </button>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/signup")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign Up
            </Button>
          </div>
        );
      case "resend":
      default:
        return (
          <div className="p-6 flex flex-col gap-4">
            <div className="text-center mb-2">
              <h3 className="text-xl font-semibold">
                Resend verification email
              </h3>
              <p className="text-muted-foreground">
                Enter your email address to receive a new verification link
              </p>
            </div>

            {resendSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-3 rounded-md bg-green-100 text-green-800 flex gap-2 items-start"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <span>
                  Verification email sent! Please check your inbox and click the
                  link to verify your account.
                </span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-3 rounded-md bg-red-100 text-red-800 flex gap-2 items-start"
              >
                <XCircle className="h-4 w-4 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleResend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
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
                className="w-full"
                disabled={isResendLoading}
              >
                {isResendLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Email Verification
              </CardTitle>
              <CardDescription className="text-center">
                Verify your email address to activate your account
              </CardDescription>
            </CardHeader>
            <CardContent>{renderVerificationContent()}</CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Wrap in Suspense and export default component
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

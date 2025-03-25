"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Loading...</CardTitle>
            <CardDescription>
              Please wait while we load the page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  // Password validation criteria
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Calculate password strength
  const calculatePasswordStrength = () => {
    let strength = 0;
    if (minLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;
    
    setPasswordStrength(strength);
  };

  // Password validation on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setTimeout(() => calculatePasswordStrength(), 100);
  };
  
  useEffect(() => {
    // Verify token validity on page load
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      
      try {
        // Call our API to verify the token
        setTokenValid(null); // Set to loading state
        
        const response = await fetch(`/api/auth/reset-password?token=${token}`, {
          method: 'GET',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify token');
        }
        
        setTokenValid(data.valid);
      } catch (err) {
        console.error('Token verification failed:', err);
        setTokenValid(false);
      }
    };
    
    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    // Validate password strength
    if (passwordStrength < 3) {
      setError("Please use a stronger password");
      setIsLoading(false);
      return;
    }
    
    try {
      // Call the real API endpoint for password reset
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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

  // Content based on token validation state
  const renderContent = () => {
    // Loading state
    if (tokenValid === null) {
      return (
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          />
          <h3 className="text-xl font-semibold">Verifying reset link</h3>
          <p className="text-muted-foreground">
            Please wait while we verify your password reset link...
          </p>
        </div>
      );
    }
    
    // Invalid token
    if (tokenValid === false) {
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
          <h3 className="text-xl font-semibold">Invalid or expired link</h3>
          <p className="text-muted-foreground">
            The password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <Button 
            onClick={() => router.push("/forgot-password")}
            className="mt-2"
          >
            Request new reset link
          </Button>
        </div>
      );
    }
    
    // Success state
    if (success) {
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
          <h3 className="text-xl font-semibold">Password reset successful!</h3>
          <p className="text-muted-foreground">
            Your password has been successfully reset. You can now sign in with your new password.
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
    }
    
    // Valid token, show reset form
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive flex gap-2 items-start"
          >
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {password && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 space-y-1 text-xs"
            >
              <div className="flex gap-1 mb-1">
                <div className={`h-1 flex-1 rounded-lg ${passwordStrength > 0 ? 'bg-destructive' : 'bg-border'}`}></div>
                <div className={`h-1 flex-1 rounded-lg ${passwordStrength > 1 ? 'bg-orange-500' : 'bg-border'}`}></div>
                <div className={`h-1 flex-1 rounded-lg ${passwordStrength > 2 ? 'bg-yellow-500' : 'bg-border'}`}></div>
                <div className={`h-1 flex-1 rounded-lg ${passwordStrength > 3 ? 'bg-green-500' : 'bg-border'}`}></div>
                <div className={`h-1 flex-1 rounded-lg ${passwordStrength > 4 ? 'bg-green-700' : 'bg-border'}`}></div>
              </div>
              <p className="text-muted-foreground text-xs">Password strength: {
                passwordStrength === 0 ? "Very weak" :
                passwordStrength === 1 ? "Weak" :
                passwordStrength === 2 ? "Fair" :
                passwordStrength === 3 ? "Good" :
                passwordStrength === 4 ? "Strong" : "Very strong"
              }</p>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pl-10 pr-10 ${confirmPassword && password !== confirmPassword ? 'border-destructive' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-destructive text-xs mt-1">Passwords do not match</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
          ) : (
            <>
              Reset password
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    );
  };

  return (
    <div className="flex items-center justify-center h-screen py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-muted-foreground">
            Create a new secure password for your account
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">New Password</CardTitle>
              <CardDescription>
                Choose a strong password to protect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

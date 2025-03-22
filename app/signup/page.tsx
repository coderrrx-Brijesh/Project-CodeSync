"use client";

import { useState } from "react";
import { useSession,signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, Github, Mail, Lock, User, AlertCircle, Check, Info, Facebook } from "lucide-react";
import Link from "next/link";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError("Please use a stronger password");
      setIsLoading(false);
      return;
    }
    
    try {
      // Implement API call for signup
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      // Check if email verification is required
      if (data.requiresVerification) {
        // Redirect to email verification page
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      
      // Auto-login after signup if no verification required
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
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

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground">
            Join CodeSync to start collaborating in real-time
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
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
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
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
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      className="pl-10"
                      required
                    />
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
                      <ul className="space-y-1 mt-2">
                        <li className="flex items-center gap-1">
                          {minLength ? 
                            <Check className="h-3 w-3 text-green-500" /> : 
                            <Info className="h-3 w-3 text-muted-foreground" />} 
                          <span className={minLength ? "text-green-500" : "text-muted-foreground"}>
                            At least 8 characters
                          </span>
                        </li>
                        <li className="flex items-center gap-1">
                          {hasUppercase ? 
                            <Check className="h-3 w-3 text-green-500" /> : 
                            <Info className="h-3 w-3 text-muted-foreground" />} 
                          <span className={hasUppercase ? "text-green-500" : "text-muted-foreground"}>
                            Uppercase letter (A-Z)
                          </span>
                        </li>
                        <li className="flex items-center gap-1">
                          {hasLowercase ? 
                            <Check className="h-3 w-3 text-green-500" /> : 
                            <Info className="h-3 w-3 text-muted-foreground" />} 
                          <span className={hasLowercase ? "text-green-500" : "text-muted-foreground"}>
                            Lowercase letter (a-z)
                          </span>
                        </li>
                        <li className="flex items-center gap-1">
                          {hasNumber ? 
                            <Check className="h-3 w-3 text-green-500" /> : 
                            <Info className="h-3 w-3 text-muted-foreground" />} 
                          <span className={hasNumber ? "text-green-500" : "text-muted-foreground"}>
                            Number (0-9)
                          </span>
                        </li>
                        <li className="flex items-center gap-1">
                          {hasSpecialChar ? 
                            <Check className="h-3 w-3 text-green-500" /> : 
                            <Info className="h-3 w-3 text-muted-foreground" />} 
                          <span className={hasSpecialChar ? "text-green-500" : "text-muted-foreground"}>
                            Special character (!@#$%^&*)
                          </span>
                        </li>
                      </ul>
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
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${confirmPassword && password !== confirmPassword ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-destructive text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm text-muted-foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full font-medium" 
                  disabled={isLoading || !agreeToTerms || password !== confirmPassword}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <CardFooter className="flex flex-col space-y-2 pt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={() => signIn("github", { callbackUrl: "/" })}
                      className="w-full"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign up with GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                      className="w-full"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Google
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign up with Google</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={() => signIn("facebook", { callbackUrl: "/" })}
                      className="w-full"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign up with Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.p 
          variants={itemVariants} 
          className="text-center text-sm text-muted-foreground"
        >
          Already have an account?{" "}
          <Link href="/signin" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

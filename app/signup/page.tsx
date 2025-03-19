"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your sign-up API call here.
    // For example, you could POST to an API route that creates a new user.
    // After successful signup, you might want to auto-login:
    // await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName" className="block mb-1">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="block mb-1">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="block mb-1">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" className="block mb-1">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>

      <div className="flex flex-col gap-2 mt-6">
        <Button variant="outline" onClick={() => signIn("github")}>
          Sign Up with GitHub
        </Button>
        <Button variant="outline" onClick={() => signIn("google")}>
          Sign Up with Google
        </Button>
        <Button variant="outline" onClick={() => signIn("facebook")}>
          Sign Up with Facebook
        </Button>
      </div>
    </div>
  );
}

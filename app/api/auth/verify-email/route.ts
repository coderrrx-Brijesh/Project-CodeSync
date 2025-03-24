import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/config/dbConfig";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/send-verification-email";

// Handle GET requests to verify email
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const verifyToken = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!verifyToken || !email) {
      return NextResponse.json({ error: "Missing email or verification token" }, { status: 400 });
    }

    await connectDB();

    // Find user with matching email first
    const user = await User.findOne({ email: decodeURIComponent(email) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If already verified, return success
    if (user.isVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 200 });
    }

    // Check if token matches and hasn't expired
    // Be more lenient with token expiration - only check if token matches
    if (user.verifyToken !== verifyToken) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 });
    }

    // Token expiry check with more helpful error message
    if (user.verifyTokenExpiry && new Date(user.verifyTokenExpiry) < new Date()) {
      // Generate a new token for the user
      const newVerifyToken = crypto.randomBytes(32).toString("hex");
      user.verifyToken = newVerifyToken;
      user.verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Return a specific error that indicates token is expired but a new one has been generated
      return NextResponse.json({ 
        error: "Verification token has expired", 
        tokenExpired: true,
        newTokenGenerated: true 
      }, { status: 400 });
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
  }
}

// Handle POST requests to resend verification emails
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If already verified, return success
    if (user.isVerified) {
      return NextResponse.json({ 
        isVerified: true,
        message: "Email is already verified" 
      }, { status: 200 });
    }

    // Generate a new verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Return user data needed for sending verification email
    return NextResponse.json({
      isVerified: false,
      firstName: user.firstName,
      email: user.email,
      verifyToken: verifyToken,
      message: "New verification token generated"
    }, { status: 200 });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Failed to process verification request" }, { status: 500 });
  }
}

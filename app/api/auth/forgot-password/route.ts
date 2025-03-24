import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the user
    const user = await User.findOne({ email });
    
    // Don't reveal if a user was found or not for security reasons
    // Always return a success message even if user doesn't exist
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If your email is registered with us, you will receive a password reset link" },
        { status: 200 }
      );
    }
    
    // Generate a reset token that expires in 1 hour
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    await user.save();
    
    // In a real application, you would send an email with the reset link
    // For now, we'll just return the token in the response (don't do this in production)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    
    // Here you would call your email sending service
    // await sendEmail({
    //   to: email,
    //   subject: "Reset your password",
    //   text: `Click this link to reset your password: ${resetUrl}`,
    // });
    
    return NextResponse.json(
      { 
        success: true, 
        message: "If your email is registered with us, you will receive a password reset link",
        // Only include debug info in development
        ...(process.env.NODE_ENV === "development" ? { resetUrl } : {})
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

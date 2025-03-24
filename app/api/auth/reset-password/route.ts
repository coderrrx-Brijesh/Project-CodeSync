import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }
    
    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the user with a valid reset token that hasn't expired
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    
    await user.save();
    
    return NextResponse.json(
      { success: true, message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

// Verify if a token is valid
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if token exists and hasn't expired
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return NextResponse.json(
        { valid: false },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in reset-password verification:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying the token" },
      { status: 500 }
    );
  }
}

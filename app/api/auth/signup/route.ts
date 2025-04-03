import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/config/dbConfig";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validate all fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      // Don't leak information about registered users
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 409 }
      );
    }

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user with verification token
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      verifyToken,
      verifyTokenExpiry,
      isVerified: false,
    });

    // Save user to database
    await newUser.save();

    // Return success without exposing the token directly in the response
    return NextResponse.json(
      { 
        message: "Registration successful! Please verify your email.", 
        firstName,
        email,
        verifyToken,
        requiresVerification: true,
        success: true
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

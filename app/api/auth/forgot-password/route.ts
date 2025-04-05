import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Find the user
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.forgotPasswordToken = resetToken;
      user.forgotPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message:
            "If your email is registered with us, you will receive a password reset link",
          link: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`,
          userName: user.firstName + " " + user.lastName,
          email: user.email,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

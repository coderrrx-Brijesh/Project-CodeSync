import { NextRequest, NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

// Create an instance of Resend using your API key from environment variables.
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON body
    const { firstName, email, verifyToken } = await request.json();
    
    // Validate required fields
    if (!firstName || !email || !verifyToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "CodeSync <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to CodeSync - Verify Your Email",
      react: EmailTemplate({ firstName, email, verifyToken }),
    });
    
    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Verification email sent", data },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in send/route.ts:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

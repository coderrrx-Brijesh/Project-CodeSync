import { NextRequest, NextResponse } from "next/server";

// This endpoint receives email send status from the iframe
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.success) {
      console.log(`Verification email sent successfully to: ${data.email}`);
    } else {
      console.error("Email sending failed:", data.error);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error in verification-sent:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

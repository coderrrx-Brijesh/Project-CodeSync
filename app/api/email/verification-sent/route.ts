import { NextRequest, NextResponse } from "next/server";

// This endpoint receives email send status from the iframe
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const emailType = data.type || "verification"; // Default to verification

    if (data.success) {
      console.log(
        `${emailType === "reset-password" ? "Password reset" : "Verification"} email sent successfully to: ${data.email}`
      );
    } else {
      console.error(
        `${emailType === "reset-password" ? "Password reset" : "Verification"} email sending failed:`,
        data.error
      );
    }

    return NextResponse.json({ received: true, type: emailType });
  } catch (error: any) {
    console.error("Error in verification-sent:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

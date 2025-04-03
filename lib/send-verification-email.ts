"use client";
import emailjs from "@emailjs/browser";
import { NextResponse } from "next/server";

export const sendVerificationEmail = async ({
  firstName,
  email,
  verifyToken,
}: {
  firstName: string;
  email: string;
  verifyToken: string;
}) => {
  try {
    // Make sure the email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Ensure we have all required data
    if (!firstName || !email || !verifyToken) {
      throw new Error("Missing required fields for verification email");
    }

    // Create the verification URL - using same format as before
    const verificationUrl = `localhost:3000/verify-email?token=${verifyToken}&email=${encodeURIComponent(email)}`;

    // Send email using EmailJS
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: email,
        to_name: firstName,
        verification_url: verificationUrl,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    if (response.status !== 200) {
      throw new Error("Failed to send verification email");
    }

    // Return a regular object that can be checked for status in client component
    return {
      status: 200,
      json: () => ({
        message: "Verification email sent successfully",
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    // Return a response-like object to maintain compatibility
    return {
      status: 500,
      json: () => ({
        message: "Failed to send verification email",
        success: false,
      }),
    };
  }
};

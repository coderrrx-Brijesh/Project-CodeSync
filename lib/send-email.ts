"use client";
import emailjs from "@emailjs/browser";

export const sendEmail = async ({
  userName,
  email,
  link,
  template_id,
}: {
  userName: string;
  email: string;
  link: string;
  template_id: string;
}) => {
  try {
    // Make sure the email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Ensure we have all required data
    if (!userName || !email || !link) {
      throw new Error("Missing required fields for email");
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      template_id,
      {
        to_email: email,
        to_name: userName,
        link: link,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    if (response.status !== 200) {
      throw new Error("Failed to send email");
    }

    // Return a regular object that can be checked for status in client component
    return {
      status: 200,
      json: () => ({
        message: "Email sent successfully",
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    // Return a response-like object to maintain compatibility
    return {
      status: 500,
      json: () => ({
        message: "Failed to send email",
        success: false,
      }),
    };
  }
};

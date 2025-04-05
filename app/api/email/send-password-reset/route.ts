import { NextRequest, NextResponse } from "next/server";

// This endpoint handles the server-side password reset email requests
// It returns a simple HTML page with a script that uses EmailJS on the client side
export async function POST(request: NextRequest) {
  try {
    const { firstName, email, resetUrl } = await request.json();

    // Validate all required fields
    if (!firstName || !email || !resetUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Return an HTML page with a script that will execute EmailJS on the client side
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sending Password Reset Email</title>
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
        </head>
        <body>
          <div id="status">Sending password reset email...</div>
          
          <script type="text/javascript">
            (function() {
              emailjs.init("${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY}");
              
              emailjs.send(
                "${process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID}",
                "${process.env.NEXT_PUBLIC_EMAILJS_RESET_TEMPLATE_ID}",
                {
                  to_email: "${email}",
                  to_name: "${firstName}",
                  reset_link: "${resetUrl}",
                  user_name: "${firstName}"
                }
              ).then(
                function(response) {
                  document.getElementById("status").textContent = "Password reset email sent successfully!";
                  document.getElementById("result").textContent = JSON.stringify(response);
                  fetch("/api/email/verification-sent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ success: true, email: "${email}", type: "reset-password" })
                  });
                },
                function(error) {
                  document.getElementById("status").textContent = "Failed to send password reset email.";
                  document.getElementById("result").textContent = JSON.stringify(error);
                  fetch("/api/email/verification-sent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ success: false, error: error, type: "reset-password" })
                  });
                }
              );
            })();
          </script>
          
          <pre id="result"></pre>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-password-reset:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

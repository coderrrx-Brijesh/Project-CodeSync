import { NextRequest, NextResponse } from "next/server";

// This endpoint handles the server-side verification email requests
// It returns a simple HTML page with a script that uses EmailJS on the client side
export async function POST(request: NextRequest) {
  try {
    const { firstName, email, verificationUrl } = await request.json();

    // Validate all required fields
    if (!firstName || !email || !verificationUrl) {
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
          <title>Sending Verification Email</title>
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
        </head>
        <body>
          <div id="status">Sending verification email...</div>
          
          <script type="text/javascript">
            (function() {
              emailjs.init("${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY}");
              
              emailjs.send(
                "${process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID}",
                "${process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID}",
                {
                  to_email: "${email}",
                  to_name: "${firstName}",
                  verification_url: "${verificationUrl}"
                }
              ).then(
                function(response) {
                  document.getElementById("status").textContent = "Email sent successfully!";
                  document.getElementById("result").textContent = JSON.stringify(response);
                  fetch("/api/email/verification-sent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ success: true, email: "${email}" })
                  });
                },
                function(error) {
                  document.getElementById("status").textContent = "Failed to send email.";
                  document.getElementById("result").textContent = JSON.stringify(error);
                  fetch("/api/email/verification-sent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ success: false, error: error })
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
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in email/send-verification:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

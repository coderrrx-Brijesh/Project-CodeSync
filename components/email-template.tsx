interface EmailTemplateProps {
    firstName: string;
    email: string;
    verifyToken: string;
  }

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    email,
    verifyToken,
  }) => {
    // Update the verification URL to use the correct parameter name (token instead of verifyToken)
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verifyToken}&email=${encodeURIComponent(email)}`;
    
    return (
      <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#111" }}>
        <h1>Welcome, {firstName}!</h1>
        <p>
          Thank you for signing up for CodeSync. Please verify your email address by clicking the link below:
        </p>
        <a
          href={verificationUrl}
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#111",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Verify Email
        </a>
        <p style={{ marginTop: "20px", fontSize: "12px", color: "#555" }}>
          If you did not create this account, please ignore this email.
        </p>
      </div>
    );
  };
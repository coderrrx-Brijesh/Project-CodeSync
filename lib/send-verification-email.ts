export const sendVerificationEmail = async({firstName, email, verifyToken}: {firstName: string; email: string; verifyToken: string}) => {
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

        // Make the API call to send the email
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                firstName, 
                email, 
                verifyToken 
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to send verification email:", errorData);
            throw new Error(errorData.error || "Failed to send verification email");
        }
        
        return response;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
}
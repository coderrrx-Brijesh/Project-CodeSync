import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      {
        verifyToken: user.verifyToken,
        firstName: user.firstName,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in get-user-data API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

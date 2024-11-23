import User from "@/models/user";
import connectMongo from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { name, contact } = await req.json();

    if (!name || !contact) {
      return NextResponse.json(
        { error: "Name and contact number are required" },
        { status: 400 }
      );
    }

    // Find admin by name and contact
    const admin = await User.findOne({ name, contact, role: "admin" });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found. Please check your credentials." },
        { status: 404 }
      );
    }

    // Set a cookie for the admin session
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("admin_session", JSON.stringify({ id: admin._id }), {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/", // Cookie is accessible across the site
    });

    return response;
  } catch (error) {
    console.error("Error during admin login:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}

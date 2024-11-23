/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Team from "@/models/team";
import User from "@/models/user";
import connectMongo from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Fetch counts
    const totalTeams = await Team.countDocuments();
    const totalParticipants = await User.countDocuments({ role: "participant" });

    return NextResponse.json(
      {
        totalTeams,
        totalParticipants,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching stats" },
      { status: 500 }
    );
  }
}

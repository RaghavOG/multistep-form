/* eslint-disable @typescript-eslint/no-explicit-any */
import connectMongo from "@/lib/db"; // MongoDB connection helper
import Team from "@/models/team"; // Import Team schema
import User from "@/models/user"; // Import User schema
import { NextRequest, NextResponse } from "next/server"; // Types for Next.js request/response

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Parse incoming JSON request
    const body = await req.json();

    // Destructure data from the request body
    const { teamId, teamData, memberData } = body;

    if (!teamId || !teamData || !memberData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { teamName, teamLeader, numTeammates, numMales, numFemales, theme } = teamData;

    // Validate required fields
    if (!teamName || !teamLeader || !numTeammates || !theme || memberData.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields in teamData or memberData" },
        { status: 400 }
      );
    }

    const leaderExists = memberData.some((member: any) => member.name === teamLeader);
    if (!leaderExists) {
      return NextResponse.json(
        { error: "Team leader must be one of the team members" },
        { status: 400 }
      );
    }

    // Create user entries for each member
    const userIds = [];
    for (const member of memberData) {
      const { name, email, contact, college, stream, year, gender } = member;

      // Validate member fields
      if (!name || !email || !contact || !college || !stream || !year || !gender) {
        return NextResponse.json(
          { error: `Missing fields for member: ${name || "unknown"}` },
          { status: 400 }
        );
      }

      // Check if email or contact already exists
      const existingUser = await User.findOne({ $or: [{ email }, { contact }] });
      if (existingUser) {
        return NextResponse.json(
          { error: `A user with the provided email or contact already exists.` },
          { status: 400 }
        );
      }

      // Create new user entry
      const user = new User({
        user_id: `UID${Math.floor(Math.random() * 100000)}`,
        team_id: teamId, // Use the teamId sent from frontend
        name,
        email,
        contact,
        college,
        stream,
        year,
        gender,
        role: "participant",
      });

      await user.save();
      userIds.push(user._id); // Store the user ID
    }

    // Create team entry
    const team = new Team({
      team_id: teamId, // Use the teamId sent from frontend
      team_name: teamName,
      num_teammates: numTeammates,
      num_males: numMales,
      num_females: numFemales,
      theme,
      members: userIds, // Reference user IDs
    });

    await team.save();

    return NextResponse.json(
      { message: "Team registered successfully", team },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

import Team from "@/models/team";
import connectMongo from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const teamId = req.nextUrl.pathname.split("/").pop(); // Extract team_id from URL
    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const team = await Team.findOne({ team_id: teamId }).populate("members");
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch team details" }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();

    const teamId = req.nextUrl.pathname.split("/").pop(); // Extract team_id from URL
    const body = await req.json(); // Parse the incoming request body
    
    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const updatedTeam = await Team.findOneAndUpdate({ team_id: teamId }, body, { new: true }).populate("members");

    if (!updatedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update team details" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();

    const teamId = req.nextUrl.pathname.split("/").pop(); // Extract team_id from URL

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    // Delete the team
    const deletedTeam = await Team.findOneAndDelete({ team_id: teamId });
    if (!deletedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Delete associated participants
    const deletedParticipants = await User.deleteMany({ team_id: teamId });

    return NextResponse.json(
      {
        message: "Team and associated participants successfully deleted",
        deletedTeam,
        deletedParticipants: deletedParticipants.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete team and participants" }, { status: 500 });
  }
}


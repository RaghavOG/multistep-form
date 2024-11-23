/* eslint-disable @typescript-eslint/no-explicit-any */
import Team from "@/models/team";
import connectMongo from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    // Extract query parameters using get() method
    const theme = req.nextUrl.searchParams.get('theme');
    const search = req.nextUrl.searchParams.get('search');

    // Define query interface
    interface QueryParams {
      theme?: string;
      $or?: Array<Record<string, any>>;
    }

    const query: QueryParams = {};
    if (theme) query.theme = theme;

    // If search exists, perform a case-insensitive regex match on both team_name and team_id
    if (search) {
      query.$or = [
        { team_name: { $regex: search, $options: "i" } },
        { team_id: { $regex: search, $options: "i" } },
      ];
    }

    const teams = await Team.find(query).populate("members");
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

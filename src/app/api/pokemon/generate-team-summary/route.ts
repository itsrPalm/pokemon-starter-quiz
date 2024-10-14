// /src/app/api/pokemon/generate-team-summary/route.ts

import { generateTeamSummary } from "@/app/actions/generateTeamSummary";
import { NextRequest, NextResponse } from "next/server";
// import { generateTeamSummary } from '@/actions/generateTeamSummary';

export async function POST(request: NextRequest) {
	const { prompt } = await request.json();

	if (!prompt) {
		return NextResponse.json(
			{ error: "No prompt provided" },
			{ status: 400 }
		);
	}

	try {
		const summary = await generateTeamSummary(prompt);
		return NextResponse.json({ summary });
	} catch (error) {
		console.error("Error generating summary:", error);
		return NextResponse.json(
			{ error: "An error occurred while generating the summary." },
			{ status: 500 }
		);
	}
}

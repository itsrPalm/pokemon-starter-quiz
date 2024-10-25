// src/app/api/printful/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const clientId = process.env.PRINTFUL_CLIENT_ID as string;
const clientSecret = process.env.PRINTFUL_SECRET_KEY as string;

export async function POST(req_: NextRequest) {
	try {
		console.log("INIT REQUEST:\n", req_);
		// Get client credentials token
		const response = await axios.post(
			"https://www.printful.com/oauth/token",
			{
				grant_type: "client_credentials",
				client_id: clientId,
				client_secret: clientSecret,
			}
		);

		const { access_token, expires_in } = response.data;
		const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

		// Create or update access code record
		await prisma.accessCode.upsert({
			where: { id: "printful-access" },
			update: {
				accessToken: access_token,
				expiresAt: expiresAt,
				refreshToken: "", // Client credentials don't provide refresh token
			},
			create: {
				id: "printful-access",
				accessToken: access_token,
				expiresAt: expiresAt,
				refreshToken: "", // Client credentials don't provide refresh token
			},
		});

		return NextResponse.json({
			success: true,
			message: "Printful access initialized successfully",
		});
	} catch (error) {
		console.error("Failed to initialize Printful access:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to initialize Printful access",
			},
			{ status: 500 }
		);
	}
}

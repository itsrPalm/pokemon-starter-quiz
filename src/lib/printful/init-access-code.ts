// src/lib/printful/init-access-code.ts

import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function initializeAccessCode(authorizationCode: string) {
	const clientId = process.env.PRINTFUL_CLIENT_ID;
	const clientSecret = process.env.PRINTFUL_SECRET_KEY;

	try {
		const response = await axios.post(
			"https://www.printful.com/oauth/token",
			{
				grant_type: "authorization_code",
				client_id: clientId,
				client_secret: clientSecret,
				code: authorizationCode,
				redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/printful/callback`,
			}
		);

		const { access_token, expires_at, refresh_token } = response.data;

		await prisma.accessCode.create({
			data: {
				accessToken: access_token,
				expiresAt: expires_at,
				refreshToken: refresh_token,
			},
		});

		console.log("Successfully initialized access code");
		return true;
	} catch (error) {
		console.error("Failed to initialize access code:", error);
		return false;
	} finally {
		await prisma.$disconnect();
	}
}

import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { PrintfulClient } from "./printful-client";

const prisma = new PrismaClient();

const clientId = process.env.PRINTFUL_CLIENT_ID as string;
const clientSecret = process.env.PRINTFUL_SECRET_KEY as string;

// Retrieve Access Token from Prisma
const getAccessCode = async (): Promise<string> => {
	const accessCode = await prisma.accessCode.findFirst();

	if (!accessCode) {
		throw new Error("No access code data found");
	}

	const { accessToken, expiresAt, refreshToken } = accessCode;
	const now = Math.floor(Date.now() / 1000);

	if (now < expiresAt) {
		console.log("Using current access token", accessToken);
		return accessToken;
	} else {
		return getRefreshedCode(refreshToken);
	}
};

// Refresh Token using Prisma
const getRefreshedCode = async (
	currentRefreshToken: string
): Promise<string> => {
	try {
		const response = await axios.post(
			"https://www.printful.com/oauth/token",
			{
				grant_type: "refresh_token",
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: currentRefreshToken,
			}
		);

		const { access_token, expires_at, refresh_token } = response.data;

		// Update Prisma record
		await prisma.accessCode.upsert({
			where: { id: "access-code-id" }, // Use an appropriate condition or ID
			update: {
				accessToken: access_token,
				expiresAt: expires_at,
				refreshToken: refresh_token,
			},
			create: {
				accessToken: access_token,
				expiresAt: expires_at,
				refreshToken: refresh_token,
			},
		});

		console.log("Using refreshed access token", access_token);
		return access_token;
	} catch (e) {
		console.log("Error retrieving token:", e);
		throw e;
	}
};

// Export a function to get the PrintfulClient instead of instantiating it immediately
export const getPrintfulClient = async (): Promise<PrintfulClient> => {
	const accessCode = await getAccessCode();
	return new PrintfulClient(accessCode);
};

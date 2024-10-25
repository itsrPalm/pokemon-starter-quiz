// import { PrismaClient } from "@prisma/client";
// import axios from "axios";
// import { PrintfulClient } from "./printful-client";

// const prisma = new PrismaClient();

// const clientId = process.env.PRINTFUL_CLIENT_ID as string;
// const clientSecret = process.env.PRINTFUL_SECRET_KEY as string;

// // Retrieve Access Token from Prisma
// const getAccessCode = async (): Promise<string> => {
// 	const accessCode = await prisma.accessCode.findFirst();

// 	if (!accessCode) {
// 		throw new Error("No access code data found");
// 	}

// 	const { accessToken, expiresAt, refreshToken } = accessCode;
// 	const now = Math.floor(Date.now() / 1000);

// 	if (now < expiresAt) {
// 		console.log("Using current access token", accessToken);
// 		return accessToken;
// 	} else {
// 		return getRefreshedCode(refreshToken);
// 	}
// };

// // Refresh Token using Prisma
// const getRefreshedCode = async (
// 	currentRefreshToken: string
// ): Promise<string> => {
// 	try {
// 		const response = await axios.post(
// 			"https://www.printful.com/oauth/token",
// 			{
// 				grant_type: "refresh_token",
// 				client_id: clientId,
// 				client_secret: clientSecret,
// 				refresh_token: currentRefreshToken,
// 			}
// 		);

// 		const { access_token, expires_at, refresh_token } = response.data;

// 		// Update Prisma record
// 		await prisma.accessCode.upsert({
// 			where: { id: "access-code-id" }, // Use an appropriate condition or ID
// 			update: {
// 				accessToken: access_token,
// 				expiresAt: expires_at,
// 				refreshToken: refresh_token,
// 			},
// 			create: {
// 				accessToken: access_token,
// 				expiresAt: expires_at,
// 				refreshToken: refresh_token,
// 			},
// 		});

// 		console.log("Using refreshed access token", access_token);
// 		return access_token;
// 	} catch (e) {
// 		console.log("Error retrieving token:", e);
// 		throw e;
// 	}
// };

// // Export a function to get the PrintfulClient instead of instantiating it immediately
// export const getPrintfulClient = async (): Promise<PrintfulClient> => {
// 	const accessCode = await getAccessCode();
// 	return new PrintfulClient(accessCode);
// };

// src/lib/printful/printful-auth.ts

import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { PrintfulClient } from "./printful-client";

const prisma = new PrismaClient();

const clientId = process.env.PRINTFUL_CLIENT_ID as string;
const clientSecret = process.env.PRINTFUL_SECRET_KEY as string;

if (!clientId || !clientSecret) {
	throw new Error("Printful credentials not configured");
}

async function getClientCredentialsToken(): Promise<string> {
	try {
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

		return access_token;
	} catch (error) {
		console.error("Error getting client credentials token:", error);
		throw error;
	}
}

const getAccessCode = async (): Promise<string> => {
	try {
		const accessCode = await prisma.accessCode.findFirst();

		if (!accessCode) {
			console.log(
				"No access code found, getting client credentials token"
			);
			return getClientCredentialsToken();
		}

		const { accessToken, expiresAt, refreshToken } = accessCode;
		const now = Math.floor(Date.now() / 1000);

		if (now < expiresAt) {
			console.log("Using current access token");
			return accessToken;
		}

		if (refreshToken) {
			try {
				return await getRefreshedCode(refreshToken);
			} catch (error) {
				console.log(
					`Refresh token failed, falling back to client credentials:\n${error}`
				);
				return getClientCredentialsToken();
			}
		}

		console.log("No refresh token, getting client credentials token");
		return getClientCredentialsToken();
	} catch (error) {
		console.error("Error in getAccessCode:", error);
		throw error;
	}
};

const getRefreshedCode = async (refreshToken: string): Promise<string> => {
	try {
		const response = await axios.post(
			"https://www.printful.com/oauth/token",
			{
				grant_type: "refresh_token",
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken,
			}
		);

		const { access_token, expires_in, refresh_token } = response.data;
		const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

		await prisma.accessCode.update({
			where: { id: "printful-access" },
			data: {
				accessToken: access_token,
				expiresAt: expiresAt,
				refreshToken: refresh_token || "",
			},
		});

		return access_token;
	} catch (error) {
		console.error("Error refreshing token:", error);
		throw error;
	}
};

export const getPrintfulClient = async (): Promise<PrintfulClient> => {
	try {
		const accessToken = await getAccessCode();
		return new PrintfulClient(accessToken);
	} catch (error) {
		console.error("Error getting Printful client:", error);
		throw error;
	}
};

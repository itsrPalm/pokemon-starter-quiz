// // src/lib/printful/printful-auth.ts

// import { PrintfulClient } from "./printful-client";

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// if (!PRINTFUL_API_KEY) {
// 	throw new Error(
// 		"PRINTFUL_API_KEY is not configured in environment variables"
// 	);
// }

// export const getPrintfulClient = async (): Promise<PrintfulClient> => {
// 	try {
// 		return new PrintfulClient(PRINTFUL_API_KEY);
// 	} catch (error) {
// 		console.error("Error getting Printful client:", error);
// 		throw error;
// 	}
// };

// src/lib/printful/printful-auth.ts

// import { PrintfulClient } from "./printful-client";

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// if (!PRINTFUL_API_KEY) {
// 	throw new Error(
// 		"PRINTFUL_API_KEY is not configured in environment variables"
// 	);
// }

// export const getPrintfulClient = async (): Promise<PrintfulClient> => {
// 	try {
// 		return new PrintfulClient(PRINTFUL_API_KEY);
// 	} catch (error) {
// 		console.error("Error getting Printful client:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw new Error("Failed to initialize Printful client");
// 	}
// };

// src/lib/printful/printful-auth.ts
// file errors
// import { PrintfulClient } from "./printful-client";

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// if (!PRINTFUL_API_KEY) {
// 	throw new Error(
// 		"PRINTFUL_API_KEY is not configured in environment variables"
// 	);
// }

// export const getPrintfulClient = async (): Promise<PrintfulClient> => {
// 	try {
// 		const client = new PrintfulClient(PRINTFUL_API_KEY);

// 		// Test the connection
// 		try {
// 			await client.get("store");
// 			console.log("Successfully connected to Printful API");
// 		} catch (error) {
// 			console.error("Failed to connect to Printful API:", error);
// 			throw new Error("Failed to validate Printful API connection");
// 		}

// 		return client;
// 	} catch (error) {
// 		console.error("Error getting Printful client:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw new Error("Failed to initialize Printful client");
// 	}
// };

// src/lib/printful/printful-auth.ts

// import { PrintfulClient } from "./printful-client";

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// if (!PRINTFUL_API_KEY) {
// 	throw new Error(
// 		"PRINTFUL_API_KEY is not configured in environment variables"
// 	);
// }

// export const getPrintfulClient = async (): Promise<PrintfulClient> => {
// 	try {
// 		const client = new PrintfulClient(PRINTFUL_API_KEY);

// 		// Test the connection
// 		try {
// 			await client.get("store");
// 			console.log("Successfully connected to Printful API");
// 		} catch (error) {
// 			console.error("Failed to connect to Printful API:", error);
// 			throw new Error("Failed to validate Printful API connection");
// 		}

// 		return client;
// 	} catch (error) {
// 		console.error("Error getting Printful client:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw new Error("Failed to initialize Printful client");
// 	}
// };

// src/lib/printful/printful-auth.ts

import { PrintfulClient } from "./printful-client";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
	throw new Error(
		"PRINTFUL_API_KEY is not configured in environment variables"
	);
}

export const getPrintfulClient = async (): Promise<PrintfulClient> => {
	try {
		return new PrintfulClient(PRINTFUL_API_KEY);
	} catch (error) {
		console.error("Error getting Printful client:", {
			error,
			errorMessage:
				error instanceof Error ? error.message : "Unknown error",
			errorStack: error instanceof Error ? error.stack : undefined,
		});
		throw new Error("Failed to initialize Printful client");
	}
};

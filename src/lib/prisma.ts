// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";

// dotenv.config(); // Manually load environment variables

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma =
// 	globalForPrisma.prisma ||
// 	new PrismaClient({
// 		log: ["query"],
// 	});

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Add this comment to disable the ESLint 'no-var' rule for the next line
/* eslint-disable no-var */
declare global {
	var prisma: PrismaClient | undefined;
}
/* eslint-enable no-var */

// Prevent multiple instances of Prisma Client in development
export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ["query"], // Optional: Log queries for debugging
	});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Ensure the file is treated as a module by adding an empty export statement
export {};

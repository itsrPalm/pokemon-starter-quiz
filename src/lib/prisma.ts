// // /src/lib/prisma.ts

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma =
// 	globalForPrisma.prisma ||
// 	new PrismaClient({
// 		log: ["query"],
// 	});

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // Manually load environment variables

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ["query"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

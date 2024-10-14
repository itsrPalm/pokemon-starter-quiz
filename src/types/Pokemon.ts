// // // /src/types/Pokemon.ts

// // export interface Pokemon {
// // 	name: string;
// // 	description: string;
// // 	detailedDescription: string[];
// // 	image: string | null;
// // }

// // /src/types/Pokemon.ts

// export interface Pokemon {
// 	name: string;
// 	description: string;
// 	detailedDescription: string[];
// 	image: string | null;
// 	[key: string]: any; // Add index signature to allow additional properties
// }

// /src/types/Pokemon.ts

import { Prisma } from "@prisma/client";

export interface Pokemon extends Prisma.JsonObject {
	name: string;
	description: string;
	detailedDescription: string[];
	image: string | null;
}

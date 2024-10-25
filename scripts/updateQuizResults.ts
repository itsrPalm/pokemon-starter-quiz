// // scripts/updateQuizResults.ts

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
// 	// Fetch a HatProduct to associate (replace with appropriate logic)
// 	const defaultHatProduct = await prisma.hatProduct.findFirst();

// 	if (!defaultHatProduct) {
// 		throw new Error("No HatProduct found. Please create one first.");
// 	}

// 	// Update QuizResult records without hatProductId
// 	const updatedQuizResults = await prisma.quizResult.updateMany({
// 		where: {
// 			hatProductId: null,
// 		},
// 		data: {
// 			hatProductId: defaultHatProduct.id,
// 			svgMap: {}, // Assign a default JSON value or appropriate data
// 		},
// 	});

// 	console.log(`Updated ${updatedQuizResults.count} QuizResult records.`);
// }

// main()
// 	.catch((e) => {
// 		console.error(e);
// 		process.exit(1);
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect();
// 	});

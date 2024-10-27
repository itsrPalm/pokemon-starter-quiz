// // // src/app/api/mockup/route.ts

// // import { NextRequest, NextResponse } from 'next/server';
// // import axios from 'axios';

// // export async function POST(request: NextRequest) {
// //   try {
// //     const { variantId, imageUrl } = await request.json();

// //     const response = await axios.post(
// //       'https://api.printful.com/mockup-generator/create-task',
// //       {
// //         variant_ids: [variantId],
// //         format: 'jpg',
// //         files: [
// //           {
// //             placement: 'front',
// //             image_url: imageUrl,
// //             position: {
// //               area_width: 1800,
// //               area_height: 1800,
// //               width: 1800,
// //               height: 1800,
// //               top: 0,
// //               left: 0,
// //             },
// //           },
// //         ],
// //       },
// //       {
// //         headers: {
// //           'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
// //         },
// //       }
// //     );

// //     const taskKey = response.data.result.task_key;

// //     // Poll for mockup generation completion
// //     let mockupUrl: string | null = null;
// //     while (!mockupUrl) {
// //       await new Promise((resolve) => setTimeout(resolve, 1000));
// //       const taskResponse = await axios.get(
// //         `https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
// //           },
// //         }
// //       );

// //       if (taskResponse.data.result.status === 'completed') {
// //         mockupUrl = taskResponse.data.result.mockups[0].mockup_url;
// //       } else if (taskResponse.data.result.status === 'failed') {
// //         throw new Error('Mockup generation failed');
// //       }
// //     }

// //     return NextResponse.json({ mockupUrl });
// //   } catch (error) {
// //     console.error('Error generating mockup:', error);
// //     return NextResponse.json({ error: 'Failed to generate mockup' }, { status: 500 });
// //   }
// // }

// // import { NextRequest, NextResponse } from "next/server";
// // import axios from "axios";

// // export async function POST(request: NextRequest) {
// // 	try {
// // 		const { variantId, imageUrl } = await request.json();

// // 		const response = await axios.post(
// // 			"https://api.printful.com/mockup-generator/create-task",
// // 			{
// // 				variant_ids: [variantId],
// // 				format: "png",
// // 				files: [
// // 					{
// // 						placement: "front",
// // 						image_url: imageUrl,
// // 						position: {
// // 							area_width: 1800,
// // 							area_height: 1800,
// // 							width: 1800,
// // 							height: 1800,
// // 							top: 0,
// // 							left: 0,
// // 						},
// // 					},
// // 				],
// // 			},
// // 			{
// // 				headers: {
// // 					Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // 				},
// // 			}
// // 		);

// // 		const taskKey = response.data.result.task_key;

// // 		let mockupUrl: string | null = null;
// // 		while (!mockupUrl) {
// // 			await new Promise((resolve) => setTimeout(resolve, 1000));
// // 			const taskResponse = await axios.get(
// // 				`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
// // 				{
// // 					headers: {
// // 						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // 					},
// // 				}
// // 			);

// // 			if (taskResponse.data.result.status === "completed") {
// // 				mockupUrl = taskResponse.data.result.mockups[0].mockup_url;
// // 			} else if (taskResponse.data.result.status === "failed") {
// // 				throw new Error("Mockup generation failed");
// // 			}
// // 		}

// // 		return NextResponse.json({ mockupUrl });
// // 	} catch (error) {
// // 		console.error("Error generating mockup:", error);
// // 		return NextResponse.json(
// // 			{ error: "Failed to generate mockup" },
// // 			{ status: 500 }
// // 		);
// // 	}
// // }

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(request: NextRequest) {
// 	try {
// 		const { variantId, imageUrl } = await request.json();

// 		if (!variantId) {
// 			throw new Error("Variant ID is required");
// 		}

// 		console.log("Creating mockup for variant:", { variantId, imageUrl });

// 		const response = await axios.post(
// 			"https://api.printful.com/mockup-generator/create-task",
// 			{
// 				variant_ids: [Number(variantId)], // Convert to number if it's a string
// 				format: "png",
// 				files: [
// 					{
// 						placement: "embroidery_front",
// 						image_url: imageUrl,
// 						position: {
// 							area_width: 1800,
// 							area_height: 1800,
// 							width: 1500,
// 							height: 1500,
// 							top: 150,
// 							left: 150,
// 						},
// 					},
// 				],
// 				options: {
// 					scaling: "fit",
// 					background: "white",
// 				},
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// 				},
// 			}
// 		);

// 		if (!response.data?.result?.task_key) {
// 			throw new Error("No task key received from Printful");
// 		}

// 		const taskKey = response.data.result.task_key;
// 		console.log("Mockup task created:", taskKey);

// 		let attempts = 0;
// 		const maxAttempts = 10;
// 		let mockupUrl: string | null = null;

// 		while (!mockupUrl && attempts < maxAttempts) {
// 			await new Promise((resolve) => setTimeout(resolve, 2000));
// 			attempts++;

// 			const taskResponse = await axios.get(
// 				`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
// 				{
// 					headers: {
// 						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// 					},
// 				}
// 			);

// 			console.log(
// 				`Mockup check attempt ${attempts}:`,
// 				taskResponse.data.result.status
// 			);

// 			if (taskResponse.data.result.status === "completed") {
// 				if (taskResponse.data.result.mockups?.[0]?.mockup_url) {
// 					mockupUrl = taskResponse.data.result.mockups[0].mockup_url;
// 					break;
// 				}
// 			} else if (taskResponse.data.result.status === "failed") {
// 				throw new Error(
// 					`Mockup generation failed: ${
// 						taskResponse.data.result.error || "Unknown error"
// 					}`
// 				);
// 			}
// 		}

// 		if (!mockupUrl) {
// 			throw new Error("Failed to generate mockup after maximum attempts");
// 		}

// 		console.log("Mockup generated successfully:", mockupUrl);
// 		return NextResponse.json({ mockupUrl });
// 	} catch (error) {
// 		console.error("Error generating mockup:", error);

// 		// More detailed error response
// 		const errorMessage =
// 			error instanceof Error ? error.message : "Unknown error";
// 		const errorResponse = {
// 			error: "Failed to generate mockup",
// 			details: errorMessage,
// 			technicalDetails:
// 				error instanceof Error && error.cause ? error.cause : undefined,
// 		};

// 		return NextResponse.json(errorResponse, { status: 500 });
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";

export async function POST(request: NextRequest) {
	try {
		const { variantId, imageUrl } = await request.json();

		console.log("Creating mockup for variant:", { variantId, imageUrl });

		// First, get the sync variant ID
		const syncResponse = await axios.get(
			`https://api.printful.com/store/products?limit=1`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
				},
			}
		);

		if (!syncResponse.data?.result?.[0]?.sync_variant_id) {
			throw new Error("No sync variant ID found");
		}

		const syncVariantId = syncResponse.data.result[0].sync_variant_id;
		console.log("Found sync variant ID:", syncVariantId);

		// Now create the mockup with the sync variant ID
		const response = await axios.post(
			"https://api.printful.com/mockup-generator/create-task",
			{
				variant_ids: [syncVariantId],
				format: "png",
				files: [
					{
						placement: "embroidery_front",
						image_url: imageUrl,
						position: {
							area_width: 1800,
							area_height: 1800,
							width: 1500,
							height: 1500,
							top: 150,
							left: 150,
						},
					},
				],
				options: {
					scaling: "fit",
					background: "white",
				},
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
				},
			}
		);

		if (!response.data?.result?.task_key) {
			console.error("Printful response:", response.data);
			throw new Error("No task key received from Printful");
		}

		const taskKey = response.data.result.task_key;
		console.log("Mockup task created:", taskKey);

		let attempts = 0;
		const maxAttempts = 10;
		let mockupUrl: string | null = null;

		while (!mockupUrl && attempts < maxAttempts) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			attempts++;

			const taskResponse = await axios.get(
				`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
					},
				}
			);

			console.log(
				`Mockup check attempt ${attempts}:`,
				taskResponse.data.result.status
			);

			if (taskResponse.data.result.status === "completed") {
				if (taskResponse.data.result.mockups?.[0]?.mockup_url) {
					mockupUrl = taskResponse.data.result.mockups[0].mockup_url;
					break;
				}
			} else if (taskResponse.data.result.status === "failed") {
				throw new Error(
					`Mockup generation failed: ${
						taskResponse.data.result.error || "Unknown error"
					}`
				);
			}
		}

		if (!mockupUrl) {
			throw new Error("Failed to generate mockup after maximum attempts");
		}

		console.log("Mockup generated successfully:", mockupUrl);
		return NextResponse.json({ mockupUrl });
	} catch (error) {
		console.error("Error generating mockup:", error);

		// More detailed error response including the actual Printful error if available
		const errorDetails =
			error instanceof Error ? error.message : "Unknown error";
		const response =
			error instanceof Error && "response" in error
				? (error as { response?: AxiosResponse }).response?.data
				: null; // Specify the type

		return NextResponse.json(
			{
				error: "Failed to generate mockup",
				details: errorDetails,
				printfulError: response,
			},
			{ status: 500 }
		);
	}
}

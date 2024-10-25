// // src/app/api/mockup/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';

// export async function POST(request: NextRequest) {
//   try {
//     const { variantId, imageUrl } = await request.json();

//     const response = await axios.post(
//       'https://api.printful.com/mockup-generator/create-task',
//       {
//         variant_ids: [variantId],
//         format: 'jpg',
//         files: [
//           {
//             placement: 'front',
//             image_url: imageUrl,
//             position: {
//               area_width: 1800,
//               area_height: 1800,
//               width: 1800,
//               height: 1800,
//               top: 0,
//               left: 0,
//             },
//           },
//         ],
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
//         },
//       }
//     );

//     const taskKey = response.data.result.task_key;

//     // Poll for mockup generation completion
//     let mockupUrl: string | null = null;
//     while (!mockupUrl) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       const taskResponse = await axios.get(
//         `https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
//           },
//         }
//       );

//       if (taskResponse.data.result.status === 'completed') {
//         mockupUrl = taskResponse.data.result.mockups[0].mockup_url;
//       } else if (taskResponse.data.result.status === 'failed') {
//         throw new Error('Mockup generation failed');
//       }
//     }

//     return NextResponse.json({ mockupUrl });
//   } catch (error) {
//     console.error('Error generating mockup:', error);
//     return NextResponse.json({ error: 'Failed to generate mockup' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
	try {
		const { variantId, imageUrl } = await request.json();

		const response = await axios.post(
			"https://api.printful.com/mockup-generator/create-task",
			{
				variant_ids: [variantId],
				format: "jpg",
				files: [
					{
						placement: "front",
						image_url: imageUrl,
						position: {
							area_width: 1800,
							area_height: 1800,
							width: 1800,
							height: 1800,
							top: 0,
							left: 0,
						},
					},
				],
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
				},
			}
		);

		const taskKey = response.data.result.task_key;

		let mockupUrl: string | null = null;
		while (!mockupUrl) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const taskResponse = await axios.get(
				`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
					},
				}
			);

			if (taskResponse.data.result.status === "completed") {
				mockupUrl = taskResponse.data.result.mockups[0].mockup_url;
			} else if (taskResponse.data.result.status === "failed") {
				throw new Error("Mockup generation failed");
			}
		}

		return NextResponse.json({ mockupUrl });
	} catch (error) {
		console.error("Error generating mockup:", error);
		return NextResponse.json(
			{ error: "Failed to generate mockup" },
			{ status: 500 }
		);
	}
}

// // /src/actions/generateTeamSummary.ts

// "use server";

// import OpenAI from "openai";

// export async function generateTeamSummary(prompt: string): Promise<string> {
// 	const openai = new OpenAI({
// 		apiKey: process.env.OPENAI_API_KEY,
// 	});

// 	try {
// 		const completion = await openai.chat.completions.create({
// 			model: "gpt-4o-mini", // Use 'gpt-4' model
// 			messages: [{ role: "user", content: prompt }],
// 			max_tokens: 256,
// 			temperature: 0.7,
// 		});

// 		const summary = completion.choices[0]?.message?.content?.trim();
// 		return summary || "No summary generated.";
// 	} catch (error) {
// 		console.error("Error generating summary:", error);
// 		return "An error occurred while generating your team summary. Please try again later.";
// 	}
// }

// /src/actions/generateTeamSummary.ts

"use server";

import OpenAI from "openai";

export async function generateTeamSummary(prompt: string): Promise<string> {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	try {
		const completion = await openai.chat.completions.create({
			// model: "gpt-4", // Use 'gpt-4' model
			model: "gpt-3.5-turbo-0125",
			// model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
			max_tokens: 256,
			temperature: 0.7,
		});

		let summary =
			completion.choices[0]?.message?.content?.trim() ||
			"No summary generated.";

		// Check if the summary ends with a period
		if (!summary.endsWith(".")) {
			// Remove the last incomplete sentence
			const sentences = summary.split(".");
			if (sentences.length > 1) {
				// Remove the last incomplete sentence
				sentences.pop();
				summary = sentences.join(".").trim() + ".";
			} else {
				// If there's only one sentence fragment, return an empty string or handle accordingly
				summary = "";
			}
		}

		return summary;
	} catch (error) {
		console.error("Error generating summary:", error);
		return "An error occurred while generating your team summary. Please try again later.";
	}
}

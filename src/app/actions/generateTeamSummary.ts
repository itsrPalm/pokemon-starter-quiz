// /src/actions/generateTeamSummary.ts

"use server";

import OpenAI from "openai";

export async function generateTeamSummary(prompt: string): Promise<string> {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini", // Use 'gpt-4' model
			messages: [{ role: "user", content: prompt }],
			max_tokens: 1024,
			temperature: 0.7,
		});

		const summary = completion.choices[0]?.message?.content?.trim();
		return summary || "No summary generated.";
	} catch (error) {
		console.error("Error generating summary:", error);
		return "An error occurred while generating your team summary. Please try again later.";
	}
}

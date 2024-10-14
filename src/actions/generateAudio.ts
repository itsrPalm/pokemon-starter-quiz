// /src/actions/generateAudio.ts

import axios from "axios";

export async function generateAudio(text: string): Promise<Buffer> {
	const apiKey = process.env.ELEVENLABS_API_KEY;
	const voiceId = process.env.ELEVENLABS_VOICE_ID;

	if (!apiKey) {
		throw new Error("ELEVENLABS_API_KEY is not set");
	}
	if (!voiceId) {
		throw new Error("ELEVENLABS_VOICE_ID is not set");
	}

	const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

	const headers = {
		// Accept: "audio/mpeg",
		Accept: "audio/mp3",
		"Content-Type": "application/json",
		"xi-api-key": apiKey,
	};

	const data = {
		text,
		model_id: "eleven_multilingual_v2",
		// Optionally, you can add voice settings
		voice_settings: {
			stability: 0.5,
			similarity_boost: 0.5,
		},
	};

	try {
		const response = await axios.post(url, data, {
			headers,
			responseType: "arraybuffer",
		});
		return Buffer.from(response.data);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error generating audio:", error.message);
		} else {
			console.error("Error generating audio:", error);
		}
		throw new Error("Failed to generate audio");
	}
}

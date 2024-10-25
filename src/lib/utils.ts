import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// src/lib/utils.ts

/**
 * Removes Markdown code block formatting from a string.
 * @param input The input string potentially containing Markdown code blocks.
 * @returns The sanitized string without code block formatting.
 */
export function stripMarkdownCodeBlocks(input: string): string {
	// Regex to match ```json ... ``` or ``` ... ``` blocks
	const codeBlockRegex = /```(?:json)?\n?([\s\S]*?)```/;
	const match = input.match(codeBlockRegex);
	if (match && match[1]) {
		return match[1].trim();
	}
	return input.trim();
}

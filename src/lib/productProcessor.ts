import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { stripMarkdownCodeBlocks } from "./utils";
import logger from "@/lib/logger";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

export interface ProcessedProduct {
	id: string;
	name: string;
	type: string;
	description: string;
	printfulId: number;
	variants: Array<{
		id: string;
		name: string;
		size: string | null;
		color: string | null;
		price: number;
		retailPrice: number;
		printfulId: number;
	}>;
}

export class ProductCatalogProcessor {
	private static instance: ProductCatalogProcessor;
	private model: ChatGoogleGenerativeAI;
	private vectorStore: MemoryVectorStore | null = null;
	private embeddings: GoogleGenerativeAIEmbeddings;
	private initializationPromise: Promise<void> | null = null;

	private constructor() {
		const apiKey = process.env.GOOGLE_API_KEY;
		if (!apiKey) throw new Error("Google API key is required");

		this.model = new ChatGoogleGenerativeAI({
			modelName: "gemini-pro",
			apiKey,
			maxOutputTokens: 2048,
			temperature: 0.1,
		});

		this.embeddings = new GoogleGenerativeAIEmbeddings({
			apiKey,
		});
	}

	/**
	 * Retrieves the singleton instance of ProductCatalogProcessor.
	 */
	static getInstance(): ProductCatalogProcessor {
		if (!ProductCatalogProcessor.instance) {
			ProductCatalogProcessor.instance = new ProductCatalogProcessor();
		}
		return ProductCatalogProcessor.instance;
	}

	/**
	 * Initializes the vector store by loading and processing the product data.
	 * Ensures that initialization occurs only once.
	 */
	async initialize(): Promise<void> {
		if (this.initializationPromise) {
			logger.info(
				"ProductCatalogProcessor: Initialization already in progress"
			);
			return this.initializationPromise;
		}

		this.initializationPromise = (async () => {
			try {
				logger.info("ProductCatalogProcessor: Starting initialization");
				const loader = new JSONLoader("public/printful-products.json");
				logger.info("ProductCatalogProcessor: Loading documents");
				const docs = await loader.load();
				logger.info(
					`ProductCatalogProcessor: Loaded ${docs.length} documents`
				);

				const textSplitter = new RecursiveCharacterTextSplitter({
					chunkSize: 1000,
					chunkOverlap: 200,
				});
				logger.info("ProductCatalogProcessor: Splitting documents");
				const splitDocs = await textSplitter.splitDocuments(docs);
				logger.info(
					`ProductCatalogProcessor: Split into ${splitDocs.length} chunks`
				);

				logger.info(
					"ProductCatalogProcessor: Creating vector store from documents"
				);
				this.vectorStore = await MemoryVectorStore.fromDocuments(
					splitDocs,
					this.embeddings
				);
				logger.info(
					"ProductCatalogProcessor: Vector store created successfully"
				);
			} catch (error) {
				logger.error(
					"ProductCatalogProcessor: Error during initialization - " +
						error
				);
				throw error;
			}
		})();

		return this.initializationPromise;
	}

	/**
	 * Type guard to check if response is an AIMessageChunk
	 */
	private isAIMessageChunk(
		response: unknown
	): response is { content: string } {
		return (
			typeof response === "object" &&
			response !== null &&
			"content" in response &&
			typeof (response as { content: unknown }).content === "string"
		);
	}

	/**
	 * Finds relevant products based on a query using the vector store and AI model.
	 * Ensures that descriptions are always non-null strings.
	 * @param query The search query.
	 * @param limit The maximum number of products to return.
	 * @returns An array of processed products.
	 */
	async findRelevantProducts(
		query: string,
		limit: number = 10
	): Promise<ProcessedProduct[]> {
		logger.info(
			`ProductCatalogProcessor: findRelevantProducts called with query='${query}' and limit=${limit}`
		);
		if (!this.vectorStore) {
			logger.info(
				"ProductCatalogProcessor: Vector store not initialized. Initializing now..."
			);
			await this.initialize();
		}

		if (!this.vectorStore) {
			logger.error(
				"ProductCatalogProcessor: Vector store is still not initialized after initialization attempt"
			);
			throw new Error("ProductCatalogProcessor not initialized");
		}

		try {
			logger.info(
				"ProductCatalogProcessor: Performing similarity search"
			);
			const results = await this.vectorStore.similaritySearch(
				query,
				limit
			);
			logger.info(
				`ProductCatalogProcessor: Similarity search returned ${results.length} results`
			);

			const prompt = `
Analyze these product details and structure them according to our format.
Focus on clothing items that would work well for custom designs.
Products: ${JSON.stringify(results)}

Return a structured JSON array of products with the following fields:
- id (string): Unique identifier for the product. Use the printfulId as the id.
- name (string): Name of the product.
- type (string): Standardized product type.
- description (string): Cleaned up description of the product.
- printfulId (number): Original Printful ID.
- variants (array): List of variants with the following fields:
  - id (string): Unique identifier for the variant.
  - name (string): Name of the variant.
  - size (string or null): Size of the variant.
  - color (string or null): Color of the variant.
  - price (number): Price of the variant.
  - retailPrice (number): Retail price of the variant.
  - printfulId (number): Original Printful ID of the variant.

**Important:** Do not include any markdown or code block formatting. Return only the raw JSON array.
`;

			logger.info(
				"ProductCatalogProcessor: Invoking AI model with prompt"
			);
			const response: unknown = await this.model.invoke(prompt);
			logger.info(
				"ProductCatalogProcessor: AI model invocation completed"
			);

			let parsedContent: string;

			if (typeof response === "string") {
				logger.info("ProductCatalogProcessor: Response is a string");
				parsedContent = response;
			} else if (this.isAIMessageChunk(response)) {
				logger.info(
					"ProductCatalogProcessor: Response is an AIMessageChunk with content"
				);
				parsedContent = response.content;
			} else {
				logger.warn(
					"ProductCatalogProcessor: Response is neither string nor AIMessageChunk. Serializing to string."
				);
				parsedContent = JSON.stringify(response);
			}

			if (!parsedContent) {
				logger.error(
					"ProductCatalogProcessor: No content received from model response"
				);
				throw new Error("No content received from model response");
			}

			logger.info("ProductCatalogProcessor: Sanitizing JSON content");
			parsedContent = stripMarkdownCodeBlocks(parsedContent);
			logger.info("ProductCatalogProcessor: JSON content sanitized");

			logger.info("ProductCatalogProcessor: Parsing JSON content");
			const parsedProducts = JSON.parse(
				parsedContent
			) as ProcessedProduct[];
			logger.info(
				`ProductCatalogProcessor: Parsed ${parsedProducts.length} products`
			);

			// Ensure that description is always a string and map printfulId to id if necessary
			const sanitizedProducts = parsedProducts.map((product) => ({
				id: product.id || uuidv4(), // Assign a UUID if id is missing
				name: product.name || "Unnamed Product",
				type: product.type || "Undefined Type",
				description: product.description ?? "",
				printfulId: product.printfulId,
				variants: product.variants.map((variant) => ({
					id: variant.id || uuidv4(), // Assign a UUID if id is missing
					name: variant.name || "Unnamed Variant",
					size: variant.size,
					color: variant.color,
					price: variant.price,
					retailPrice: variant.retailPrice,
					printfulId: variant.printfulId,
				})),
			}));
			logger.info(
				"ProductCatalogProcessor: Sanitized products to ensure non-null descriptions and IDs"
			);

			return sanitizedProducts;
		} catch (error) {
			logger.error(
				"ProductCatalogProcessor: Error in findRelevantProducts - " +
					error
			);
			throw error;
		}
	}
}

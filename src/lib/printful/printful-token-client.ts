import "cross-fetch/polyfill";

interface RequestParams {
	method?: "GET" | "POST" | "PUT" | "DELETE";
	endpoint: string;
	data?: Record<string, unknown>;
	params?: Record<string, string>;
}

interface ClientOptions {
	baseUrl?: string;
	headers?: Record<string, string>;
}

export class PrintfulClient {
	private printfulToken: string;
	private options: ClientOptions;
	private headers: Record<string, string>;

	constructor(printfulToken: string, options: ClientOptions = {}) {
		if (!printfulToken) throw new Error("Printful token not provided");

		const { headers } = options;

		this.printfulToken = printfulToken;

		this.options = {
			baseUrl: "https://api.printful.com",
			...options,
		};

		this.headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${printfulToken}`,
			...headers,
		};
	}

	async request({
		method = "GET",
		endpoint,
		data,
		params = {},
	}: RequestParams): Promise<unknown> {
		const { baseUrl } = this.options;

		const queryString = Object.keys(params).length
			? `?${Object.keys(params)
					.map(
						(key) =>
							`${encodeURIComponent(key)}=${encodeURIComponent(
								params[key]
							)}`
					)
					.join("&")}`
			: "";

		const url = `${baseUrl}/${endpoint}${queryString}`;

		const response = await fetch(url, {
			method,
			headers: this.headers,
			...(data && { body: JSON.stringify(data) }),
		});

		const json = await response.json();

		if (!response.ok) throw json;

		return json;
	}

	get(
		endpoint: string,
		params: Record<string, string> = {}
	): Promise<unknown> {
		return this.request({ endpoint, params });
	}

	post(endpoint: string, data: Record<string, unknown>): Promise<unknown> {
		return this.request({ method: "POST", endpoint, data });
	}

	put(endpoint: string, data: Record<string, unknown>): Promise<unknown> {
		return this.request({ method: "PUT", endpoint, data });
	}

	delete(endpoint: string): Promise<unknown> {
		return this.request({ method: "DELETE", endpoint });
	}
}

export async function request(
	endpoint: string,
	{
		printfulToken,
		...rest
	}: { printfulToken: string; [key: string]: unknown }
): Promise<unknown> {
	const client = new PrintfulClient(printfulToken);
	return client.request({ endpoint, ...rest });
}

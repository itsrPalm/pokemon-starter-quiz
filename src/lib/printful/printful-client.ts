// // // // src/lib/printful/printful-client.ts

// // // import "cross-fetch/polyfill";

// // // interface RequestParams {
// // // 	method?: "GET" | "POST" | "PUT" | "DELETE";
// // // 	endpoint: string;
// // // 	data?: Record<string, unknown>;
// // // 	params?: Record<string, string>;
// // // }

// // // interface ClientOptions {
// // // 	baseUrl?: string;
// // // 	headers?: Record<string, string>;
// // // }

// // // export class PrintfulClient {
// // // 	private apiKey: string;
// // // 	private options: ClientOptions;
// // // 	private headers: Record<string, string>;

// // // 	constructor(apiKey: string, options: ClientOptions = {}) {
// // // 		if (!apiKey) throw new Error("Printful API key not provided");

// // // 		const { headers } = options;

// // // 		this.apiKey = apiKey;

// // // 		this.options = {
// // // 			baseUrl: "https://api.printful.com",
// // // 			...options,
// // // 		};

// // // 		this.headers = {
// // // 			"Content-Type": "application/json",
// // // 			Authorization: `Bearer ${apiKey}`,
// // // 			...headers,
// // // 		};
// // // 	}

// // // 	async request({
// // // 		method = "GET",
// // // 		endpoint,
// // // 		data,
// // // 		params = {},
// // // 	}: RequestParams): Promise<unknown> {
// // // 		const { baseUrl } = this.options;

// // // 		const queryString = Object.keys(params).length
// // // 			? `?${Object.keys(params)
// // // 					.map(
// // // 						(key) =>
// // // 							`${encodeURIComponent(key)}=${encodeURIComponent(
// // // 								params[key]
// // // 							)}`
// // // 					)
// // // 					.join("&")}`
// // // 			: "";

// // // 		const url = `${baseUrl}/${endpoint}${queryString}`;

// // // 		console.log(`Making Printful API request to: ${url}`, {
// // // 			method,
// // // 			headers: this.headers,
// // // 			data: data || null,
// // // 		});

// // // 		const response = await fetch(url, {
// // // 			method,
// // // 			headers: this.headers,
// // // 			...(data && { body: JSON.stringify(data) }),
// // // 		});

// // // 		const json = await response.json();

// // // 		if (!response.ok) {
// // // 			console.error("Printful API error:", {
// // // 				status: response.status,
// // // 				statusText: response.statusText,
// // // 				body: json,
// // // 			});
// // // 			throw json;
// // // 		}

// // // 		return json;
// // // 	}

// // // 	get(
// // // 		endpoint: string,
// // // 		params: Record<string, string> = {}
// // // 	): Promise<unknown> {
// // // 		return this.request({ endpoint, params });
// // // 	}

// // // 	post(endpoint: string, data: Record<string, unknown>): Promise<unknown> {
// // // 		return this.request({ method: "POST", endpoint, data });
// // // 	}

// // // 	put(endpoint: string, data: Record<string, unknown>): Promise<unknown> {
// // // 		return this.request({ method: "PUT", endpoint, data });
// // // 	}

// // // 	delete(endpoint: string): Promise<unknown> {
// // // 		return this.request({ method: "DELETE", endpoint });
// // // 	}
// // // }

// // import "cross-fetch/polyfill";

// // interface RequestParams {
// //     method?: "GET" | "POST" | "PUT" | "DELETE";
// //     endpoint: string;
// //     data?: Record<string, unknown>;
// //     params?: Record<string, string>;
// // }

// // interface ClientOptions {
// //     baseUrl?: string;
// //     headers?: Record<string, string>;
// // }

// // interface PrintfulResponse {
// //     code: number;
// //     result: any;
// //     extra: any[];
// //     [key: string]: any;
// // }

// // export class PrintfulClient {
// //     private apiKey: string;
// //     private options: ClientOptions;
// //     private headers: Record<string, string>;

// //     constructor(apiKey: string, options: ClientOptions = {}) {
// //         if (!apiKey) throw new Error("Printful API key not provided");

// //         this.apiKey = apiKey;
// //         this.options = {
// //             baseUrl: "https://api.printful.com",
// //             ...options,
// //         };

// //         this.headers = {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${apiKey}`,
// //             ...options.headers,
// //         };
// //     }

// //     async request({
// //         method = "GET",
// //         endpoint,
// //         data,
// //         params = {},
// //     }: RequestParams): Promise<PrintfulResponse> {
// //         const { baseUrl } = this.options;

// //         const queryString = Object.keys(params).length
// //             ? `?${Object.keys(params)
// //                   .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
// //                   .join("&")}`
// //             : "";

// //         const url = `${baseUrl}/${endpoint}${queryString}`;

// //         console.log(`Making Printful API request to: ${url}`, {
// //             method,
// //             headers: this.headers,
// //             data: data || null
// //         });

// //         const response = await fetch(url, {
// //             method,
// //             headers: this.headers,
// //             ...(data && { body: JSON.stringify(data) }),
// //         });

// //         const json = await response.json();

// //         if (!response.ok) {
// //             console.error("Printful API error:", {
// //                 status: response.status,
// //                 statusText: response.statusText,
// //                 body: json
// //             });
// //             throw json;
// //         }

// //         return json as PrintfulResponse;
// //     }

// //     get(endpoint: string, params: Record<string, string> = {}): Promise<PrintfulResponse> {
// //         return this.request({ endpoint, params });
// //     }

// //     post(endpoint: string, data: Record<string, unknown>): Promise<PrintfulResponse> {
// //         return this.request({ method: "POST", endpoint, data });
// //     }

// //     put(endpoint: string, data: Record<string, unknown>): Promise<PrintfulResponse> {
// //         return this.request({ method: "PUT", endpoint, data });
// //     }

// //     delete(endpoint: string): Promise<PrintfulResponse> {
// //         return this.request({ method: "DELETE", endpoint });
// //     }
// // }

// // src/lib/printful/printful-client.ts

// // import "cross-fetch/polyfill";

// // interface RequestParams {
// // 	method?: "GET" | "POST" | "PUT" | "DELETE";
// // 	endpoint: string;
// // 	data?: Record<string, unknown>;
// // 	params?: Record<string, string>;
// // }

// // interface ClientOptions {
// // 	baseUrl?: string;
// // 	headers?: Record<string, string>;
// // }

// // interface PrintfulFile {
// // 	id: number;
// // 	url: string;
// // 	hash: string | null;
// // 	filename: string;
// // 	mime_type: string | null;
// // 	size: number;
// // 	width: number | null;
// // 	height: number | null;
// // 	dpi: number | null;
// // 	status: "waiting" | "processing" | "accepted" | "rejected";
// // 	created: string;
// // 	thumbnail_url: string | null;
// // 	preview_url: string | null;
// // 	visible: boolean;
// // 	is_temporary: boolean;
// // 	_links: {
// // 		self: { href: string };
// // 	};
// // }

// // interface PrintfulResponse {
// // 	code?: number;
// // 	result?: any;
// // 	data?: PrintfulFile;
// // 	extra?: any[];
// // 	[key: string]: any;
// // }

// // export class PrintfulClient {
// // 	private apiKey: string;
// // 	private options: ClientOptions;
// // 	private headers: Record<string, string>;

// // 	constructor(apiKey: string, options: ClientOptions = {}) {
// // 		if (!apiKey) throw new Error("Printful API key not provided");

// // 		this.apiKey = apiKey;
// // 		this.options = {
// // 			baseUrl: "https://api.printful.com",
// // 			...options,
// // 		};

// // 		this.headers = {
// // 			"Content-Type": "application/json",
// // 			Authorization: `Bearer ${apiKey}`,
// // 			...options.headers,
// // 		};
// // 	}

// // 	async request({
// // 		method = "GET",
// // 		endpoint,
// // 		data,
// // 		params = {},
// // 	}: RequestParams): Promise<PrintfulResponse> {
// // 		const { baseUrl } = this.options;

// // 		const queryString = Object.keys(params).length
// // 			? `?${Object.keys(params)
// // 					.map(
// // 						(key) =>
// // 							`${encodeURIComponent(key)}=${encodeURIComponent(
// // 								params[key]
// // 							)}`
// // 					)
// // 					.join("&")}`
// // 			: "";

// // 		const url = `${baseUrl}/${endpoint}${queryString}`;

// // 		console.log(`Making Printful API request to: ${url}`, {
// // 			method,
// // 			headers: { ...this.headers, Authorization: "Bearer [REDACTED]" },
// // 			data: data || null,
// // 		});

// // 		try {
// // 			const response = await fetch(url, {
// // 				method,
// // 				headers: this.headers,
// // 				...(data && { body: JSON.stringify(data) }),
// // 			});

// // 			const json = await response.json();

// // 			if (!response.ok) {
// // 				console.error("Printful API error response:", {
// // 					status: response.status,
// // 					statusText: response.statusText,
// // 					body: json,
// // 				});
// // 				throw new Error(
// // 					`Printful API error: ${response.status} ${response.statusText}`
// // 				);
// // 			}

// // 			console.log(`Printful API response for ${endpoint}:`, {
// // 				status: response.status,
// // 				responseData: json,
// // 			});

// // 			return json;
// // 		} catch (error) {
// // 			console.error("Printful API request failed:", {
// // 				url,
// // 				method,
// // 				error: error instanceof Error ? error.message : "Unknown error",
// // 			});
// // 			throw error;
// // 		}
// // 	}

// // 	async get(
// // 		endpoint: string,
// // 		params: Record<string, string> = {}
// // 	): Promise<PrintfulResponse> {
// // 		return this.request({ endpoint, params });
// // 	}

// // 	async post(
// // 		endpoint: string,
// // 		data: Record<string, unknown>
// // 	): Promise<PrintfulResponse> {
// // 		return this.request({ method: "POST", endpoint, data });
// // 	}

// // 	async put(
// // 		endpoint: string,
// // 		data: Record<string, unknown>
// // 	): Promise<PrintfulResponse> {
// // 		return this.request({ method: "PUT", endpoint, data });
// // 	}

// // 	async delete(endpoint: string): Promise<PrintfulResponse> {
// // 		return this.request({ method: "DELETE", endpoint });
// // 	}

// // 	// Utility methods for common operations
// // 	async getFile(fileId: number): Promise<PrintfulFile> {
// // 		const response = await this.get(`v2/files/${fileId}`);
// // 		return response.data as PrintfulFile;
// // 	}

// // 	async uploadFile(url: string, filename: string): Promise<PrintfulFile> {
// // 		const response = await this.post("v2/files", {
// // 			role: "printfile",
// // 			url,
// // 			filename,
// // 			visible: true,
// // 		});
// // 		return response.data as PrintfulFile;
// // 	}

// // 	async checkFileStatus(fileId: number): Promise<string> {
// // 		const file = await this.getFile(fileId);
// // 		return file.status;
// // 	}
// // }

// // src/lib/printful/printful-client.ts

// import "cross-fetch/polyfill";

// interface RequestParams {
// 	method?: "GET" | "POST" | "PUT" | "DELETE";
// 	endpoint: string;
// 	data?: Record<string, unknown>;
// 	params?: Record<string, string>;
// }

// interface ClientOptions {
// 	baseUrl?: string;
// 	headers?: Record<string, string>;
// }

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected" | "failed";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	type?: string;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// interface PrintfulResponse {
// 	code?: number;
// 	result?: any;
// 	data?: PrintfulFile;
// 	extra?: any[];
// 	[key: string]: any;
// }

// interface PrintfulFileUploadResponse {
// 	code: number;
// 	result: {
// 		id: number;
// 		type: string;
// 		hash: string;
// 		url: string;
// 		filename: string;
// 		mime_type: string;
// 		size: number;
// 		width: number;
// 		height: number;
// 		dpi: number;
// 		status: string;
// 		preview_url: string;
// 		visible: boolean;
// 	};
// }

// export class PrintfulClient {
// 	private apiKey: string;
// 	private options: ClientOptions;
// 	private headers: Record<string, string>;

// 	constructor(apiKey: string, options: ClientOptions = {}) {
// 		if (!apiKey) throw new Error("Printful API key not provided");

// 		this.apiKey = apiKey;
// 		this.options = {
// 			baseUrl: "https://api.printful.com",
// 			...options,
// 		};

// 		this.headers = {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${apiKey}`,
// 			...options.headers,
// 		};
// 	}

// 	async request({
// 		method = "GET",
// 		endpoint,
// 		data,
// 		params = {},
// 	}: RequestParams): Promise<PrintfulResponse> {
// 		const { baseUrl } = this.options;

// 		const queryString = Object.keys(params).length
// 			? `?${Object.keys(params)
// 					.map(
// 						(key) =>
// 							`${encodeURIComponent(key)}=${encodeURIComponent(
// 								params[key]
// 							)}`
// 					)
// 					.join("&")}`
// 			: "";

// 		const url = `${baseUrl}/${endpoint}${queryString}`;

// 		console.log(`Making Printful API request to: ${url}`, {
// 			method,
// 			headers: { ...this.headers, Authorization: "Bearer [REDACTED]" },
// 			data: data || null,
// 		});

// 		try {
// 			const response = await fetch(url, {
// 				method,
// 				headers: this.headers,
// 				...(data && { body: JSON.stringify(data) }),
// 			});

// 			const json = await response.json();

// 			if (!response.ok) {
// 				console.error("Printful API error response:", {
// 					status: response.status,
// 					statusText: response.statusText,
// 					body: json,
// 				});
// 				throw new Error(
// 					`Printful API error: ${response.status} ${response.statusText}`
// 				);
// 			}

// 			console.log(`Printful API response for ${endpoint}:`, {
// 				status: response.status,
// 				responseData: json,
// 			});

// 			return json;
// 		} catch (error) {
// 			console.error("Printful API request failed:", {
// 				url,
// 				method,
// 				error: error instanceof Error ? error.message : "Unknown error",
// 			});
// 			throw error;
// 		}
// 	}

// 	async get(
// 		endpoint: string,
// 		params: Record<string, string> = {}
// 	): Promise<PrintfulResponse> {
// 		return this.request({ endpoint, params });
// 	}

// 	async post(
// 		endpoint: string,
// 		data: Record<string, unknown>
// 	): Promise<PrintfulResponse> {
// 		return this.request({ method: "POST", endpoint, data });
// 	}

// 	async put(
// 		endpoint: string,
// 		data: Record<string, unknown>
// 	): Promise<PrintfulResponse> {
// 		return this.request({ method: "PUT", endpoint, data });
// 	}

// 	async delete(endpoint: string): Promise<PrintfulResponse> {
// 		return this.request({ method: "DELETE", endpoint });
// 	}

// 	async uploadFile(formData: FormData): Promise<PrintfulFileUploadResponse> {
// 		const url = `${this.options.baseUrl}/files`;
// 		console.log("Uploading file to Printful", { url });

// 		const response = await fetch(url, {
// 			method: "POST",
// 			headers: {
// 				Authorization: this.headers.Authorization,
// 			},
// 			body: formData,
// 		});

// 		if (!response.ok) {
// 			const error = await response.json();
// 			console.error("File upload failed:", error);
// 			throw new Error(`Printful API error: ${JSON.stringify(error)}`);
// 		}

// 		const result = await response.json();
// 		console.log("File upload response:", result);
// 		return result;
// 	}

// 	async getFile(fileId: number): Promise<PrintfulFile> {
// 		const response = await this.get(`v2/files/${fileId}`);
// 		return response.data as PrintfulFile;
// 	}

// 	async checkFileStatus(fileId: number): Promise<string> {
// 		const file = await this.getFile(fileId);
// 		return file.status;
// 	}
// }


// src/lib/printful/printful-client.ts

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

interface PrintfulFile {
    id: number;
    url: string;
    hash: string | null;
    filename: string;
    mime_type: string | null;
    size: number;
    width: number | null;
    height: number | null;
    dpi: number | null;
    status: 'waiting' | 'processing' | 'accepted' | 'rejected' | 'failed';
    created: string;
    thumbnail_url: string | null;
    preview_url: string | null;
    visible: boolean;
    is_temporary: boolean;
    type?: string;
    _links: {
        self: { href: string };
    };
}

interface PrintfulResponse {
    code?: number;
    result?: any;
    data?: PrintfulFile;
    extra?: any[];
    [key: string]: any;
}

interface PrintfulFileUploadResponse {
    code: number;
    result: Array<{
        id: number;
        type: string;
        hash: string;
        url: string;
        filename: string;
        mime_type: string;
        size: number;
        width: number;
        height: number;
        dpi: number;
        status: string;
        preview_url: string;
        visible: boolean;
    }>;
}

export class PrintfulClient {
    private apiKey: string;
    private options: ClientOptions;
    private headers: Record<string, string>;

    constructor(apiKey: string, options: ClientOptions = {}) {
        if (!apiKey) throw new Error("Printful API key not provided");

        this.apiKey = apiKey;
        this.options = {
            baseUrl: "https://api.printful.com",
            ...options,
        };

        this.headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...options.headers,
        };
    }

    async request({
        method = "GET",
        endpoint,
        data,
        params = {},
    }: RequestParams): Promise<PrintfulResponse> {
        const { baseUrl } = this.options;

        const queryString = Object.keys(params).length
            ? `?${Object.keys(params)
                  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                  .join("&")}`
            : "";

        const url = `${baseUrl}/${endpoint}${queryString}`;

        console.log(`Making Printful API request to: ${url}`, {
            method,
            headers: { ...this.headers, Authorization: 'Bearer [REDACTED]' },
            data: data || null
        });

        try {
            const response = await fetch(url, {
                method,
                headers: this.headers,
                ...(data && { body: JSON.stringify(data) }),
            });

            const responseText = await response.text();
            let json: any;
            
            try {
                json = JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse response:", responseText);
                throw new Error("Invalid JSON response from API");
            }

            if (!response.ok) {
                console.error("Printful API error response:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: json
                });
                throw new Error(`Printful API error: ${response.status} ${response.statusText}`);
            }

            console.log(`Printful API response for ${endpoint}:`, {
                status: response.status,
                responseData: json
            });

            return json;
        } catch (error) {
            console.error("Printful API request failed:", {
                url,
                method,
                error: error instanceof Error ? error.message : "Unknown error"
            });
            throw error;
        }
    }

    async get(endpoint: string, params: Record<string, string> = {}): Promise<PrintfulResponse> {
        return this.request({ endpoint, params });
    }

    async post(endpoint: string, data: Record<string, unknown>): Promise<PrintfulResponse> {
        return this.request({ method: "POST", endpoint, data });
    }

    async put(endpoint: string, data: Record<string, unknown>): Promise<PrintfulResponse> {
        return this.request({ method: "PUT", endpoint, data });
    }

    async delete(endpoint: string): Promise<PrintfulResponse> {
        return this.request({ method: "DELETE", endpoint });
    }

    async uploadFile(formData: FormData): Promise<PrintfulFileUploadResponse> {
        const url = `${this.options.baseUrl}/files`;
        console.log("Uploading file to Printful", { url });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': this.headers.Authorization,
            },
            body: formData
        });

        const responseText = await response.text();
        let result: PrintfulFileUploadResponse;

        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse upload response:", responseText);
            throw new Error("Invalid JSON response from file upload");
        }

        if (!response.ok) {
            console.error("File upload failed:", result);
            throw new Error(`Printful API error: ${JSON.stringify(result)}`);
        }

        console.log("File upload response:", result);

        if (!result.result || !Array.isArray(result.result) || result.result.length === 0) {
            throw new Error("Invalid response from Printful file upload");
        }

        return result;
    }

    async getFile(fileId: number): Promise<PrintfulFile> {
        const response = await this.get(`v2/files/${fileId}`);
        return response.data as PrintfulFile;
    }

    async checkFileStatus(fileId: number): Promise<string> {
        const file = await this.getFile(fileId);
        return file.status;
    }
}
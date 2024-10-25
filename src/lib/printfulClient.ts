// src/lib/printfulClient.ts

import axios from "axios";

if (!process.env.PRINTFUL_API_KEY) {
	throw new Error("PRINTFUL_API_KEY environment variable is not set");
}

export const printfulClient = axios.create({
	baseURL: "https://api.printful.com/",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
	},
});

// Add response interceptor for error handling
printfulClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			// Log API-specific error details
			console.error("Printful API Error:", {
				status: error.response.status,
				data: error.response.data,
				endpoint: error.config?.url,
			});
		}
		return Promise.reject(error);
	}
);

// Helper methods for common Printful API operations
// export const PrintfulAPI = {
//   async getProducts() {
//     const { data } = await printfulClient.get('store/products');
//     return data.result;
//   },

//   async getProductDetails(productId: number) {
//     const { data } = await printfulClient.get(`store/products/${productId}`);
//     return data.result;
//   },

//   async getVariants(productId: number) {
//     const { data } = await printfulClient.get(`store/products/${productId}/variants`);
//     return data.result;
//   },

//   async createSyncProduct(productData: any) {
//     const { data } = await printfulClient.post('store/products', productData);
//     return data.result;
//   }
// };

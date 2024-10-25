// // src/graphql/schema.ts

// import { gql } from "graphql-tag";

// export const typeDefs = gql`
// 	type ProductVariant {
// 		id: ID!
// 		name: String!
// 		size: String
// 		color: String
// 		price: Float!
// 		printfulId: Int!
// 		retailPrice: Float!
// 	}

// 	type Product {
// 		id: ID!
// 		name: String!
// 		type: String!
// 		description: String!
// 		printfulId: Int!
// 		variants: [ProductVariant!]!
// 	}

// 	type Query {
// 		products(query: String, limit: Int): [Product!]!
// 		product(id: ID!): Product
// 		searchProducts(query: String!): [Product!]!
// 	}

// 	type Mutation {
// 		syncProducts: [Product!]!
// 	}
// `;

// src/graphql/schema.ts

import { gql } from "graphql-tag";

export const typeDefs = gql`
	type Variant {
		id: ID!
		name: String!
		size: String
		color: String
		price: Float!
		retailPrice: Float!
		printfulId: Int!
	}

	type Product {
		id: ID!
		name: String!
		type: String!
		description: String!
		printfulId: Int!
		variants: [Variant!]!
	}

	type Query {
		products(query: String, limit: Int): [Product!]!
		product(id: ID!): Product
		searchProducts(query: String!): [Product!]!
	}

	type Mutation {
		syncProducts: [Product!]!
	}
`;

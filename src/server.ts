// // src/server.ts

// import { ApolloServer } from '@apollo/server';
// import { typeDefs } from './graphql/schema';
// import { resolvers } from './graphql/resolvers';
// import { ProductCatalogProcessor } from '@/lib/productProcessor';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const processor = new ProductCatalogProcessor();

// const startServer = async () => {
//   try {
//     await processor.initialize();

//     const server = new ApolloServer({
//       typeDefs,
//       resolvers: resolvers(processor),
//       context: () => ({ prisma, processor }),
//     });

//     const { url } = await server.listen({ port: 4000 });
//     console.log(`🚀 Server ready at ${url}`);
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();

export {};

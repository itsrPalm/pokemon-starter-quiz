// // prisma/seed.ts

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const hatProduct = await prisma.hatProduct.upsert({
//     where: { id: 'default-hat-product-id' },
//     update: {},
//     create: {
//       id: 'default-hat-product-id',
//       printfulId: 123456, // Replace with actual Printful ID if available
//       mainCategoryId: 1,   // Replace with actual Category ID if available
//       type: 'Custom Hat',
//       description: 'A customizable hat with various embroidery options.',
//       title: 'Customizable Hat',
//       brand: 'YourBrand',
//       model: 'ModelX',
//       image: 'https://yourdomain.com/path-to-hat-image.png',
//       variantCount: 0,
//       currency: 'USD',
//       origin_country: 'USA',
//       options: [],
//       techniques: [],
//       files: [],
//       hatVariants: [],
//     },
//   });

//   console.log(`Seeded HatProduct with id: ${hatProduct.id}`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

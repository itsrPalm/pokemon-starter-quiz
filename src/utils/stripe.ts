// utils/stripe.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2024-09-30.acacia",
});

export const createStripeProductAndPrice = async (
	name: string,
	description: string,
	images: string[],
	amount: number,
	currency: string
) => {
	const product = await stripe.products.create({
		name,
		description,
		images,
	});

	const price = await stripe.prices.create({
		product: product.id,
		unit_amount: Math.round(amount * 100), // Convert to cents
		currency: currency.toLowerCase(),
	});

	return { product, price };
};

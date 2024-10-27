import type { Stripe } from "stripe";

export type StripeAddress = Stripe.Address;
export type StripeShippingDetails = Stripe.Checkout.Session.ShippingDetails;

// Make sure it's compatible with Prisma's JSON type
export type PrismaJsonValue =
	| string
	| number
	| boolean
	| null
	| { [key: string]: PrismaJsonValue }
	| PrismaJsonValue[];

export interface PrismaShippingDetailsAddress {
	[key: string]: PrismaJsonValue;
	line1: string | null;
	line2: string | null;
	city: string | null;
	state: string | null;
	country: string | null;
	postal_code: string | null;
}

export interface PrismaShippingDetails {
	[key: string]: PrismaJsonValue;
	name: string | null;
	address: PrismaShippingDetailsAddress | null;
	phone: string | null;
}

export interface ShippingAddress {
	line1?: string;
	line2?: string;
	city?: string;
	state?: string;
	country?: string;
	postal_code?: string;
}

export interface ShippingDetails {
	name?: string;
	address?: ShippingAddress;
	phone?: string;
}

// src/types/order.ts
export type OrderStatus = "pending" | "paid" | "processing" | "fulfilled";

export interface OrderShippingDetails {
	name: string;
	address: {
		line1: string;
		line2?: string;
		city: string;
		state: string;
		country: string;
		postalCode: string;
	};
	phone?: string;
}

export interface PrintfulProduct {
	id: number;
	name: string;
	description: string;
	variants: PrintfulVariant[];
}

export interface PrintfulVariant {
	id: number;
	name: string;
	size: string;
	color: string;
	price: string;
}

// src/lib/constants.ts

// src/types/printful.ts

export interface PrintfulFileResponse {
	result: {
		id: string;
		url: string;
		// Add other relevant fields as needed
	};
	code: number;
}

export interface PrintfulErrorResponse {
	code: number;
	result: string;
	error: {
		reason: string;
		message: string;
		api_error_code: string;
		error_url: string;
	};
}

export interface GetHatVariantsResponse {
	variant: HatVariant;
}

export interface UploadPokemonPngResponse {
	success: boolean;
	updatedResult?: string; // Define a specific type if possible
	error?: string;
}

export interface CreateCheckoutSessionResponse {
	url?: string;
	error?: string;
}

export interface Variant {
	id: string;
	printfulId: number;
	name: string;
	size: string | null;
	color: string | null;
	printfulPrice: number;
	retailPrice: number;
	stripePriceId: string | null;
	mockupUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface HatVariant {
	id: string;
	name: string;
	color: string;
	size: string;
	image: string;
	retailPrice: number;
	currency: string;
	stripePriceId: string;
	pngImages?: Record<string, string>;
	hatProductId: string;
	createdAt: Date;
	updatedAt: Date;
}

// export interface HatProduct {
// 	id: string;
// 	printfulId: number;
// 	mainCategoryId: number;
// 	type: string;
// 	description: string;
// 	title: string;
// 	brand: string;
// 	model: string;
// 	image: string;
// 	variantCount: number;
// 	currency: string;
// 	options: PrismaJsonValue;
// 	techniques: PrismaJsonValue;
// 	files: PrismaJsonValue;
// 	hatVariants: HatVariant[];
// }

// src/types/printful.ts

// export interface Dimensions {
// 	// Define properties if available. Currently, it's null.
// 	width: number;
// 	height: number;
// 	depth: number;
// }

// export type OptionType = "radio" | "multi_select" | "text"

// export enum ProductType {
//     Embroidery = 'EMBROIDERY',
//     // Add other types as needed
//   }

//   export enum OptionTypeEnum {
//     Radio = 'radio',
//     MultiSelect = 'multi_select',
//     Text = 'text',
//   }

//   export enum FileTypeEnum {
//     EmbroideryFrontLarge = 'embroidery_front_large',
//     EmbroideryFront = 'embroidery_front',
//     EmbroideryBack = 'embroidery_back',
//     EmbroideryRight = 'embroidery_right',
//     EmbroideryLeft = 'embroidery_left',
//     Mockup = 'mockup',
//   }

//   export enum FileOptionTypeEnum {
//     Bool = 'bool',
//   }
//   ;

// export interface PriceBreakdown {
// 	flat: string;
// 	"3d": string;
// 	both: string;
// }

// export interface Technique {
// 	key: string;
// 	display_name: string;
// 	is_default: boolean;
// }

// export type FileType =
// 	| "embroidery_front_large"
// 	| "embroidery_front"
// 	| "embroidery_back"
// 	| "embroidery_right"
// 	| "embroidery_left"
// 	| "mockup";

//     export interface Option {
//         id: string;
//         title: string;
//         type: OptionTypeEnum;
//         values: Record<string, string> | null;
//         additional_price: string | null;
//         additional_price_breakdown: PriceBreakdown;
//       }

//       export interface File {
//         id: string;
//         type: FileTypeEnum;
//         title: string;
//         additional_price: string | null;
//         options: FileOption[];
//       }

//       export interface FileOption {
//         id: string;
//         type: FileOptionTypeEnum;
//         title: string;
//         additional_price: number;
//       }

// export type FileOptionType = "bool";

// export interface CustomHatProduct extends HatProduct {
// 	// Add or override properties specific to custom hats
// 	customProperty?: string;
// }

// export interface HatProduct {
// 	id: number;
// 	main_category_id: number;
// 	type: string; // Consider using enums for fixed types
// 	description: string;
// 	type_name: string;
// 	title: string;
// 	brand: string;
// 	model: string;
// 	image: string;
// 	variant_count: number;
// 	currency: string;
// 	options: Option[];
// 	dimensions: Dimensions | null;
// 	is_discontinued: boolean;
// 	avg_fulfillment_time: string | null; // Adjust type based on actual data
// 	techniques: Technique[];
// 	files: File[];
// 	origin_country: string | null;
// }

// Other interfaces remain unchanged

// export interface HatVariant {
// 	id: string;
// 	name: string;
// 	color: string;
// 	size: string;
// 	image: string;
// 	retailPrice: number;
// 	currency: string;
// 	stripePriceId: string;
// 	pngImages?: Record<string, string>;
// 	hatProductId: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// export interface HatProduct {
// 	id: string;
// 	printfulId: number;
// 	mainCategoryId: number;
// 	type: string;
// 	description: string;
// 	title: string;
// 	brand: string;
// 	model: string;
// 	image: string;
// 	variantCount: number;
// 	currency: string;
// 	options: PrismaJsonValue;
// 	techniques: PrismaJsonValue;
// 	files: PrismaJsonValue;
// 	hatVariants: HatVariant[];
// }

// export interface Variant {
// 	id: string;
// 	printfulId: number;
// 	name: string;
// 	size: string | null;
// 	color: string | null;
// 	printfulPrice: number;
// 	retailPrice: number;
// 	stripePriceId: string | null;
// 	mockupUrl: string | null;
// 	// productId: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export interface Pokemon {
	name: string;
	description: string;
	traits: string[];
	image: string | null;
	type: "grass" | "fire" | "water"; // Ensure this is included
}

export interface Question {
	text: string;
	options: [string, string, string];
}

export interface PokemonGroup {
	pokemons: [Pokemon, Pokemon, Pokemon];
	questions: Question[];
}

export type Stage = "start" | "grass" | "fire" | "water" | "result";
export type SubStage = 1 | 2 | 3 | 4;

export interface ModalProps {
	isVisible: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export interface PokeballProps {
	isOpen: boolean;
	children: React.ReactNode;
	imageSize: number;
}

// SharedResults state interfaces
export interface SharedResultsState {
	isPlaying: boolean;
	audio: HTMLAudioElement | null;
	audioStatus: string;
	loadingAudio: boolean;
	errorMessage: string | null;
	unlockedPokemon: Record<string, boolean>;
	hoveredPokemon: string | null;
	clickedPokemon: string | null;
	pngImages: Record<string, string>;
	isLoadingPng: Record<string, boolean>;
	currentPngViewing: string | null;
}

export const firePokemonGroups: PokemonGroup[] = [
	{
		pokemons: [
			{
				name: "Charmander",
				description:
					"🔥 Competitive and determined. You love proving yourself, thrive on challenges, and never give up, even when things get tough.",
				traits: ["Brave and Reliable", "Can be stubborn or tempered"],
				image: null,
				type: "fire",
			},
			{
				name: "Tepig",
				description:
					"🎉 Playful and lighthearted. You enjoy being with friends and making them laugh, but know when to be serious.",
				traits: [
					"Nurturing and Cheerful",
					"Can be stubborn or sensitive",
				],
				image: null,
				type: "fire",
			},
			{
				name: "Fennekin",
				description:
					"❔ Imaginative and curious. You have a creative streak and may seem delicate, but your determination surprises everyone.",
				traits: [
					"Curious and Intelligent",
					"Can seem distant or easily frustrated",
				],
				image: null,
				type: "fire",
			},
		],
		questions: [
			{
				text: "How do you approach a new challenge?",
				options: [
					"With seriousness and passion",
					"With a positive can-do attitude",
					"With calm and thoughtfulness, sometimes thinking outside the box",
				],
			},
			{
				text: "What is your ideal way to spend a weekend?",
				options: [
					"Adventuring or working on a project",
					"Going out and eating good food with friends",
					"Curling up with a good book and learning",
				],
			},
			{
				text: "What role do you usually take in a group project?",
				options: [
					"The leader, ready to take charge and guide the group",
					"The follower, will do what needs to be done to complete tasks",
					"The creative thinker, bringing unique ideas and perspectives",
				],
			},
			{
				text: "What inspires you the most?",
				options: [
					"Opportunities to prove my capabilities",
					"Anything fun and exciting",
					"Learning new things",
				],
			},
			{
				text: "What do your friends value in you?",
				options: [
					"My brave and ambitious nature",
					"My friendly and cheerful nature",
					"My curiosity and intelligence",
				],
			},
		],
	},
	{
		pokemons: [
			{
				name: "Scorbunny",
				description:
					"🏃 Competitive and full of excitement. Always on the move, you inspire others with your energy and can-do spirit.",
				traits: [
					"Energetic and Competitive",
					"Can be impatient or over competitive",
				],
				image: null,
				type: "fire",
			},
			{
				name: "Torchic",
				description:
					"💥 Optimistic and energetic. Your enthusiasm and positivity attract others and brighten up any room you're in.",
				traits: [
					"Friendly and Courageous",
					"Can be impatient and overeager",
				],
				image: null,
				type: "fire",
			},
			{
				name: "Litten",
				description:
					"🎭 Independent and cool-headed. You prefer doing things your way and may seem distant, but close friends know your true abilities.",
				traits: [
					"Independent and Loyal",
					"Can seem distant or bottle up emotions",
				],
				image: null,
				type: "fire",
			},
		],
		questions: [
			{
				text: "What motivates you to achieve your goals?",
				options: [
					"The thrill of competition and winning",
					"The desire of growing, improving, and doing my best",
					"Personal ambition, I enjoy proving myself",
				],
			},
			{
				text: "What's your favorite way to relax?",
				options: [
					"Staying active or doing something competitive",
					"Spending time with loved ones in a comfortable environment",
					"Enjoying some alone time",
				],
			},
			{
				text: "How do you prefer to learn new things?",
				options: [
					"I prefer to get right into it, hands-on, trial and error",
					"I prefer to learn with others collaboratively",
					"I prefer to take action by self-teaching myself",
				],
			},
			{
				text: "How do you respond to pressure?",
				options: [
					"I thrive under it",
					"I push through it as best as I can",
					"I quietly focus until the job is done",
				],
			},
			{
				text: "What's your greatest strength?",
				options: [
					"My confidence and energy",
					"My friendliness and can-do attitude",
					"My independent spirit",
				],
			},
		],
	},
	{
		pokemons: [
			{
				name: "Chimchar",
				description:
					"🎩 Mischievous and ambitious. You love trying new things and can bounce back from setbacks with a smile.",
				traits: ["Playful and Clever", "Can be reckless or distracted"],
				image: null,
				type: "fire",
			},
			{
				name: "Fuecoco",
				description:
					"🎈 Laid-back and carefree. You enjoy life at your own pace, but when something excites you, you dive in with all your heart.",
				traits: [
					"Easygoing and Curious",
					"Can be distracted or unmotivated",
				],
				image: null,
				type: "fire",
			},
			{
				name: "Cyndaquil",
				description:
					"🧘‍♂️ Quiet and reserved. You prefer your own company but prove reliable in critical moments, especially during crises.",
				traits: [
					"Gentle and Trustworthy",
					"Can be too shy or overwhelmed",
				],
				image: null,
				type: "fire",
			},
		],
		questions: [
			{
				text: "What's your favorite way to stay active?",
				options: [
					"Something really active or fast-paced, especially if it's team sports",
					"Not much, something fun or laid-back, like a casual walk",
					"Something I can do by myself like a workout or sprints",
				],
			},
			{
				text: "How do you stay focused on long-term projects?",
				options: [
					"Keeping the momentum going by staying busy and having fun along the way",
					"Taking it easy and going with the flow",
					"Through quiet dedication and working in short bursts with breaks in between",
				],
			},
			{
				text: "What's your favorite way to celebrate success?",
				options: [
					"With a big party!!!",
					"Vacation somewhere new and relaxing!!",
					"Eat out with close friends or family, then have some alone time to recharge",
				],
			},
			{
				text: "Which of these sounds like a perfect vacation?",
				options: [
					"An action-packed adventure trip like mountains or jungles",
					"A carefree vacation somewhere sunny and enjoying good food",
					"A cozy cabin retreat somewhere unique in nature and stargazing",
				],
			},
			{
				text: "How do you handle setbacks?",
				options: [
					"Quickly get back in there and try again with more energy",
					"By staying calm and not stressing about it",
					"Take a break, reflect, and work harder next time",
				],
			},
		],
	},
];

export const waterPokemonGroups: PokemonGroup[] = [
	{
		pokemons: [
			{
				name: "Oshawott",
				description:
					"📈 Determined and cheerful. You bounce back quickly from setbacks and enjoy achieving goals one small step at a time.",
				traits: [
					"Playful and Resourceful",
					"Can be overconfident or sensitive to criticism",
				],
				image: null,
				type: "water",
			},
			{
				name: "Froakie",
				description:
					"🔍 Calm and observant. You keep your cool under pressure and notice details others miss, making you a great problem-solver.",
				traits: [
					"Composed and Adaptable",
					"Can seem distant or overly self-reliant",
				],
				image: null,
				type: "water",
			},
			{
				name: "Squirtle",
				description:
					"🏄‍♂️ Laid-back and easygoing. You enjoy hanging out with friends and are always there to support them when they need you.",
				traits: [
					"Easygoing and Courageous",
					"Can be reckless or over confident",
				],
				image: null,
				type: "water",
			},
		],
		questions: [
			{
				text: "How do you react to new experiences?",
				options: [
					"I dive in enthusiastically, ready for anything",
					"I observe first before I adapt to the situation",
					"I stay calm and let things happen naturally",
				],
			},
			{
				text: "What's your preferred way to spend a day off?",
				options: [
					"Going somewhere new or practicing a new skill or hobby",
					"By myself relaxing at home or somewhere peaceful",
					"Hanging out with friends or lounging about",
				],
			},
			{
				text: "How do you help your friends in need?",
				options: [
					"I actively offer hands-on help",
					"I offer thoughtful advice and help them plan a solution",
					"I'm a calm presence and stay by their side, helping however way I can",
				],
			},
			{
				text: "What is your favorite way to express yourself?",
				options: [
					"By sharing adventures and storytelling",
					"By sharing ideas, creativity, and art",
					"By sharing jokes and humor",
				],
			},
			{
				text: "What keeps you motivated during hard times?",
				options: [
					"My optimism and determination to overcome any challenges",
					"My ability to stay calm under pressure and find smart solutions",
					"My relaxed approach to life",
				],
			},
		],
	},
	{
		pokemons: [
			{
				name: "Totodile",
				description:
					"💦 Energetic and enthusiastic. You love having fun, making others smile, and eagerly jump into new challenges.",
				traits: [
					"Energetic and Bold",
					"Can be impulsive or overly playful",
				],
				image: null,
				type: "water",
			},
			{
				name: "Quaxly",
				description:
					"📏 Stylish and disciplined. You take pride in doing things properly, value self-improvement, and strive to be better every day.",
				traits: [
					"Confident and Disciplined",
					"Can be stubborn or self-absorbed",
				],
				image: null,
				type: "water",
			},
			{
				name: "Sobble",
				description:
					"🎨 Sensitive and introspective. You feel things deeply and may seem shy, but you possess surprising emotional strength.",
				traits: [
					"Caring and Observant",
					"Can be too shy or overwhelmed",
				],
				image: null,
				type: "water",
			},
		],
		questions: [
			{
				text: "How do you approach challenges?",
				options: [
					"With lots of excitement and playful energy",
					"With careful planning, discipline, and precision",
					"A bit nervous at first but still determined",
				],
			},
			{
				text: "What's your favorite social activity?",
				options: [
					"Something active and fun to play around with friends",
					"Attending organized events or parties",
					"Spending some time with a few close friends",
				],
			},
			{
				text: "How do you handle attention from others?",
				options: [
					"I love it and soak it all in with excitement",
					"I lean into it and embrace the spotlight with confidence and charm",
					"I shy away but appreciate the support",
				],
			},
			{
				text: "What's your ideal weekend getaway?",
				options: [
					"A beach party full of fun energy or a theme park",
					"A stylish trip to a city, cultural hotspot or a luxury resort",
					"A peaceful nature retreat",
				],
			},
			{
				text: "How do you prefer to communicate with others?",
				options: [
					"Lively conversations and banter, keeping things fun and engaging",
					"Using clear and direct communication ensuring understanding",
					"Calm and heartfelt messages making sure not to pressure anyone",
				],
			},
		],
	},
	{
		pokemons: [
			{
				name: "Popplio",
				description:
					"🎤 Playful and expressive. You love performing and bringing joy to others, even when situations get difficult.",
				traits: [
					"Charming and Caring",
					"Can be self critical or attention-seeking",
				],
				image: null,
				type: "water",
			},
			{
				name: "Piplup",
				description:
					"🎯 Proud and independent. You like doing things your way, enjoy your own company, but are deeply loyal to close friends.",
				traits: [
					"Determined and Loyal",
					"Can seem distant or sensitive to criticism",
				],
				image: null,
				type: "water",
			},
			{
				name: "Mudkip",
				description:
					"☺︎ Gentle and supportive. You're great at helping others through tough times and always know when to lend a hand.",
				traits: [
					"Friendly and Resilient",
					"Can be distracted or naive",
				],
				image: null,
				type: "water",
			},
		],
		questions: [
			{
				text: "What's your favorite type of entertainment?",
				options: [
					"Expressive performances like drama, musical, or theater",
					"Watching competitive sports or action-packed movies",
					"Something calming like nature or geographic shows",
				],
			},
			{
				text: "What do you value most in life?",
				options: [
					"Creativity and entertainment",
					"Hard work and loyalty",
					"Peace and helping others",
				],
			},
			{
				text: "How do you deal with stress?",
				options: [
					"I focus on doing something else fun to lift my mood",
					"I push through with determination",
					"I take a break and relax when needed",
				],
			},
			{
				text: "Which of these sounds like the best vacation?",
				options: [
					"A beach getaway filled with fun water activities",
					"An adventure to a cool or snowy destination where I can enjoy warm drinks",
					"A trip to a peaceful lake or river, enjoying fishing or swimming",
				],
			},
			{
				text: "What drives you to succeed?",
				options: [
					"The joy of making others happy",
					"The desire to prove my own abilities",
					"For stability, peace, and contentment",
				],
			},
		],
	},
];

export const grassPokemonGroups: PokemonGroup[] = [
	{
		pokemons: [
			{
				name: "Grookey",
				description:
					"🎶 Energetic and playful. You bring life to every moment, love having fun, and inspire others to join in.",
				traits: [
					"Energetic and Playful",
					"Can be Impulsive or distracted",
				],
				image: null,
				type: "grass",
			},
			{
				name: "Chikorita",
				description:
					"❤️ Kind and gentle. You create peace around you, love helping others, and feel happiest when everyone feels cared for.",
				traits: ["Gentle and Caring", "Can be too shy or sensitive"],
				image: null,
				type: "grass",
			},
			{
				name: "Snivy",
				description:
					"👑 Elegant and composed. You carry yourself proudly, value quality over quantity, and cherish meaningful friendships.",
				traits: [
					"Confident and Clever",
					"Can seem distant or self-absorbed",
				],
				image: null,
				type: "grass",
			},
		],
		questions: [
			{
				text: "What kind of atmosphere do you thrive in?",
				options: [
					"A fun, lively, and energetic environment",
					"A calm and peaceful space where people are comfortable",
					"Elegant and classy, where everything is organized",
				],
			},
			{
				text: "How do you approach new challenges?",
				options: [
					"I jump in headfirst with enthusiasm",
					"I take a gentle and positive approach to work collaboratively with others",
					"I analyze the situation carefully before devising a clever plan",
				],
			},
			{
				text: "How do you prefer to spend time with friends?",
				options: [
					"Playing music or games, any activity that's fun",
					"Enjoying a peaceful picnic or relaxing in nature",
					"Attend organized events or something competitive",
				],
			},
			{
				text: "What do you believe is the key to happiness?",
				options: [
					"Enjoying life with friends",
					"Nurturing and helping those in need",
					"Reaching goals and achieving personal growth",
				],
			},
			{
				text: "How do you handle conflict?",
				options: [
					"I try to lighten the mood and keep things fun with humor",
					"I calmly seek a peaceful resolution and try to ease tensions",
					"I find a smart solution and assert my point of view",
				],
			},
		],
	},
	{
		pokemons: [
			{
				name: "Chespin",
				description:
					"🌟 Playful and optimistic. You spread joy easily and have a talent for turning tough situations into positive ones.",
				traits: [
					"Friendly and Brave",
					"Can be stubborn or easily frustrated",
				],
				image: null,
				type: "grass",
			},
			{
				name: "Turtwig",
				description:
					"🌱 Hardworking and dependable. You prefer steady progress and stay grounded as you work towards your goals.",
				traits: [
					"Resilient and Level-headed",
					"Can be stubborn or overly cautious",
				],
				image: null,
				type: "grass",
			},
			{
				name: "Rowlet",
				description:
					"🎯 Calm and thoughtful. You stay focused on your goals and aim to bring balance to every situation.",
				traits: [
					"Observant and Friendly",
					"Can be distracted or overly cautious",
				],
				image: null,
				type: "grass",
			},
		],
		questions: [
			{
				text: "What do you value most in a friend?",
				options: [
					"Their adventurous and cheerful energy",
					"Their dependability and nurturing spirit",
					"Their calm and thoughtfulness",
				],
			},
			{
				text: "What's your approach to solving problems?",
				options: [
					"Tackle it with enthusiasm and practicality",
					"Take a slow and steady approach, work hard patiently",
					"Observe the situation from different angles and consider creative solutions",
				],
			},
			{
				text: "What's your favorite way to start your day?",
				options: [
					"Wake up early, jump out of bed and get my day started as soon as I can",
					"Take my time enjoying a peaceful morning soaking in the fresh air and sunlight",
					"Woke up too late since I am always up too late",
				],
			},
			{
				text: "When it comes to activities and events, who are you most likely to be?",
				options: [
					"The participant involved in the activity",
					"The planner and organizer of the activity",
					"An audience member watching the activity",
				],
			},
			{
				text: "What motivates you most?",
				options: [
					"The excitement of new adventure and experiences",
					"Stability and the desire to grow while helping others around me",
					"My curiosity to pursue knowledge or explore new ideas",
				],
			},
		],
	},
	{
		pokemons: [
			{
				name: "Sprigatito",
				description:
					"🎀 Playful and independent. You value your freedom, do things at your own pace, but enjoy connecting with others when it feels right.",
				traits: [
					"Independent and Affectionate",
					"Can be distracted or stubborn",
				],
				image: null,
				type: "grass",
			},
			{
				name: "Bulbasaur",
				description:
					"🛡️ Loyal and reliable. You're the backbone of any group, not always in the spotlight, but always there when needed.",
				traits: [
					"Supportive and Determined",
					"Can be indecisive or overwhelmed",
				],
				image: null,
				type: "grass",
			},
			{
				name: "Treecko",
				description:
					"⚔️ Confident and self-assured. You trust your gut, like handling things solo, and aren't afraid of challenges.",
				traits: [
					"Independent and Determined",
					"Can seem distant or impatient",
				],
				image: null,
				type: "grass",
			},
		],
		questions: [
			{
				text: "What role do you usually take in a group project?",
				options: [
					"The creative thinker who brings fresh ideas",
					"The reliable supporter who ensures everyone has a part",
					"The leader who takes charge and keeps everyone on track",
				],
			},
			{
				text: "What's your go-to stress reliever?",
				options: [
					"Napping or lounging about",
					"Being around friends or going for a nice walk",
					"Focusing on a specific task or activity by myself to clear my mind",
				],
			},
			{
				text: "How do you approach competition?",
				options: [
					"I enjoy the challenge while having fun",
					"I am being a good sport and that others feel good",
					"I'm focused and determined to be the best",
				],
			},
			{
				text: "What sounds like the best vacation out of these?",
				options: [
					"A fun trip somewhere vibrant like beach towns or big cities",
					"Somewhere in nature where it's sunny and I am relaxing",
					"An adventurous trip exploring new places and discovering hidden spots",
				],
			},
			{
				text: "How do you deal with setbacks?",
				options: [
					"Not too serious, I will try again when I feel the time is right",
					"I stay calm and consistently work hard",
					"A bit serious, but I trust my instincts to overcome it",
				],
			},
		],
	},
];

/** Default Palettes for Pixelation */
export const DEFAULT_PALETTES = [
	{
		name: "Pokemon Types",
		colors: [
			"#78C850", // Grass
			"#F08030", // Fire
			"#6890F0", // Water
			"#F85888", // Psychic
			"#A8B820", // Bug
			"#A040A0", // Poison
			"#F8D030", // Electric
			"#E0C068", // Ground
			"#C03028", // Fighting
			"#F0C030", // Rock
			"#98D8D8", // Ice
			"#A890F0", // Dragon
			"#705898", // Ghost
			"#705848", // Rock
			"#B8A038", // Normal
		],
	},
];

/** Constants */
export const hexColors: Record<string, string> = {
	grass: "#78C850",
	fire: "#F08030",
	water: "#6890F0",
};

export const typeEmojis: Record<string, string> = {
	grass: "🌿",
	fire: "🔥",
	water: "💧",
};

/** Types */
export type SourceOptions = {
	type?: DOMParserSupportedType;
	trim?: boolean;
	color?: string;
};

export interface SharedResultsProps {
	resultId: string;
	trainerName: string;
	teamSummary: string;
	allPokemon: Pokemon[];
	rankings?: {
		grass?: { top: string; runnerUp: string; canRelate: string };
		fire?: { top: string; runnerUp: string; canRelate: string };
		water?: { top: string; runnerUp: string; canRelate: string };
	};
}

export interface ProductSelectorProps {
	variants: HatVariant[];
	selectedVariant: HatVariant | null;
	onVariantChange: (variant: HatVariant) => void;
	onRandomize: () => void;
	isLoading: boolean;
}

export interface ProductViewerProps {
	variant: HatVariant | null;
	pngImage: string;
	isGeneratingMockup: boolean;
	mockupUrl: string | null;
	onCheckout: () => void;
}

export interface PokeballProps {
	isOpen: boolean;
	children: React.ReactNode;
	imageSize: number;
}

export interface ProductModalProps {
	isVisible: boolean;
	onClose: () => void;
	pokemon: Pokemon | undefined;
	pngImage: string | null;
	resultId: string;
}

// Random pixelation settings
export const pixelSizes = [32, 48, 64, 96, 128];
export const ditherTypes = [
	"Floyd-Steinberg",
	"4x4 Bayer",
	"Atkinson",
	"2x2 Bayer",
	"ordered",
];

export const strengthRange = { min: 20, max: 80 };

export interface PixelateOptions {
	image: HTMLImageElement;
	width: number;
	dither: string;
	strength: number;
	palette: string[];
	resolution: "original";
}

export interface Rankings {
	grass?: {
		top: string;
		runnerUp: string;
		canRelate: string;
	};
	fire?: {
		top: string;
		runnerUp: string;
		canRelate: string;
	};
	water?: {
		top: string;
		runnerUp: string;
		canRelate: string;
	};
}

export interface PokemonData {
	name: string;
	image: string | null;
	description: string;
	type: "grass" | "fire" | "water";
	traits: string[];
}

export interface PrintfulFile {
	id: number;
	url: string;
	hash: string | null;
	filename: string;
	mime_type: string | null;
	size: number;
	width: number | null;
	height: number | null;
	dpi: number | null;
	status: "waiting" | "processing" | "accepted" | "rejected";
	created: string;
	thumbnail_url: string | null;
	preview_url: string | null;
	visible: boolean;
	is_temporary: boolean;
	_links: {
		self: { href: string };
	};
}

export const THREAD_COLORS = {
	"#FFFFFF": "1801 White",
	"#000000": "1800 Black",
	"#96A1A8": "1718 Grey",
	"#A67843": "1672 Old Gold",
	"#FFCC00": "1951 Gold",
	"#E25C27": "1987 Orange",
	"#CC3366": "1910 Flamingo",
	"#CC3333": "1839 Red",
	"#660000": "1784 Maroon",
	"#333366": "1966 Navy",
	"#005397": "1842 Royal",
	"#3399FF": "1695 Aqua/Teal",
	"#6B5294": "1832 Purple",
	"#01784E": "1751 Kelly Green",
	"#7BA35A": "1848 Kiwi Green",
};

export const EMBROIDERY_POSITIONS = {
	front: { id: "embroidery_front", price: 2.95 },
	front_large: { id: "embroidery_front_large", price: 2.95 },
	back: { id: "embroidery_back", price: 2.95 },
	right: { id: "embroidery_right", price: 2.95 },
	left: { id: "embroidery_left", price: 2.95 },
};

export const EMBROIDERY_TYPES = {
	flat: { title: "Flat Embroidery", price: 0.0 },
	"3d": { title: "3D Puff", price: 1.5 },
	both: { title: "Partial 3D Puff", price: 1.5 },
};

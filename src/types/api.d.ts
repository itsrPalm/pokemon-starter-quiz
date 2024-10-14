// // // /src/types/api.ts

// // import { Pokemon } from "./pokemon";

// // export interface SaveResultsRequestBody {
// //     trainerName: string;
// //     grassPokemon: Pokemon[]; // Replace `any` with the actual type if available
// //     firePokemon: Pokemon[];  // Replace `any` with the actual type if available
// //     waterPokemon: Pokemon[]; // Replace `any` with the actual type if available
// //     teamSummary: string;
// //   }

// //   export interface SaveResultsResponse {
// //     id?: string;
// //     error?: string;
// //   }

// //   export interface ProcessPendingAudiosResponse {
// //     message?: string;
// //     error?: string;
// //   }

// //   export interface GetAudioResponse {
// //     audioStatus: string;
// //     audioBase64: string | null;
// //     error?: string;
// //   }

// // /src/types/api.ts

// import { Pokemon } from "@/types/Pokemon"; // Ensure correct import path

// export interface SaveResultsRequestBody {
//   trainerName: string;
//   grassPokemon: Pokemon[];
//   firePokemon: Pokemon[];
//   waterPokemon: Pokemon[];
//   teamSummary: string;
// }

// export interface SaveResultsResponse {
//   id?: string;
//   error?: string;
// }

// export interface ProcessPendingAudiosResponse {
//   message?: string;
//   error?: string;
// }

// export interface GetAudioResponse {
//   audioStatus: string;
//   audioBase64: string | null;
//   error?: string;
// }

// /src/types/api.ts

import { Pokemon } from "@/types/Pokemon"; // Ensure correct import path

export interface SaveResultsRequestBody {
	trainerName: string;
	grassPokemon: Pokemon[];
	firePokemon: Pokemon[];
	waterPokemon: Pokemon[];
	teamSummary: string;
}

export interface SaveResultsResponse {
	id?: string;
	error?: string;
}

export interface ProcessPendingAudiosResponse {
	message?: string;
	error?: string;
}

export interface GetAudioResponse {
	audioStatus: string;
	audioBase64: string | null;
	error?: string;
}

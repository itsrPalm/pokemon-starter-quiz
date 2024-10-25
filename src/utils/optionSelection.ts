// // utils/optionSelection.ts
// import { Option } from "@prisma/client";

// interface SelectedOption {
//   optionId: string;
//   selectedValue: string | string[] | null;
//   additionalPrice: number;
// }

// export const selectRandomOptions = (options: Option[]): SelectedOption[] => {
//   const selectedOptions: SelectedOption[] = [];

//   options.forEach((option) => {
//     let selectedValue: string | string[] | null = null;
//     let additionalPrice = 0;

//     if (option.type === "radio" && option.values) {
//       const keys = Object.keys(option.values);
//       const randomKey = keys[Math.floor(Math.random() * keys.length)];
//       selectedValue = option.values[randomKey];
//       additionalPrice = parseFloat(option.additional_price_breakdown[randomKey] || "0");
//     } else if (option.type === "multi_select" && option.values) {
//       const keys = Object.keys(option.values);
//       const numberOfSelections = Math.floor(Math.random() * keys.length) + 1;
//       const shuffled = keys.sort(() => 0.5 - Math.random());
//       const selectedKeys = shuffled.slice(0, numberOfSelections);
//       selectedValue = selectedKeys.map((key) => option.values[key]);
//       additionalPrice = selectedKeys.reduce((acc, key) => acc + parseFloat(option.additional_price_breakdown[key] || "0"), 0);
//     } else if (option.type === "text") {
//       selectedValue = "Default note";
//       additionalPrice = parseFloat(option.additional_price_breakdown["flat"] || "0");
//     }

//     selectedOptions.push({
//       optionId: option.id,
//       selectedValue,
//       additionalPrice,
//     });
//   });

//   return selectedOptions;
// };

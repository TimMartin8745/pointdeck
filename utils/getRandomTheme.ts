import { themeOptions } from "@/types";

export function getRandomTheme() {
  const randomOptions = themeOptions.filter(
    (option) => !option.includes("grey")
  );
  const randomIndex = Math.floor(Math.random() * randomOptions.length);
  return randomOptions[randomIndex];
}

export function getVotingSystem(system: string): string[] {
  switch (system) {
    case "fibonacci":
      return ["1", "2", "3", "5", "8", "13", "21", "34", "55", "89"];
    case "tshirts":
      return ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
    case "powers":
      return ["1", "2", "4", "8", "16", "32", "64"];
    default:
      return [];
  }
}

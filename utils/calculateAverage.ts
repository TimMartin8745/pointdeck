import type { User } from "@/types";
import { getVotingSystem } from "./getVotingSystem";

export function calculateAverage(votingSystem: string, voters: User[]) {
  if (votingSystem === "tshirts") {
    const system = getVotingSystem(votingSystem);
    const votes = voters.map(({ vote }) => {
      const index = system.findIndex((value) => value === vote);
      return index + 1;
    });
    const sum = votes.reduce((acc, cur) => acc + cur, 0);
    const average = sum / votes.length;
    return system[Math.round(average)];
  }

  const votes = voters.map(({ vote }) => Number(vote));
  const sum = votes.reduce((acc, cur) => acc + cur, 0);
  return (sum / votes.length).toFixed(1);
}

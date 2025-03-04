import type { User } from "@/types";
import { getVotingSystem } from "./getVotingSystem";

export function calculateAverage(votingSystem: string, voters: User[]) {
  const validVotes = voters
    .map(({ vote }) => vote)
    .filter((vote): vote is string => vote != null);

  if (votingSystem === "tshirts") {
    const system = getVotingSystem(votingSystem);
    const votes = validVotes.map((vote) => {
      const index = system.findIndex((value) => value === vote);
      return index + 1;
    });
    const sum = votes.reduce((acc, cur) => acc + cur, 0);
    const average = sum / votes.length;
    return system[Math.round(average)];
  }

  const sum = validVotes.reduce((acc, cur) => acc + Number(cur), 0);
  return (sum / validVotes.length).toFixed(1);
}

import type { User } from "@/types";

export function calculateSpread(voters: User[]) {
  const votes = voters.map(({ vote }) => vote);

  const groups = votes.reduce<Record<string, number>>((acc, cur) => {
    if (cur == null) return acc;
    const prevValue = acc[cur] ?? 0;
    acc[cur] = prevValue + 1;
    return acc;
  }, {});

  return groups;
}

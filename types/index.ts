export enum VotingSystem {
  Fibonacci = "fibonacci",
  T_Shirts = "tshirts",
  Powers_Of_2 = "powers",
}

export type Votes = Record<string, number>

export interface Room {
  id?: string; // uuid
  created_at?: number; // timestamptz
  name: string; // text
  voting_system: VotingSystem; // text
  revealed?: boolean; // bool
  votes: Votes // json
}

export interface Player {
  id: string;
  name: string;
  vote: number | string | null;
  isSpectator: boolean;
  createdAt: number;
}
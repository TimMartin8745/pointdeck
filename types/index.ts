export interface Room {
  id: string;
  name: string;
  votingSystem: string;
  createdAt: number; // Firebase Timestamp
  isRevealed: boolean;
}

export interface Player {
  id: string;
  name: string;
  vote: number | string | null;
  isSpectator: boolean;
  createdAt: number; // Firebase Timestamp
}
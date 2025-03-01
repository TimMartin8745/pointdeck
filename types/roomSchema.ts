import { z } from "zod";
import { userSchema } from "./userSchema";

// VotingSystem
export const votingSystems = ["fibonacci", "tshirts", "powers"] as const;

export const votingSystemSchema = z.enum(votingSystems);

export type VotingSystem = z.infer<typeof votingSystemSchema>;

export const votingSystemMap: Record<VotingSystem, string> = {
  fibonacci: "Fibonacci",
  tshirts: "T-Shirts",
  powers: "Powers of 2",
} as const;

// ThemeOption
export const themeOptions = [
  "grey",
  "cool-grey",
  "warm-grey",
  "brown",
  "red",
  "crimson",
  "orange",
  "amber",
  "yellow",
  "lime",
  "light-green",
  "green",
  "teal",
  "cyan",
  "light-blue",
  "blue",
  "indigo",
  "purple",
  "pink",
] as const;

export const themeOptionSchema = z.enum(themeOptions);

export type ThemeOption = z.infer<typeof votingSystemSchema>;

// Room
export const roomSchema = z.object({
  id: z.string().uuid().describe("uuid"),
  created_at: z.string().describe("timestamptz"),
  name: z.string().describe("text"),
  voting_system: votingSystemSchema.describe("text"),
  theme: themeOptionSchema.describe("text"),
  revealed: z.boolean().describe("bool"),
  votes: z.array(userSchema).describe("jsonb[]"),
});

export type Room = z.infer<typeof roomSchema>;

// RoomPacket
export const roomPacketSchema = z.object({
  id: z.string().uuid().optional().describe("uuid"),
  created_at: z.string().optional().describe("timestamptz"),
  name: z.string().describe("text"),
  voting_system: votingSystemSchema.describe("text"),
  theme: themeOptionSchema.describe("text"),
  revealed: z.boolean().optional().describe("bool"),
  votes: z.array(userSchema).optional().describe("jsonb[]"),
});

export type RoomPacket = z.infer<typeof roomSchema>;

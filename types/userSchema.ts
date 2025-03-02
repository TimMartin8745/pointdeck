import { z } from "zod";

// Voter
export const voterSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  vote: z.string().nullable(),
});

export type Voter = z.infer<typeof voterSchema>;

// Spectator
export const spectatorSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  spectator: z.literal(true),
});

export type Spectator = z.infer<typeof spectatorSchema>;

// User
export const userSchema = z.union([voterSchema, spectatorSchema]);

export type User = z.infer<typeof userSchema>;

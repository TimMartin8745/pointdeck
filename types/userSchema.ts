import { z } from "zod";

// User
export const userSchema = z.object({
  id: z.string(),
  room_id: z.string(),
  name: z.string(),
  vote: z.string().nullable(),
  spectator: z.boolean(),
});

export type User = z.infer<typeof userSchema>;

// UserPacket
export const userPacketSchema = z.object({
  room_id: z.string(),
  name: z.string(),
  spectator: z.boolean(),
});

export type UserPacket = z.infer<typeof userPacketSchema>;

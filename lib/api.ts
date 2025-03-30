import type { Room, RoomPacket, User, UserPacket } from "@/types";
import { supabase } from "./supabase";

export async function createRoom(room: RoomPacket) {
  const { data, error } = await supabase.rpc<"create_room", Room>(
    "create_room",
    room
  );

  if (error || !data) {
    throw error;
  }

  return data;
}

export async function getRoom(id: string) {
  const { data, error } = await supabase.rpc<"get_room", Room>("get_room", {
    id,
  });

  if (error || !data) {
    throw error;
  }

  return data;
}

export async function revealRoom(id: string) {
  const { error } = await supabase.rpc("reveal_room", {
    id,
  });

  if (error) {
    throw error;
  }
}

export async function resetRoom(_room_id: string) {
  const { error } = await supabase.rpc("reset_room_state", { _room_id });

  if (error) {
    throw error;
  }
}

export async function getUsers(roomId: string) {
  const { data, error } = await supabase
    .from("users")
    .select<"*", User>("*")
    .eq("room_id", roomId);

  if (error || !data) {
    throw error;
  }

  return Object.fromEntries(data.map((user) => [user.id, user]));
}

export async function getVoters(roomId: string) {
  const { data, error } = await supabase
    .from("users")
    .select<"*", User>("*")
    .eq("room_id", roomId)
    .eq("spectator", false);

  if (error || !data) {
    throw error;
  }

  return Object.fromEntries(data.map((voter) => [voter.id, voter]));
}

export async function getSpectators(roomId: string) {
  const { data, error } = await supabase
    .from("users")
    .select<"*", User>("*")
    .eq("room_id", roomId)
    .eq("spectator", true);

  if (error || !data) {
    throw error;
  }

  return Object.fromEntries(data.map((spectator) => [spectator.id, spectator]));
}

export async function addUser(user: UserPacket) {
  const { data, error } = await supabase
    .from("users")
    .upsert(user, { onConflict: "id" })
    .select()
    .single<User>();

  if (error || !data) {
    throw error;
  }

  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function vote(userId: string, vote: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ vote })
    .eq("id", userId)
    .select()
    .single<User>();

  if (error || !data) {
    throw error;
  }

  return data;
}

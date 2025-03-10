import type { Room, RoomPacket, User, UserPacket } from "@/types";
import { supabase } from "./supabase";

export async function createRoom(room: RoomPacket) {
  const { data, error } = await supabase
    .from("rooms")
    .upsert(room, { onConflict: "id" })
    .select()
    .single<Room>();

  if (error || !data) {
    throw error;
  }

  return data;
}

export async function getRoom(roomId: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single<Room>();

  if (error || !data) {
    throw error;
  }

  return data;
}

export async function revealRoom(roomId: string) {
  const { error } = await supabase
    .from("rooms")
    .update({ revealed: true })
    .eq("id", roomId);

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

  return data;
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
  const { error } = await supabase
    .from("users")
    .update({ vote })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

"use server";

import { queryClient } from "@/components/Providers";
import type { Room, RoomPacket, User } from "@/types";
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

  queryClient.invalidateQueries({ queryKey: ["room"] });
}

export async function resetRoom(roomId: string) {
  const { error } = await supabase.rpc("reset_room_state", { roomId });

  if (error) {
    throw error;
  }

  queryClient.invalidateQueries({ queryKey: ["room"] });
  queryClient.invalidateQueries({ queryKey: ["users"] });
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

  return data;
}

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single<User>();

  if (error || !data) {
    throw error;
  }

  return data;
}

export async function addUser(user: User) {
  const { error } = await supabase.from("users").insert(user);

  if (error) {
    throw error;
  }

  queryClient.invalidateQueries({ queryKey: ["users"] });
}

export async function vote(userId: string, vote: string) {
  const { error } = await supabase
    .from("users")
    .update({ vote })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  queryClient.invalidateQueries({ queryKey: ["users"] });
}

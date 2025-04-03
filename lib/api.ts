import type { Room, RoomPacket, UserPacket } from "@/types";
import { roomSchema, userSchema } from "@/types";
import { supabase } from "./supabase";
import { z } from "zod";

export async function createRoom(room: RoomPacket) {
  const { data, error } = await supabase.rpc("create_room", room);

  if (error || !data) {
    throw error;
  }

  console.log(data);

  const roomData: Room = {
    id: data[0].room_id,
    created_at: data[0].room_created_at,
    name: data[0].room_name,
    voting_system: data[0].room_voting_system,
    theme: data[0].room_theme,
    revealed: data[0].room_revealed,
  };

  return roomSchema.parse(roomData);
}

export async function getRoom(id: string) {
  const { data, error } = await supabase.rpc("get_room", {
    id,
  });

  if (error || !data) {
    throw error;
  }

  return roomSchema.parse(data);
}

export async function revealRoom(id: string) {
  const { error } = await supabase.rpc("reveal_room", {
    id,
  });

  if (error) {
    throw error;
  }
}

export async function resetRoom(id: string) {
  const { error } = await supabase.rpc("reset_room", { id });

  if (error) {
    throw error;
  }
}

export async function getUsers(room_id: string) {
  const { data, error } = await supabase.rpc("get_users", {
    room_id,
  });

  if (error || !data) {
    throw error;
  }

  return z.array(userSchema).parse(data);
}

export async function getVoters(room_id: string) {
  const { data, error } = await supabase.rpc("get_voters", {
    room_id,
  });

  if (error || !data) {
    throw error;
  }

  return z.array(userSchema).parse(data);
}

export async function getSpectators(room_id: string) {
  const { data, error } = await supabase.rpc("get_spectators", {
    room_id,
  });

  if (error || !data) {
    throw error;
  }

  return z.array(userSchema).parse(data);
}

export async function addUser(userPacket: UserPacket) {
  const { data, error } = await supabase.rpc("add_user", userPacket);

  if (error || !data) {
    throw error;
  }

  return userSchema.parse(data);
}

export async function deleteUser(id: string) {
  const { error } = await supabase.rpc("delete_user", { id });

  if (error) {
    throw error;
  }
}

export async function vote(id: string, vote: string) {
  const { data, error } = await supabase.rpc("vote", { id, vote });

  if (error || !data) {
    throw error;
  }

  return userSchema.parse(data);
}

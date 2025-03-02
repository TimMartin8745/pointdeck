import { redirect } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { roomSchema } from "@/types";

import styles from "./Room.module.scss";

export default async function PokerRoomLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ room: string }>;
}>) {
  const room = (await params).room;

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", room)
    .single();

  if (error || !data) {
    console.error(error);
    redirect(`/new?room=${room}`);
  }

  // Redirect if room data is not valid
  const {
    data: roomData,
    error: zodError,
    success,
  } = roomSchema.safeParse(data);
  if (!success) {
    console.error(zodError);
    redirect(`/new?room=${room}`);
  }

  // Redirect if room is older than 1 day
  const createdAt = new Date(roomData.created_at);
  if (new Date().getTime() - createdAt.getTime() > 24 * 60 * 60 * 1000) {
    redirect(`/new?room=${room}`);
  }

  return <div className={styles.container}>{children}</div>;
}

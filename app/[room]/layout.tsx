import { redirect } from "next/navigation";

import { getRoom } from "@/lib/api";

import styles from "./Room.module.scss";
import { tryCatch } from "@/utils";

const ONE_DAY = 24 * 60 * 60 * 1000;

export default async function PokerRoomLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ room: string }>;
}>) {
  const roomId = (await params).room;

  if (!roomId) redirect("/new");

  const room = await tryCatch(getRoom(roomId));

  if (!room.success) {
    console.error(room.error);
    redirect(`/new?room=${roomId}`);
  }

  // Redirect if room is older than 1 day
  const createdAt = new Date(room.value.created_at);
  if (new Date().getTime() - createdAt.getTime() > ONE_DAY) {
    redirect(`/new?room=${roomId}`);
  }

  return <div className={styles.container}>{children}</div>;
}

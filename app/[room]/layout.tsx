import { redirect } from "next/navigation";

import { getRoom } from "@/lib/api";

import styles from "./Room.module.scss";
import Channels from "@/components/Channels";

export default async function PokerRoomLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ room: string }>;
}>) {
  const roomId = (await params).room;

  const room = await getRoom(roomId).catch((error) => {
    console.error(error);
    redirect(`/new?room=${roomId}`);
  });

  // // Redirect if room is older than 1 day
  const createdAt = new Date(room.created_at);
  if (new Date().getTime() - createdAt.getTime() > 24 * 60 * 60 * 1000) {
    redirect(`/new?room=${roomId}`);
  }

  return (
    <div className={styles.container}>
      <Channels roomId={roomId}>
        {children}
      </Channels>
    </div>
  );
}

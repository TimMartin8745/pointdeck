import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createRoom } from "@/lib/api";
import { roomPacketSchema } from "@/types";

import DynamicNewRoomForm from "./dynamic";

import styles from "./NewRoom.module.scss";
import { getRandomTheme } from "@/utils";

export default async function NewRoom({
  searchParams,
}: {
  searchParams: Promise<{ room: string }>;
}) {
  const roomId = (await searchParams).room;

  const createNewRoom = async (formData: FormData) => {
    "use server";
    let redirectPath: string | null = null;

    try {
      const roomPacket = {
        ...(roomId ? { id: roomId, created_at: new Date().toISOString() } : {}),
        name: formData.get("roomName"),
        voting_system: formData.get("votingSystem"),
        theme: formData.get("theme"),
        revealed: false,
      };

      const validRoomPacket = roomPacketSchema.parse(roomPacket);

      const room = await createRoom(validRoomPacket);

      console.log("room", room);

      redirectPath = `/${room.id}`;
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      console.log("redirectPath", redirectPath);
      if (redirectPath) redirect(redirectPath);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Room</h1>
      <Suspense>
        <DynamicNewRoomForm
          initialTheme={getRandomTheme()}
          newRoomAction={createNewRoom}
        />
      </Suspense>
    </div>
  );
}

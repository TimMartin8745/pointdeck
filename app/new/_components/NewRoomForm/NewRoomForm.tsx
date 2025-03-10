"use client";

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { createRoom } from "@/lib/api";
import { getRandomTheme } from "@/utils";
import { roomPacketSchema } from "@/types";

import styles from "./NewRoomForm.module.scss";

const NewRoomForm = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
  const mutateRoom = useMutation({
    mutationFn: createRoom,
  });

  const createNewRoom = async (formData: FormData) => {
    let redirectPath: string | null = null;

    try {
      let theme = formData.get("theme");
      if (theme === "random") {
        theme = getRandomTheme();
      }

      const roomPacket = {
        ...(roomId ? { id: roomId, created_at: new Date().toISOString() } : {}),
        name: formData.get("roomName"),
        voting_system: formData.get("votingSystem"),
        theme: theme,
        revealed: false,
      };

      const validRoomPacket = roomPacketSchema.parse(roomPacket);

      const room = await mutateRoom.mutateAsync(validRoomPacket);

      redirectPath = `/${room.id}`;
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      if (redirectPath) redirect(redirectPath);
    }
  };

  return (
    <form className={styles.container} action={createNewRoom}>
      {children}
    </form>
  );
};

export default NewRoomForm;

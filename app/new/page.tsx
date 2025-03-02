import { Suspense } from "react";
import { redirect } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { roomPacketSchema, roomSchema, themeOptions } from "@/types";

import DynamicNewRoomForm from "./dynamic";

import styles from "./NewRoom.module.scss";

export default async function NewRoom({
  searchParams,
}: {
  searchParams: Promise<{ room: string }>;
}) {
  const room = (await searchParams).room;

  const createNewRoom = async (formData: FormData) => {
    "use server";
    let redirectPath: string | null = null;

    try {
      let theme = formData.get("theme");
      if (theme === "random") {
        const randomOptions = themeOptions.filter(
          (option) => !option.includes("grey")
        );
        const randomIndex = Math.floor(Math.random() * randomOptions.length);
        theme = randomOptions[randomIndex];
      }

      const roomData = {
        ...(room ? { id: room, created_at: new Date().toISOString() } : {}),
        name: formData.get("roomName"),
        voting_system: formData.get("votingSystem"),
        theme: theme,
        revealed: false,
        votes: [],
      };

      const validRoomData = roomPacketSchema.parse(roomData);

      console.log("Upserting...");
      console.dir();

      const { data, error } = await supabase
        .from("rooms")
        .upsert(validRoomData, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;

      // Throw error if response is not valid
      const {
        data: response,
        error: zodError,
        success,
      } = roomSchema.safeParse(data);

      if (!success) throw zodError;

      redirectPath = `/${response.id}`;
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      if (redirectPath) redirect(redirectPath);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Room</h1>
      <Suspense>
        <DynamicNewRoomForm newRoomAction={createNewRoom} />
      </Suspense>
    </div>
  );
}

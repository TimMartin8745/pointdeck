import { redirect } from "next/navigation";
import type { PostgrestError } from "@supabase/supabase-js";

import { createRoom } from "@/lib/api";
import type { Room } from "@/types";
import {
  roomPacketSchema,
  themeOptions,
  votingSystemMap,
  votingSystems,
} from "@/types";

import styles from "./NewRoom.module.scss";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import ThemePicker from "./_components/ThemePicker/ThemePicker";
import { getRandomTheme, tryCatch } from "@/utils";
import Dropdown from "@/components/Dropdown/Dropdown";

export default async function NewRoom({
  searchParams,
}: {
  searchParams: Promise<{ room: string }>;
}) {
  const roomId = (await searchParams).room;

  const createNewRoom = async (formData: FormData) => {
    "use server";

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

    const room = await tryCatch<Room, PostgrestError>(
      createRoom(validRoomPacket)
    );

    if (!room.success) {
      console.error("Error creating room:", room.error);
      return;
    }

    redirect(`/${room.value.id}`);
  };

  return (
    <form className={styles.container} action={createNewRoom}>
      <h1>Create New Room</h1>
      <div className={styles.field}>
        <Input name="roomName" title="Room Name" />
      </div>
      <div className={styles.field}>
        <Dropdown
          name="votingSystem"
          title="Voting System"
          options={votingSystems}
          renderOption={(system) => votingSystemMap[system]}
        />
      </div>
      <div className={styles.field}>
        <fieldset className={styles.theme}>
          <legend>Select a room theme:</legend>
          <ThemePicker
            key={"random"}
            name="theme"
            value={"random"}
            defaultValue={"random"}
            isRandom
          />
          {themeOptions
            .filter((option) => !option.includes("grey"))
            .map((theme) => (
              <ThemePicker
                key={theme}
                name="theme"
                value={theme}
                defaultValue={"random"}
              />
            ))}
        </fieldset>
      </div>
      <Button type="submit" text="Create Room" />
    </form>
  );
}

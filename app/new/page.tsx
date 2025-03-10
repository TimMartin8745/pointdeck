import { themeOptions, votingSystemMap, votingSystems } from "@/types";

import styles from "./NewRoom.module.scss";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import ThemePicker from "./_components/ThemePicker/ThemePicker";
import NewRoomForm from "./_components/NewRoomForm/NewRoomForm";

export default async function NewRoom({
  searchParams,
}: {
  searchParams: Promise<{ room: string }>;
}) {
  const roomId = (await searchParams).room;

  return (
    <NewRoomForm roomId={roomId}>
      <h1>Create New Room</h1>
      <div className={styles.field}>
        <Input name="roomName" title="Room Name" />
      </div>
      <div className={styles.field}>
        <label>
          Voting System
          <select name="votingSystem">
            {votingSystems.map((system) => (
              <option key={system} value={system}>
                {votingSystemMap[system]}
              </option>
            ))}
          </select>
        </label>
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
    </NewRoomForm>
  );
}

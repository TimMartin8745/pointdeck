"use client";

import { themeOptions, votingSystemMap, votingSystems } from "@/types";
import Button from "@/components/Button/Button";

import styles from "./NewRoom.module.scss";
import ThemeOption from "@/components/ThemeOption/ThemeOption";

export default function DynamicNewRoomForm({
  newRoomAction,
}: {
  newRoomAction: (formData: FormData) => void;
}) {
  return (
    <form action={newRoomAction}>
      <div className={styles.field}>
        <label>
          Room Name
          <input type="text" name="roomName" required />
        </label>
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
          <ThemeOption
            key={"random"}
            name="theme"
            value={"random"}
            defaultValue={"random"}
          />
          {themeOptions
            .filter((option) => !option.includes("grey"))
            .map((theme) => (
              <ThemeOption
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

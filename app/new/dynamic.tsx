"use client";

import { themeOptions, votingSystemMap, votingSystems } from "@/types";
import Button from "@/components/Button/Button";

import styles from "./NewRoom.module.scss";

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
        <label>
          Room Theme
          <select name="theme">
            {themeOptions.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Button type="submit" text="Create Room" />
    </form>
  );
}

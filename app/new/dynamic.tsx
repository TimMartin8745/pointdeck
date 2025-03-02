"use client";

import {
  type ThemeOption,
  themeOptions,
  votingSystemMap,
  votingSystems,
} from "@/types";
import Button from "@/components/Button/Button";

import styles from "./NewRoom.module.scss";
import ThemeOptionInput from "@/components/ThemeOptionInput/ThemeOptionInput";
import { useState } from "react";

export default function DynamicNewRoomForm({
  newRoomAction,
}: {
  newRoomAction: (formData: FormData) => void;
}) {
  const [theme, setTheme] = useState<ThemeOption | undefined>(undefined);

  const randomOptions = themeOptions.filter(
    (option) => !option.includes("grey")
  );
  const randomIndex = Math.floor(Math.random() * randomOptions.length);
  const random = randomOptions[randomIndex];

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
          <ThemeOptionInput
            key={"random"}
            name="theme"
            value={random}
            defaultValue={random}
            onClick={() => setTheme(random)}
            isRandom
          />
          {themeOptions
            .filter((option) => !option.includes("grey"))
            .map((theme) => (
              <ThemeOptionInput
                key={theme}
                name="theme"
                value={theme}
                defaultValue={random}
                onClick={() => setTheme(theme)}
              />
            ))}
        </fieldset>
      </div>
      <Button type="submit" text="Create Room" variant={theme} />
    </form>
  );
}

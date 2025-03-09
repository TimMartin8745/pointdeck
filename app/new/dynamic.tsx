"use client";

import {
  type ThemeOption,
  themeOptions,
  votingSystemMap,
  votingSystems,
} from "@/types";
import Button from "@/components/Button/Button";

import styles from "./NewRoom.module.scss";
import ThemeOptionInput from "@/app/new/_components/ThemePicker/ThemePicker";
import { useState } from "react";
import { getRandomTheme } from "@/utils";
import Input from "@/components/Input/Input";

export default function DynamicNewRoomForm({
  initialTheme,
}: {
  initialTheme: ThemeOption;
}) {
  const [theme, setTheme] = useState<ThemeOption>(initialTheme);

  return (
    <>
      <div className={styles.field}>
        <Input name="roomName" title="Room Name" required />
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
            value={theme}
            onClick={() => setTheme(getRandomTheme())}
            isRandom
          />
          {themeOptions
            .filter((option) => !option.includes("grey"))
            .map((theme) => (
              <ThemeOptionInput
                key={theme}
                name="theme"
                value={theme}
                defaultValue={initialTheme}
                onClick={() => setTheme(theme)}
              />
            ))}
        </fieldset>
      </div>
      <Button type="submit" text="Create Room" variant={theme} />
    </>
  );
}

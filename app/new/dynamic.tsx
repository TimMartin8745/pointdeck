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
import { getRandomTheme } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components/Providers";

export default function DynamicNewRoomForm({
  initialTheme,
  newRoomAction,
}: {
  initialTheme: ThemeOption;
  newRoomAction: (formData: FormData) => Promise<void>;
}) {
  const [theme, setTheme] = useState<ThemeOption>(initialTheme);

  const newRoomMutation = useMutation({
    mutationFn: newRoomAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room"] }),
  });

  return (
    <form action={newRoomMutation.mutate}>
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
    </form>
  );
}

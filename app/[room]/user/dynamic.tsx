"use client";

import Button from "@/components/Button/Button";

import styles from "./NewUser.module.scss";
import type { ThemeOption } from "@/types";

export default function DynamicNewUserForm({
  theme,
  newUserAction,
}: {
  theme?: ThemeOption;
  newUserAction: (formData: FormData) => void;
}) {
  return (
    <form action={newUserAction}>
      <div className={styles.field}>
        <label>
          Display Name
          <input type="text" name="name" required />
        </label>
      </div>
      <div className={styles.field}>
        <label>
          Spectator
          <input type="checkbox" name="spectator" />
        </label>
      </div>
      <Button type="submit" text="Enter Room" variant={theme} />
    </form>
  );
}

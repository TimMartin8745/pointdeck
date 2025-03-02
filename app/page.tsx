import React from "react";

import Button from "@/components/Button/Button";

import styles from "./Home.module.scss";
import { ThemeVariant } from "@/theme";

export default async function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Welcome to PointDeck</h1>
        <p>A free, real-time planning poker tool.</p>
        <Button
          href="/new"
          text="Create new room"
          variant={ThemeVariant.Indigo}
        />
      </div>
    </div>
  );
}

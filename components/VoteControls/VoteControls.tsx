"use client";

import { useState } from "react";
import type {
  RealtimePostgresChangesFilter,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import type { Room, ThemeOption } from "@/types";
import { roomSchema } from "@/types";
import Button from "../Button";

import styles from "./VoteControls.module.scss";

interface VoteControlsProps {
  room: string;
  isRevealed: boolean;
  theme?: ThemeOption;
  onReset: () => void;
  onReveal: () => void;
}

const VoteControls = ({
  room,
  isRevealed,
  theme,
  onReset,
  onReveal,
}: VoteControlsProps) => {
  const [revealed, setRevealed] = useState(isRevealed);

  // Listen for data updates
  const databaseFilter: RealtimePostgresChangesFilter<"UPDATE"> = {
    schema: "public",
    table: "rooms",
    filter: `id=eq.${room}`,
    event: "UPDATE",
  };

  supabase
    .channel(`${room}-VoteControls`)
    .on(
      "postgres_changes",
      databaseFilter,
      (payload: RealtimePostgresUpdatePayload<Room>) => {
        const newRoom = roomSchema.parse(payload.new);

        // revealed
        setRevealed(newRoom.revealed);
      }
    )
    .subscribe();

  return (
    <div className={styles.controls}>
      {revealed ? (
        <Button onClick={onReset} text="Reset Round" variant={theme} />
      ) : (
        <Button onClick={onReveal} text="Reveal Votes" variant={theme} />
      )}
    </div>
  );
};

export default VoteControls;

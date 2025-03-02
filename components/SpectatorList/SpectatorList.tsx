"use client";

import { useState } from "react";
import type {
  RealtimePostgresChangesFilter,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { roomSchema } from "@/types";
import type { Room, Spectator } from "@/types";

import styles from "./SpectatorList.module.scss";

interface SpectatorListProps {
  roomData: Room;
}

const SpectatorList = ({ roomData }: SpectatorListProps) => {
  const [spectators, setSpectators] = useState<Spectator[]>(
    roomData.votes.filter((user) => "spectator" in user)
  );

  // Listen for data updates
  const databaseFilter: RealtimePostgresChangesFilter<"UPDATE"> = {
    schema: "public",
    table: "rooms",
    filter: `id=eq.${roomData.id}`,
    event: "UPDATE",
  };

  supabase
    .channel(`${roomData.id}-SpectatorList`)
    .on(
      "postgres_changes",
      databaseFilter,
      (payload: RealtimePostgresUpdatePayload<Room>) => {
        const newRoom = roomSchema.parse(payload.new);

        // spectators
        const newSpectators = newRoom.votes.filter(
          (user) => "spectator" in user
        );

        setSpectators((cur) => {
          if (JSON.stringify(newSpectators) === JSON.stringify(cur)) return cur;
          return newSpectators;
        });
      }
    )
    .subscribe();

  if (spectators.length === 0) return null;

  return (
    <div className={styles.list}>
      <h2>Spectators</h2>
      <ul>
        {spectators.map((spectator) => (
          <li key={spectator.user_id}>
            <span>{spectator.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpectatorList;

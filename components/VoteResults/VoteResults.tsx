"use client";

import { useState } from "react";
import type {
  RealtimePostgresChangesFilter,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import type { Room } from "@/types";
import { roomSchema } from "@/types";

import styles from "./VoteResults.module.scss";
import { getVotingSystem } from "@/utils";
import VoteSpread from "../VoteSpread/VoteSpread";

interface VoteResultsProps {
  roomData: Room;
}

function calculateSpread(roomData: Room) {
  const voters = roomData.votes.filter((user) => "vote" in user);
  const votes = voters.map(({ vote }) => vote);

  const groups = votes.reduce<Record<string, number>>((acc, cur) => {
    if (cur == null) return acc;
    const prevValue = acc[cur] ?? 0;
    acc[cur] = prevValue + 1;
    return acc;
  }, {});

  return groups;
}

function calculateAverage(roomData: Room) {
  const voters = roomData.votes.filter((user) => "vote" in user);

  if (roomData.voting_system === "tshirts") {
    const system = getVotingSystem(roomData.voting_system);
    const votes = voters.map(({ vote }) => {
      const index = system.findIndex((value) => value === vote);
      return index + 1;
    });
    const sum = votes.reduce((acc, cur) => acc + cur, 0);
    const average = sum / votes.length;
    return system[Math.round(average)];
  }

  const votes = voters.map(({ vote }) => Number(vote));
  const sum = votes.reduce((acc, cur) => acc + cur, 0);
  return (sum / votes.length).toFixed(1);
}

const VoteResults = ({ roomData }: VoteResultsProps) => {
  const [revealed, setRevealed] = useState(roomData.revealed);
  const [spread, setSpread] = useState(calculateSpread(roomData));
  const [average, setAverage] = useState(calculateAverage(roomData));

  // Listen for data updates
  const databaseFilter: RealtimePostgresChangesFilter<"UPDATE"> = {
    schema: "public",
    table: "rooms",
    filter: `id=eq.${roomData.id}`,
    event: "UPDATE",
  };

  supabase
    .channel(`${roomData.id}-VoteResults`)
    .on(
      "postgres_changes",
      databaseFilter,
      (payload: RealtimePostgresUpdatePayload<Room>) => {
        const newRoom = roomSchema.parse(payload.new);

        // revealed
        setRevealed(newRoom.revealed);

        // spread
        const newSpread = calculateSpread(newRoom);
        setSpread(newSpread);

        // average
        const newAverage = calculateAverage(newRoom);
        setAverage(newAverage);
      }
    )
    .subscribe();

  if (!revealed) return null;

  return (
    <fieldset className={styles.results}>
      <legend>
        <h3>Results</h3>
      </legend>
      <VoteSpread spread={spread} theme={roomData.theme} />
      <div className={styles.result}>
        <h2>{average}</h2>
        <span>Average</span>
      </div>
    </fieldset>
  );
};

export default VoteResults;

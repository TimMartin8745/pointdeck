"use client";

import { useState } from "react";
import type {
  RealtimePostgresChangesFilter,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { roomSchema } from "@/types";
import type { Room, Voter } from "@/types";

import styles from "./VoterList.module.scss";

interface VoterListProps {
  roomData: Room;
}

const VoterList = ({ roomData }: VoterListProps) => {
  const [voters, setVoters] = useState<Voter[]>(
    roomData.votes.filter((user) => "vote" in user)
  );
  const [revealed, setRevealed] = useState(roomData.revealed);

  // Listen for data updates
  const databaseFilter: RealtimePostgresChangesFilter<"UPDATE"> = {
    schema: "public",
    table: "rooms",
    filter: `id=eq.${roomData.id}`,
    event: "UPDATE",
  };

  supabase
    .channel(`${roomData.id}-VoterList`)
    .on(
      "postgres_changes",
      databaseFilter,
      (payload: RealtimePostgresUpdatePayload<Room>) => {
        const newRoom = roomSchema.parse(payload.new);

        // voters
        const newVoters = newRoom.votes.filter((user) => "vote" in user);

        setVoters((cur) => {
          if (JSON.stringify(newVoters) === JSON.stringify(cur)) return cur;
          return newVoters;
        });

        // revealed
        setRevealed(newRoom.revealed);
      }
    )
    .subscribe();

  const numericVotes = voters
    .map((voter) => (typeof voter.vote === "number" ? voter.vote : null))
    .filter((vote) => vote !== null) as number[];

  const average =
    numericVotes.length > 0
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(
          2
        )
      : null;

  return (
    <div className={styles.list}>
      <h2>Voters</h2>
      <ul>
        {voters.map((voter) => (
          <li key={voter.user_id}>
            <span>{voter.name}</span>
            {" - "}
            <span>
              {revealed
                ? voter.vote !== null
                  ? voter.vote
                  : "No Vote"
                : voter.vote !== null
                ? "Voted"
                : "Not Voted"}
            </span>
          </li>
        ))}
      </ul>
      {revealed && average && (
        <div>
          <strong>Average Vote: </strong>
          {average}
        </div>
      )}
    </div>
  );
};

export default VoterList;

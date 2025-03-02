"use client";

import { useState } from "react";
import type {
  RealtimePostgresChangesFilter,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { voterSchema } from "@/types";
import type { Room, ThemeOption, Voter } from "@/types";
import { getVotingSystem } from "@/utils";
import VoteCard from "../VoteCard/VoteCard";

import styles from "./VotingBoard.module.scss";

interface VotingBoardProps {
  room: string;
  user: Voter;
  votingSystem: string;
  theme: ThemeOption;
  onVote: (vote: number | string) => void;
}

const VotingBoard = ({
  room,
  user,
  votingSystem,
  theme,
  onVote,
}: VotingBoardProps) => {
  const system = getVotingSystem(votingSystem);

  const [voter, setVoter] = useState(user);

  // Listen for data updates
  const databaseFilter: RealtimePostgresChangesFilter<"UPDATE"> = {
    schema: "public",
    table: "rooms",
    filter: `id=eq.${room}`,
    event: "UPDATE",
  };

  supabase
    .channel(`${room}-VotingBoard`)
    .on(
      "postgres_changes",
      databaseFilter,
      (payload: RealtimePostgresUpdatePayload<Room>) => {
        const newUser = payload.new.votes.find(
          ({ user_id }) => user_id === user.user_id
        );
        const newVoter = voterSchema.parse(newUser);
        setVoter((cur) => {
          if (JSON.stringify(newVoter) === JSON.stringify(cur)) return cur;
          return newVoter;
        });
      }
    )
    .subscribe();

  return (
    <div className={styles.board}>
      {system.map((value) => (
        <VoteCard
          key={value}
          value={value}
          onClick={() => onVote(value)}
          selected={voter.vote === value}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default VotingBoard;

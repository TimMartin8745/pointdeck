"use client";

import { useQuery } from "@tanstack/react-query";

import { getRoom, getVoters } from "@/lib/api";
import type { Room, User } from "@/types";
import { calculateAverage, calculateSpread } from "@/utils";

import VoteSpread from "./VoteSpread/VoteSpread";

import styles from "./VoteResults.module.scss";

interface VoteResultsProps {
  roomId: string;
  initialRoom: Room;
  initialVoters: User[];
}

const VoteResults = ({
  roomId,
  initialRoom,
  initialVoters,
}: VoteResultsProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const { data: voters } = useQuery<User[]>({
    queryKey: ["users", "voters"],
    queryFn: () => getVoters(roomId),
    initialData: initialVoters,
  });

  const spread = calculateSpread(voters);
  const average = calculateAverage(room.voting_system, voters);

  if (!room.revealed) return null;

  return (
    <fieldset className={styles.results}>
      <legend>
        <h3>Results</h3>
      </legend>
      <VoteSpread spread={spread} theme={room.theme} />
      <div className={styles.result}>
        <h2>{average}</h2>
        <span>Average</span>
      </div>
    </fieldset>
  );
};

export default VoteResults;

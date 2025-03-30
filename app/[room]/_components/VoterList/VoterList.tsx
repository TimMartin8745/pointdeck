"use client";

import { useQuery } from "@tanstack/react-query";

import { getRoom, getVoters } from "@/lib/api";
import type { Room, User } from "@/types";

import styles from "./VoterList.module.scss";

interface VoterListProps {
  roomId: string;
  initialRoom: Room;
  initialVoters: Record<string, User>;
}

const VoterList = ({ roomId, initialRoom, initialVoters }: VoterListProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const { data: voters } = useQuery<Record<string, User>>({
    queryKey: ["users", "voters"],
    queryFn: () => getVoters(roomId),
    initialData: initialVoters,
  });

  return (
    <ul className={styles.list}>
      {Object.values(voters).map((voter) => {
        const vote = room.revealed
          ? voter.vote ?? "No Vote"
          : (voter.vote && "Voted") || "Not Voted";

        return <li key={voter.id}>{`${voter.name} - ${vote}`}</li>;
      })}
    </ul>
  );
};

export default VoterList;

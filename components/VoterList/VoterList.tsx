"use client";

import { useQuery } from "@tanstack/react-query";

import { getRoom, getVoters } from "@/lib/api";
import type { Room, User } from "@/types";

import styles from "./VoterList.module.scss";

interface VoterListProps {
  roomId: string;
  initialRoom: Room;
}

const VoterList = ({ roomId, initialRoom }: VoterListProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const { data: voters } = useQuery<User[]>({
    queryKey: ["user", "voter"],
    queryFn: () => getVoters(roomId),
  });

  return (
    <ul className={styles.list}>
      {voters?.map((voter) => (
        <li key={voter.id}>
          <span>{voter.name}</span>
          {" - "}
          <span>
            {room.revealed
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
  );
};

export default VoterList;

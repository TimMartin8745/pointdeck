"use client";

import { useQuery } from "@tanstack/react-query";

import { getRoom, getUsers } from "@/lib/api";
import type { Room, User } from "@/types";

import styles from "./VoterList.module.scss";

interface VoterListProps {
  roomId: string;
  initialRoom: Room;
  initialUsers: User[];
}

const VoterList = ({ roomId, initialRoom, initialUsers }: VoterListProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(roomId),
    initialData: initialUsers,
  });

  const voters = users.filter(({ spectator }) => !spectator);

  return (
    <ul className={styles.list}>
      {voters?.map((voter) => {
        const vote = room.revealed
          ? voter.vote ?? "No Vote"
          : (voter.vote && "Voted") || "Not Voted";

        return <li key={voter.id}>{`${voter.name} - ${vote}`}</li>;
      })}
    </ul>
  );
};

export default VoterList;

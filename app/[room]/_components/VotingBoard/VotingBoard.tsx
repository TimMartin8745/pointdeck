"use client";

import { getRoom, getUsers, vote } from "@/lib/api";
import type { Room, User } from "@/types";
import { getVotingSystem } from "@/utils";
import VoteCard from "./VoteCard/VoteCard";

import styles from "./VotingBoard.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../../components/Providers";

interface VotingBoardProps {
  roomId: string;
  initialRoom: Room;
  userId: string;
  initialUsers: User[];
}

const VotingBoard = ({
  roomId,
  initialRoom,
  userId,
  initialUsers,
}: VotingBoardProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const votingSystem = getVotingSystem(room.voting_system);

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(roomId),
    initialData: initialUsers,
  });

  const voteMutation = useMutation({
    mutationFn: (value: string) => vote(userId, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const user = users?.find(({ id }) => id === userId);

  return (
    <div className={styles.board}>
      {votingSystem.map((value) => (
        <VoteCard
          key={value}
          value={value}
          onClick={() => voteMutation.mutate(value)}
          selected={user?.vote === value}
          theme={room.theme}
        />
      ))}
    </div>
  );
};

export default VotingBoard;

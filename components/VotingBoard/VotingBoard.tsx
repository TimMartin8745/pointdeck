"use client";

import { getRoom, getUser, vote } from "@/lib/api";
import type { Room, User } from "@/types";
import { getVotingSystem } from "@/utils";
import VoteCard from "../VoteCard/VoteCard";

import styles from "./VotingBoard.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../Providers";

interface VotingBoardProps {
  roomId: string;
  initialRoom: Room;
  userId: string;
  initialUser: User;
}

const VotingBoard = ({
  roomId,
  initialRoom,
  userId,
  initialUser,
}: VotingBoardProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const votingSystem = getVotingSystem(room.voting_system);

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getUser(userId),
    initialData: initialUser,
  });

  const voteMutation = useMutation({
    mutationFn: (value: string) => vote(userId, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  if (user.spectator) return null;

  return (
    <div className={styles.board}>
      {votingSystem.map((value) => (
        <VoteCard
          key={value}
          value={value}
          onClick={() => voteMutation.mutate(value)}
          selected={user.vote === value}
          theme={room.theme}
        />
      ))}
    </div>
  );
};

export default VotingBoard;

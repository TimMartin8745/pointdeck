"use client";

import { getRoom, getVoters, vote } from "@/lib/api";
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
  initialVoters: Record<string, User>;
}

const VotingBoard = ({
  roomId,
  initialRoom,
  userId,
  initialVoters,
}: VotingBoardProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const votingSystem = getVotingSystem(room.voting_system);

  const { data: voters } = useQuery<Record<string, User>>({
    queryKey: ["users", "voters"],
    queryFn: () => getVoters(roomId),
    initialData: initialVoters,
  });

  const voteMutation = useMutation({
    mutationFn: (value: string) => vote(userId, value),
    onSuccess: (newData) => {
      queryClient.setQueryData<Record<string, User>>(
        ["users", "voters"],
        (oldData) => oldData && { ...oldData, [newData.id]: newData }
      );
    },
  });

  return (
    <div className={styles.board}>
      {votingSystem.map((value) => (
        <VoteCard
          key={value}
          value={value}
          onClick={() => voteMutation.mutate(value)}
          selected={voters[userId]?.vote === value}
          theme={room.theme}
        />
      ))}
    </div>
  );
};

export default VotingBoard;

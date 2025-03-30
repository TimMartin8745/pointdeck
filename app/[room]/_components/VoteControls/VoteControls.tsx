"use client";

import { getRoom, getVoters, resetRoom, revealRoom } from "@/lib/api";
import type { Room, User } from "@/types";
import Button from "@/components/Button/Button";

import styles from "./VoteControls.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/Providers";

interface VoteControlsProps {
  roomId: string;
  initialRoom: Room;
  initialVoters: Record<string, User>;
}

const VoteControls = ({
  roomId,
  initialRoom,
  initialVoters,
}: VoteControlsProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const { data: users } = useQuery<Record<string, User>>({
    queryKey: ["users", "voters"],
    queryFn: () => getVoters(roomId),
    initialData: initialVoters,
  });

  const noVotes = Object.values(users).every(({ vote }) => vote === null);

  const resetMutation = useMutation({
    mutationFn: () => resetRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["users", "voters"] });
    },
  });

  const revealMutation = useMutation({
    mutationFn: () => revealRoom(roomId),
    onSuccess: () =>
      queryClient.setQueryData<Room>(
        ["room"],
        (oldData) =>
          oldData && {
            ...oldData,
            revealed: true,
          }
      ),
  });

  return (
    <div className={styles.controls}>
      {room.revealed ? (
        <Button
          onClick={resetMutation.mutate}
          text="Reset Round"
          variant={room.theme}
        />
      ) : (
        <Button
          onClick={revealMutation.mutate}
          text="Reveal Votes"
          variant={room.theme}
          disabled={noVotes}
        />
      )}
    </div>
  );
};

export default VoteControls;

"use client";

import { getRoom, getUsers, resetRoom, revealRoom } from "@/lib/api";
import type { Room, User } from "@/types";
import Button from "@/components/Button/Button";

import styles from "./VoteControls.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/Providers";

interface VoteControlsProps {
  roomId: string;
  initialRoom: Room;
  initialUsers: User[];
}

const VoteControls = ({
  roomId,
  initialRoom,
  initialUsers,
}: VoteControlsProps) => {
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

  const noVotes = users.every(({ vote }) => vote === null);

  const resetMutation = useMutation({
    mutationFn: () => resetRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const revealMutation = useMutation({
    mutationFn: () => revealRoom(roomId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room"] }),
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
